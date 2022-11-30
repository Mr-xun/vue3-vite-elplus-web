/*
 * @Author: xunxiao
 * @Date: 2022-09-27 14:04:13
 * @LastEditors: xunxiao
 * @LastEditTime: 2022-11-30 14:14:42
 * @Description: export all api
 * use api[apiName]
 */
const modulesFiles = import.meta.globEager("./requests/*.api.js");

const modules = Object.keys(modulesFiles).reduce((modules, modulePath) => {
    // set './modules/account.js' => 'account'
    modules = modulesFiles[modulePath]?.default;
    return modules;
}, {});
export default modules;
