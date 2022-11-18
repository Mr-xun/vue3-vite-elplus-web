/*
 * @Author: xunxiao
 * @Date: 2022-09-27 14:04:13
 * @LastEditors: xunxiao
 * @LastEditTime: 2022-11-18 09:11:54
 * @Description: export all api
 * use api[moduleName][apiName]
 */
const modulesFiles = import.meta.globEager("./requests/*.api.js");

const modules = Object.keys(modulesFiles).reduce((modules, modulePath) => {
    // set './modules/account.js' => 'account'
    const moduleName = modulePath.replace(/(.*\/)*([^.]+).*/gi, "$2");
    modules[moduleName] = modulesFiles[modulePath]?.default;
    return modules;
}, {});

export default modules;
