import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://api.printful.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${import.meta.env.VITE_PRINTFUL_API_KEY}`,
  },
});
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default instance;
