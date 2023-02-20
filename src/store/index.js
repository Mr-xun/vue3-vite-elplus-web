/*
 * @Author: xunxiao
 * @Date: 2022-09-19 08:24:40
 * @LastEditors: xunxiao
 * @LastEditTime: 2023-02-20 09:47:38
 * @Description: Vuex Entry
 */
import { createStore } from "vuex";
import getters from "./getters";

const modulesFiles = import.meta.globEager("./modules/*.js");

const modules = Object.keys(modulesFiles).reduce((modules, modulePath) => {
    // set './modules/account.js' => 'account'
    const moduleName = modulePath.replace(/^\.\/modules\/(.*)\.\w+$/, "$1");
    modules[moduleName] = modulesFiles[modulePath]?.default;
    return modules;
}, {});

export const store = createStore({
    modules,
    getters,
});

export default store;
