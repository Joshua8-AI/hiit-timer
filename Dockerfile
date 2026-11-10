# Slim variant: no curl and no geoip/image-filter/xslt/njs modules, which is
# where most of the image's CVEs lived (libcurl, expat, tiff, libxml2, ...).
FROM nginxinc/nginx-unprivileged:alpine-slim

USER root
# Pick up Alpine security fixes published after the base image was built.
RUN apk upgrade --no-cache \
    && rm -rf /usr/share/nginx/html/*
COPY src/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/nginx.conf
COPY default.conf /etc/nginx/conf.d/default.conf
# Root-owned and read-only to the nginx user: a compromised worker must not be
# able to rewrite the pages it serves or its own config.
RUN chown -R root:root /usr/share/nginx/html /etc/nginx/nginx.conf /etc/nginx/conf.d \
    && chmod -R u=rwX,go=rX /usr/share/nginx/html /etc/nginx/nginx.conf /etc/nginx/conf.d
USER nginx

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -q --spider http://127.0.0.1:8080/ || exit 1
