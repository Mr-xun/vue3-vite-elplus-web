//基础数据
import { localDB } from "@/utils/storage";

export default {
    namespaced: true,
    state: {
        businessSource: localDB.get("BUSINESS_SOURCE"),//业务来源
    },
    mutations: {
        setBusinessSource(state, val) {
            localDB.save("BUSINESS_SOURCE", val);
            state.businessSource = val;
        },
        
    },
}