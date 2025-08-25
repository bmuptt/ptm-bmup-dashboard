FROM nginx:1.27.3-alpine-slim

RUN rm -rf /etc/nginx/conf.d/*
COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf

COPY --from=fe-erp-project_fe_erp /app/dist /usr/share/nginx/html

RUN apk add --no-cache gettext

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80

CMD ["/entrypoint.sh"]
