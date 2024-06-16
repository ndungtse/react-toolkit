import Cookies from 'js-cookie';

export const getCookie = (name: string) => Cookies.get(name);
export const setCookie = (name: string, value: string | number, options?: Cookies.CookieAttributes) =>
   Cookies.set(name, String(value), options);
export const removeCookie = (name: string) => Cookies.remove(name);
