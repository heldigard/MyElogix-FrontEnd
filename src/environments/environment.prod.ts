declare const window: any;

export const environment = {
  production: true,
  apiVersion: '/v1',
  API_URL: window.API_URL,
  WS_URL: window.WS_URL,
  JWT_SECRET: window.JWT_SECRET,
  JWT_EXPIRATION: window.JWT_EXPIRATION,
  JWT_REFRESH_EXPIRATION: window.JWT_REFRESH_EXPIRATION,
};
