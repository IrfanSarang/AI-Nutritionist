// config/url.ts

const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.PROD_URL
    : process.env.LOCAL_URL;

export default BASE_URL;
