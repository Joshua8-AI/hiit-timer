FROM nginxinc/nginx-unprivileged:alpine

USER root
COPY src/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/nginx.conf
COPY default.conf /etc/nginx/conf.d/default.conf
RUN chown -R nginx:nginx /usr/share/nginx/html /etc/nginx/nginx.conf /etc/nginx/conf.d/default.conf
USER nginx

EXPOSE 8080
