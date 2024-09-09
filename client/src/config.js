const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://ts-trainings.com'
  : 'http://localhost:5000';

console.log('API_URL:', API_URL);

export default API_URL;
