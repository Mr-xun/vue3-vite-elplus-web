//用户账号相关
import { localDB } from "@/utils/storage";
export default {
    namespaced: true,
    state: {
        token: localDB.get("token"),
        userInfo: localDB.get("USER_INFO") || localDB.get("userInfo"),
    },
    mutations: {
        setToken(state, val) {
            localDB.save("token", val);
            state.token = val;
        },
        setUserInfo(state, val) {
            localDB.save("USER_INFO", val);
            state.userInfo = val;
        },
    },
};
