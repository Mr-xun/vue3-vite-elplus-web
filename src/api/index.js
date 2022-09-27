/*
 * @Author: xunxiao
 * @Date: 2022-09-27 14:04:13
 * @LastEditors: xunxiao
 * @LastEditTime: 2022-09-27 14:14:39
 * @Description: export all api
 */
let api = {};
const files = import.meta.globEager('./requests/*\.api\.js');
Object.keys(files).forEach((fileName) => {
    Object.assign(api,files[fileName].default)
});
export default api;