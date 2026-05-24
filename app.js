/**
 * ⚡ GitHub Finder 핵심 구동 스크립트 (app.js)
 * 
 * 이 스크립트는 깃허브 서버와 실시간으로 통신하여 데이터를 카드에 채워 넣는
 * "똑똑한 웨이터"의 역할을 수행합니다.
 */

// 1. 필요한 화면 요소(HTML 엘리먼트)들을 불러와 이름표를 붙여줍니다.
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const profileContainer = document.getElementById('profile-container');
const reposContainer = document.getElementById('repos-container');
const statusMessage = document.getElementById('status-message');
const statusText = document.getElementById('status-text');

// 초기 화면 가이드 카드 및 검색 결과 그리드 판넬을 제어하기 위해 불러옵니다.
const guideContainer = document.getElementById('guide-container');
const resultGrid = document.getElementById('result-grid');
const topicHeader = document.getElementById('topic-header');
const topicKeyword = document.getElementById('topic-keyword');

// 2. 깃허브 API 통신을 담당하는 클래스(도구 상자)입니다.
class GithubAPI {
    constructor() {
        this.baseUrl = 'https://api.github.com/users';
    }

    // [기능 A] 특정 사용자의 프로필 정보를 가져오는 함수
    async getUserProfile(username) {
        const response = await fetch(`${this.baseUrl}/${username}`);
        
        if (!response.ok) {
            throw new Error(response.status === 404 ? '존재하지 않는 사용자입니다 😢' : '서버 오류가 발생했습니다.');
        }
        
        return await response.json();
    }

    // [기능 B] 특정 사용자의 저장소 목록을 가져오는 함수
    async getUserRepos(username) {
        // 스타 개수대로 정렬을 제대로 하기 위해 최근 저장소를 최대 100개까지 넉넉히 불러옵니다.
        const response = await fetch(`${this.baseUrl}/${username}/repos?per_page=100&sort=updated`);
        
        if (!response.ok) {
            throw new Error('저장소 정보를 불러올 수 없습니다.');
        }
        
        return await response.json();
    }

    // [피드백 반영 - 기능 G] 특정 주제(Topic)에 관한 전 세계 저장소들을 스타순으로 가져오는 함수
    async searchReposByTopic(topic) {
        // 피드백 반영: 3열 4행(총 12개)을 꽉 채우기 위해 per_page=12로 12개의 글로벌 인기 저장소를 불러옵니다!
        const response = await fetch(`https://api.github.com/search/repositories?q=topic:${topic}&sort=stars&order=desc&per_page=12`);
        
        if (!response.ok) {
            throw new Error('해당 주제에 관한 저장소 정보를 찾을 수 없습니다.');
        }
        
        const data = await response.json();
        return data.items; // 검색 결과 저장소들의 리스트
    }
}

// 3. 데이터를 받아와 화면에 예쁘게 그려주는 클래스(디자이너)입니다.
class UI {
    // [기능 C] 프로필 영역을 꾸미는 함수 (검색창 바로 하단에 와이드 가로 배치형으로 노출)
    showProfile(user) {
        const name = user.name || user.login;
        const bio = user.bio || '이 사용자는 아직 소개글을 작성하지 않았습니다.';
        
        profileContainer.innerHTML = `
            <div class="profile-card">
                <!-- 1. 왼쪽: 프로필 이미지 구역 -->
                <div class="profile-left">
                    <div class="avatar-wrapper">
                        <img src="${user.avatar_url}" alt="${name}의 프로필 사진" class="profile-avatar">
                    </div>
                </div>
                
                <!-- 2. 오른쪽: 이름, 소개글, 통계 수치 및 링크 버튼이 모여 있는 구역 -->
                <div class="profile-right">
                    <div class="profile-header-info">
                        <h3 class="user-name">${name}</h3>
                        <span class="user-login">@${user.login}</span>
                    </div>
                    
                    <p class="user-bio">${bio}</p>
                    
                    <!-- 3. 통계 매핑 정보: 팔로워, 팔로잉, 저장소 수 -->
                    <div class="stats-container">
                        <div class="stat-item">
                            <span class="stat-val">${user.followers.toLocaleString()}</span>
                            <span class="stat-label">팔로워</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-val">${user.following.toLocaleString()}</span>
                            <span class="stat-label">팔로잉</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-val">${user.public_repos.toLocaleString()}</span>
                            <span class="stat-label">저장소</span>
                        </div>
                    </div>
                    
                    <!-- 2. 프로필 매핑 정보: 외부 깃허브 링크 연동 -->
                    <a href="${user.html_url}" target="_blank" class="visit-profile-btn">
                        <i class="fab fa-github"></i> GitHub 방문하기
                    </a>
                </div>
            </div>
        `;
    }

