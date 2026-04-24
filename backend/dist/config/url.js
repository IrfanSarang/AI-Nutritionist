"use strict";
// config/url.ts
Object.defineProperty(exports, "__esModule", { value: true });
const BASE_URL = process.env.NODE_ENV === 'production'
    ? process.env.PROD_URL
    : process.env.LOCAL_URL;
exports.default = BASE_URL;
//# sourceMappingURL=url.js.map