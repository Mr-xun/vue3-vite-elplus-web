/**
 * 技术中台接口
 */
import request from "@/utils/request";
import getUrl from "@/utils/get-url";
const middleground = {
   /**
     * 获取用户信息
     */
    getCurrentUserInfo: function () {
        return request.get(
            getUrl(`/tcweb-service/userManage/getCurrentUserInfo`, 3)
        );
    },
    /**
     * 获取静态资源
     * typeCode=PCTree代表省市
     * typeCode=AreaTree代表省市区
     */
    getAllCity: function (typeCode) {
        return request.get(
            getUrl(`/cs-sys-dict/dict/csDc/tree/${typeCode}`, 3)
        );
    },
    /**
     * 获取静态资源
     * @param {*} typeCode
     * @param {*} key1
     * @param {*} key2
     */
    getDictList: function (typeCode, key1, key2) {
        let queryParams = { typeCode, key1, key2 };
        return request.get(getUrl(`/cs-sys-dict/dict/csDc/listAll`, 3), {
            params: queryParams,
        });
    },
};

export default middleground;
