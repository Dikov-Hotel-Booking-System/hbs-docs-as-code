FROM nginxinc/nginx-unprivileged:stable-alpine

COPY build/ /usr/share/nginx/html/

EXPOSE 8080
