/*
 * @Author: xunxiao
 * @Date: 2022-09-19 08:24:40
 * @LastEditors: xunxiao
 * @LastEditTime: 2022-09-19 16:42:30
 * @Description: Vuex Entry
 */
import { createStore } from "vuex";

import getters from "./getters";
import app from "./modules/app";
import setting from "./modules/setting";
import account from "./modules/account";
import basic from "./modules/basic";
import tagsView from "./modules/tagsView";

export const store = createStore({
    modules: {
        app,
        setting,
        account,
        basic,
        tagsView,
    },
    getters,
});

export default store;
