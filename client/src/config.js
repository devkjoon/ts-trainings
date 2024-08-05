const API_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://ts-trainings-2f55296deb14.herokuapp.com' // Use actual Heroku app URL
    : 'http://localhost:5000';

export default API_URL;
