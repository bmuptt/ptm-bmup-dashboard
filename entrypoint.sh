#!/bin/sh

# Generate env.js dengan environment yang ada
envsubst < /usr/share/nginx/html/env.template.js > /usr/share/nginx/html/env.js

# Jalankan Nginx
exec nginx -g "daemon off;"
