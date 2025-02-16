#!/bin/sh

# Crear el archivo de configuración con las variables de entorno
cat <<EOF > /usr/share/nginx/html/assets/env-config.js
window.API_URL = '${API_URL}';
window.JWT_SECRET = '${JWT_SECRET}';
window.JWT_EXPIRATION = ${JWT_EXPIRATION};
window.JWT_REFRESH_EXPIRATION = ${JWT_REFRESH_EXPIRATION};
EOF

# Iniciar nginx
nginx -g 'daemon off;'
