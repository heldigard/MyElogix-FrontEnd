export const environment = {
  production: true,
  apiVersion: '/v1',
  apiURL: process.env.API_URL || 'https://localhost:8080/api',
  JWT_SECRET:
    process.env.JWT_SECRET ||
    '9f84c5bcb3e6a0fdbdca7bd1acae0bce47ef1c9edeeffecc3fc3bc2afad6bfea9a',
};
