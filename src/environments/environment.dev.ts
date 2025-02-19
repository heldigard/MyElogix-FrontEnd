declare const window: any;

export const environment = {
  production: false,
  apiVersion: '/v1',
  get API_URL() {
    // Orden de prioridad: Variable de entorno > window > valor por defecto
    return (
      process.env['API_URL'] ?? window.API_URL ?? 'http://localhost:8080/api'
    );
  },
  get JWT_SECRET() {
    return (
      process.env['JWT_SECRET'] ?? window.JWT_SECRET ?? 'default-secret-key'
    );
  },
  get JWT_EXPIRATION() {
    return process.env['JWT_EXPIRATION'] ?? window.JWT_EXPIRATION ?? 14400000;
  },
  get JWT_REFRESH_EXPIRATION() {
    return (
      process.env['JWT_REFRESH_EXPIRATION'] ??
      window.JWT_REFRESH_EXPIRATION ??
      28800000
    );
  },
};
