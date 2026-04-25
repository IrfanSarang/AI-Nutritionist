const BASE_URL = __DEV__
  ? 'http://192.168.0.101:5000' // local dev server
  : ''; // production server

export default BASE_URL;
