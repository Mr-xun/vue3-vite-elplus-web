/*
 * @Author: xunxiao 17810204418@163.com
 * @Date: 2022-09-18 17:06:54
 * @LastEditors: xunxiao 17810204418@163.com
 * @LastEditTime: 2022-09-25 16:30:00
 * @Description: 系统接口
 */

import request from "@/utils/request";
import getUrl from "@/utils/get-url";
export default {
    /**
     * 埋点报表
     */
    queryTrackInfoReport(params) {
        return request.post(getUrl(`/signTrack/queryTrackInfoReport`), params);
    },
    /**
     * 埋点报表默认导出
     */
    exportTrackInfoReport() {
        return request.post(
            getUrl(`/signTrack/exportTrackInfoReport`),
            {},
            {
                responseType: "blob",
            }
        );
    },
    /**
     * 埋点报表按时间导出
     */
    exportTrackCountReport(params) {
        return request.post(getUrl(`/signTrack/exportTrackCountReport`), params, {
            responseType: "blob",
        });
    },
    login(params) {
        //用户登录
        return request.post("/system/user/login", params);
    },
    system_user_all(params = {}) {
        //查询所有用户
        return request.post("/system/user/getAllUsers", params);
    },
    system_menu_create(params) {
        //新增菜单
        return request.jsonPost("/system/menu/create", params);
    },
};
