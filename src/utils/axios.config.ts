import _ from 'axios';
import Cookies from 'js-cookie';
const baseUrl = import.meta.env.VITE_API_URL || 'https://jsonplaceholder.typicode.com';

const axios = _.create({
   baseURL: baseUrl,
   headers: {
      Authorization: `Bearer ${Cookies.get('token') ?? sessionStorage.getItem('token')}`,
   },
});

export const api = _.create({
   baseURL: baseUrl,
});

export const AuthApi = _.create({
   baseURL: baseUrl,
   headers: {
      Authorization: `Bearer ${Cookies.get('token') ?? sessionStorage.getItem('token')}`,
   },
});

export default axios;
