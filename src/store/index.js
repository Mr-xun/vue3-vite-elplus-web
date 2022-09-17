import { createStore } from "vuex";

import getters from "./getters";
import app from "./modules/app";
import settings from "./modules/settings";
import account from "./modules/account";
import basic from "./modules/basic";

export const store = createStore({
    modules: {
        app,
        settings,
        account,
        basic
    },
    getters,
});

export default store;
