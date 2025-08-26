FROM nginx:1.27.3-alpine-slim

RUN rm -rf /etc/nginx/conf.d/*
COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf

COPY --from=ptm-bmup-dashboard-ptm_bmup_dashboard /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