    // [기능 D] 저장소 목록을 화면에 출력하는 함수 (스타 순 정렬 & 컴팩트 카드 & 토픽 분류 태그 포함)
    showRepos(repos, limit = 6) {
        const sortedRepos = repos.sort((a, b) => b.stargazers_count - a.stargazers_count);
        const displayRepos = sortedRepos.slice(0, limit);
        
        if (displayRepos.length === 0) {
            reposContainer.innerHTML = `
                <div class="repo-card" style="grid-column: 1 / -1; justify-content: center; align-items: center; color: var(--text-secondary); min-height: 120px;">
                    <i class="fas fa-folder-open" style="font-size: 1.8rem; margin-bottom: 8px;"></i>
                    <span>공개된 저장소가 없습니다.</span>
                </div>
            `;
            return;
        }

        // 저장소 정보를 HTML 템플릿으로 변환하여 화면에 채웁니다.
        reposContainer.innerHTML = displayRepos.map(repo => {
            const desc = repo.description || '이 저장소에는 설명이 기록되지 않았습니다.';
            
            // 피드백 반영: 개별 리포지토리 카드 내부에 깃허브 토픽 분류태그(topics)를 출력합니다.
            // 가독성을 위해 상위 3~4개의 태그만 가져옵니다.
            const tags = repo.topics && repo.topics.length > 0
                ? `<div class="repo-tags">
                     ${repo.topics.slice(0, 4).map(topic => `<span class="repo-tag">#${topic}</span>`).join('')}
                   </div>`
                : '';
                
            return `
                <div class="repo-card">
                    <div class="repo-info">
                        <!-- 4. 목록 매핑: 저장소 이름 및 외부 바로가기 링크 연결 -->
                        <a href="${repo.html_url}" target="_blank" class="repo-name">
                            <i class="fas fa-book-bookmark"></i> ${repo.name}
                        </a>
                        <!-- 피드백 반영: 리포지토리 소개설명 -->
                        <p class="repo-desc" title="${desc}">${desc}</p>
                        <!-- 피드백 반영: 분류태그 목록 출력 -->
                        ${tags}
                    </div>
                    <div class="repo-meta">
                        <!-- 별점(스타) 표시 배지 -->
                        <span class="star-badge">
                            <i class="fas fa-star"></i> ${repo.stargazers_count.toLocaleString()}
                        </span>
                        <!-- 외부 Github 링크로 갈 수 있는 화살표 버튼 -->
                        <a href="${repo.html_url}" target="_blank" class="repo-link-btn" title="Github에서 저장소 보기" aria-label="${repo.name} 저장소 외부 링크">
                            <i class="fas fa-arrow-up-right-from-square"></i>
                        </a>
                    </div>
                </div>
            `;
        }).join('');
    }

    // [기능 E] 상태메시지 보드를 켜고 끄는 함수
    showMessage(text, type = 'info') {
        statusText.textContent = text;
        statusMessage.className = `status-message ${type}`; 
    }

    // [기능 F] 상태메시지를 조용히 숨기는 함수
    hideMessage() {
        statusMessage.className = 'status-message hidden';
    }
}

// 4. 앱의 흐름(컨트롤러)을 지휘하는 핵심 제어 파트입니다.
const github = new GithubAPI();
const ui = new UI();

// [조회 실행 로직] 실제 API 호출과 UI 바인딩을 주도하는 메인 함수
async function performSearch(query) {
    if (!query || query.trim() === '') {
        ui.showMessage('검색어를 입력해 주세요. (사용자명은 @를 앞에 달아 검색)', 'error');
        return;
    }

    const trimmedQuery = query.trim();
    ui.hideMessage();

    // 피드백 반영: 접두어에 @가 붙어 있는지 체크하여 똑똑하게 검색 모드를 자동 판정합니다!
    const isUserSearch = trimmedQuery.startsWith('@');

    if (isUserSearch) {
        // [A] 개발자 사용자 검색 모드 (예: @github -> github 계정 조회)
        const username = trimmedQuery.substring(1); // 앞의 골뱅이(@) 기호를 떼어냅니다.
        
        if (username.trim() === '') {
            ui.showMessage('검색할 사용자 아이디를 @ 뒤에 적어주세요. (예: @github)', 'error');
            return;
        }

        ui.showMessage(`${username} 사용자를 탐색하는 중...`, 'info');

        try {
            // 프로필 정보와 저장소 정보를 병렬로 빠르게 받아옵니다.
            const [profile, repos] = await Promise.all([
                github.getUserProfile(username),
                github.getUserRepos(username)
            ]);

            // 가이드 화면 감추고 결과 보드를 노출합니다.
            guideContainer.classList.add('hidden');
            resultGrid.classList.remove('hidden');
            
            // 사용자 검색 결과이므로 프로필 카드는 노출하고 주제 헤더는 감춥니다.
            profileContainer.classList.remove('hidden');
            topicHeader.classList.add('hidden');

            // 데이터를 화면에 렌더링합니다. (사용자 저장소는 스타가 많은 순서대로 3열 2줄(6개) 출력)
            ui.showProfile(profile);
            ui.showRepos(repos, 6);
            ui.hideMessage(); 
        } catch (error) {
            console.error(error);
            ui.showMessage(error.message || '데이터를 가져오는 중 문제가 발생했습니다.', 'error');
        }
    } else {
        // [B] 주제(Topic) 검색 모드 (예: react -> react 주제 저장소 조회)
        ui.showMessage(`${trimmedQuery} 주제의 인기 저장소를 탐색하는 중...`, 'info');

        try {
            // 해당 주제의 전 세계 저장소들을 스타순으로 가져옵니다 (3열 4행 12개 출력).
            const repos = await github.searchReposByTopic(trimmedQuery);

            // 가이드 화면 감추고 결과 보드를 노출합니다.
            guideContainer.classList.add('hidden');
            resultGrid.classList.remove('hidden');
            
            // 주제 검색 결과이므로 프로필 카드 영역은 숨기고 주제 헤더를 전면에 띄웁니다.
            profileContainer.classList.add('hidden');
            topicHeader.classList.remove('hidden');
            topicKeyword.textContent = trimmedQuery; // 타이틀에 검색한 주제명 세팅

            // 데이터를 화면에 렌더링합니다. (주제 검색 결과는 3열 4행 총 12개 카드로 꽉 채움)
            ui.showRepos(repos, 12);
            ui.hideMessage();
        } catch (error) {
            console.error(error);
            ui.showMessage(error.message || '데이터를 가져오는 중 문제가 발생했습니다.', 'error');
        }
    }
}

// 5. 이벤트 리스너: 사용자의 입력 행동을 감지합니다.

// [A] 검색 버튼 클릭 시 검색 실행
searchBtn.addEventListener('click', () => {
    const query = searchInput.value;
    performSearch(query);
});

// [B] 입력창에서 Enter 키를 눌렀을 때도 편리하게 검색 실행
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value;
        performSearch(query);
    }
});

// [C] 피드백 반영: 가이드의 추천 태그를 클릭했을 때 검색창에 키워드를 채워주고 자동으로 실행합니다.
// 접두어 @ 존재 유무에 따라 시스템이 알아서 검색 타입을 판정하므로, 모드를 넘겨줄 필요가 없어 매우 스마트해졌습니다!
window.fillExample = function(query) {
    searchInput.value = query;
    performSearch(query);
};

// [D] 페이지가 최초로 브라우저에 로드되었을 때 (초기화)
document.addEventListener('DOMContentLoaded', () => {
    searchInput.value = '';
    searchInput.focus(); // 첫 화면에서 검색창에 자동으로 커서를 깜빡이게 유도합니다.
});
