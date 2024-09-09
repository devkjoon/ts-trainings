const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : '/api';

export default API_URL;
