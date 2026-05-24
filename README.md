# 🌌 GitHub Finder

> **깃허브의 전 세계 사용자 프로필과 인기 오픈소스 저장소를 실시간으로 스마트하게 검색하고 탐색하는 반응형 웹 애플리케이션입니다.**

본 프로젝트는 **Vanilla HTML, CSS, JavaScript**만을 사용하여 구현되었으며, 깃허브 API를 연동하여 세련되고 모던한 UI(글래스모피즘, 네온 그라데이션)로 데이터를 보여줍니다.

---

## ✨ 주요 기능 (Key Features)

1. **👤 스마트 개발자 검색 (User Profiling)**
   - 검색어 앞에 `@` 기호를 붙여 검색합니다. (예: `@DropCoffee0511`)
   - 해당 사용자의 아바타 이미지, 닉네임, 소개글(Bio), 팔로워 및 팔로잉 수, 공개 저장소 개수를 가로 와이드 카드로 보여줍니다.
   - 해당 개발자의 공개 저장소 중 **스타(Star) 개수가 가장 높은 인기 저장소 6개**를 정렬하여 보여줍니다.

2. **🏷️ 기술 주제 검색 (Topic Search)**
   - `@` 기호 없이 기술명이나 키워드를 검색합니다. (예: `react`, `python`)
   - 해당 키워드를 주제로 하는 전 세계 저장소 중 **스타(Star) 개수가 가장 높은 인기 저장소 12개**를 3열 4행 박스 그리드로 가득 채워 보여줍니다.
   - 각 저장소 카드 내부에는 깃허브 토픽 분류 태그(`#react`, `#frontend` 등)가 함께 출력되어 직관적입니다.

3. **💡 추천 키워드 및 원클릭 자동 검색**
   - 첫 화면의 가이드 카드에 제공되는 추천 배지를 클릭하면 자동으로 검색창에 입력되고 즉시 검색이 수행되어 사용자 편의성을 높였습니다.

4. **📱 모던 & 반응형 디자인**
   - 데스크톱뿐만 아니라 태블릿, 모바일 기기에서도 화면 크기에 맞추어 레이아웃이 자연스럽게 변경되는 그리드 디자인 시스템을 적용했습니다.

---

## 🛠️ 기술 스택 (Tech Stack)

- **Markup**: `HTML5` (시맨틱 구조화)
- **Styling**: `Vanilla CSS3` (CSS 변수 활용 테마, 밤하늘 네온 애니메이션, Flexbox/Grid)
- **Logic**: `Vanilla JavaScript (ES6)` (클래스 기반 API 및 UI 컴포넌트 관리, Async/Await 비동기 통신)
- **API**: `GitHub REST API`
- **Icon**: `FontAwesome 6`

---

## 📝 깃허브 업로드 작업 및 프롬프트 로그 (Deployment & Prompt Logs)

이 프로젝트가 로컬 컴퓨터에서 깃허브 원격 저장소(`https://github.com/DropCoffee0511/sb3_github_finder`)로 업로드되기까지의 작업 내역과 프롬프트 로그입니다.

### 1단계: 프로젝트 환경 분석 (Analysis)
- **상황**: 로컬 폴더에 깃(Git)이 이미 상위 홈 디렉터리(`C:/Users/chengziacc2`) 기준으로 설정되어 있어, 프로젝트 폴더만 따로 관리되지 않고 있었습니다.
- **해결책**: 프로젝트 전용 폴더(`sb3_githubfinder`) 내부에 새롭고 독립된 깃 저장소를 생성하기로 결정했습니다.

### 2단계: 로컬 깃 저장소 새로 만들기 (Initialize)
- **이유**: `sb3_githubfinder` 폴더만을 위한 전용 독립 깃 저장소를 만들기 위함입니다.
- **명령어**:
  ```bash
  git init
  ```
- **결과**: `C:/Users/chengziacc2/projects/sb3_githubfinder/.git/` 하위에 빈 깃 저장소가 생성되었습니다.

### 3단계: 사용자 정보(작성자) 설정 (Config)
- **이유**: 깃허브에 올릴 때 커밋 기록(기록서)에 작성자 이름과 이메일 주소를 정확히 기재하기 위함입니다.
- **명령어**:
  ```bash
  git config user.name "DropCoffee0511"
  git config user.email "sonsc076@gmail.com"
  ```
- **결과**: 이 프로젝트 로컬 설정에 이름과 이메일 주소가 올바르게 등록되었습니다.

### 4단계: 코드 파일 준비 및 최초 기록 생성 (Stage & Commit)
- **이유**: 프로젝트 소스 코드 파일들을 깃에 추가하고 최초 상태를 기록(커밋)으로 남기기 위함입니다.
- **명령어**:
  ```bash
  git add .
  git commit -m "Initial commit"
  ```
- **결과**: `.gitignore`, `app.js`, `index.html`, `style.css` 4개의 파일이 최초 커밋(`Initial commit`)으로 저장되었습니다.

### 5단계: 기본 브랜치 이름 변경 (Rename Branch)
- **이유**: 깃의 기본 브랜치명인 `master`를 깃허브의 권장 및 표준 이름인 `main`으로 바꿉니다.
- **명령어**:
  ```bash
  git branch -M main
  ```
- **결과**: 기본 브랜치가 `main`으로 성공적으로 변경되었습니다.

### 6단계: 깃허브 원격 저장소 연결 (Link Remote)
- **이유**: 내 컴퓨터의 로컬 깃 저장소와 실제 인터넷 깃허브 저장소 주소를 연동하기 위함입니다.
- **명령어**:
  ```bash
  git remote add origin https://github.com/DropCoffee0511/sb3_github_finder
  ```
- **결과**: 원격 저장소 이름(`origin`)으로 깃허브 주소가 올바르게 등록되었습니다.

### 7단계: 최종 업로드 (Push)
- **이유**: 내 컴퓨터에 저장된 깃 커밋 내역과 실제 소스 코드를 연결된 깃허브 원격 저장소로 보내기 위함입니다.
- **명령어**:
  ```bash
  git push -u origin main
  ```
- **결과**: 깃허브 인증을 성공적으로 통과하고 모든 코드가 `main` 브랜치에 안전하게 업로드되었습니다.

---

## 🚀 프로젝트 실행 방법 (How to Run)

1. 이 저장소를 로컬 컴퓨터로 복제(Clone)합니다.
   ```bash
   git clone https://github.com/DropCoffee0511/sb3_github_finder.git
   ```
2. 프로젝트 폴더로 이동합니다.
   ```bash
   cd sb3_github_finder
   ```
3. 브라우저에서 `index.html` 파일을 직접 실행하거나, VS Code의 Live Server 확장을 사용하여 개발 서버를 실행해 접속합니다.
