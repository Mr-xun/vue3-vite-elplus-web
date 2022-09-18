//站点默认请求baseURL
const WEBSIT = process.env.VUE_APP_BASE_WEBSIT;
const SPECIAL_WEBSIT = ['trt', 'fs']; //特殊站点（分内外网）
let baseURL = process.env.VUE_APP_BASE_API;
if (
    process.env.NODE_ENV !== 'development' &&
    SPECIAL_WEBSIT.indexOf(WEBSIT) !== -1
) {
    baseURL = `${window.location.origin}/api/`;
}
export default baseURL;
