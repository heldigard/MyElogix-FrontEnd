declare const window: any;

export const environment = {
  production: false,
  apiVersion: '/v1',
  get API_URL() {
    // Orden de prioridad: window > valor por defecto
    // Si el valor es igual al placeholder, usar el valor por defecto
    return window.API_URL && window.API_URL !== '%API_URL%'
      ? window.API_URL
      : 'http://localhost:8080/api';
  },
  get WS_URL() {
    return window.WS_URL && window.WS_URL !== '%WS_URL%'
      ? window.WS_URL
      : 'http://localhost:8080/ws';
  },

  get JWT_SECRET() {
    return window.JWT_SECRET && window.JWT_SECRET !== '%JWT_SECRET%'
      ? window.JWT_SECRET
      : 'default-secret-key';
  },

  get JWT_EXPIRATION() {
    return window.JWT_EXPIRATION && window.JWT_EXPIRATION !== '%JWT_EXPIRATION%'
      ? window.JWT_EXPIRATION
      : 14400000;
  },

  get JWT_REFRESH_EXPIRATION() {
    return window.JWT_REFRESH_EXPIRATION &&
      window.JWT_REFRESH_EXPIRATION !== '%JWT_REFRESH_EXPIRATION%'
      ? window.JWT_REFRESH_EXPIRATION
      : 28800000;
  },
};
