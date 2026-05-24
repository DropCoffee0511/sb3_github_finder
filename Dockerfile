FROM nginx:alpine

# 프로젝트 정적 파일들을 Nginx 기본 웹 디렉터리로 복사합니다.
COPY index.html /usr/share/nginx/html/index.html
COPY style.css /usr/share/nginx/html/style.css
COPY app.js /usr/share/nginx/html/app.js
COPY README.md /usr/share/nginx/html/README.md

# Nginx의 기본 웹 포트인 80번을 개방합니다.
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
