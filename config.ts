import { LOCAL_URL, PROD_URL } from '@env';

const BASE_URL = __DEV__ ? LOCAL_URL : PROD_URL;

export { BASE_URL };
