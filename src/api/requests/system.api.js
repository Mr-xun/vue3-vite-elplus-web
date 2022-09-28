/*
 * @Author: xunxiao 17810204418@163.com
 * @Date: 2022-09-18 17:06:54
 * @LastEditors: xunxiao
 * @LastEditTime: 2022-09-28 14:25:39
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
        return request.post("/system/menu/create", params);
    },
    system_menu_update(params) {
        //更新菜单
        return request.put("/system/menu/update", params);
    },
    system_menu_delete(deleteIds) {
        //删除菜单
        return request.delete(`/system/menu/delete/${deleteIds}`);
    },
    system_menu_tree(params) {
        //查询菜单tree
        return request.get("/system/menu/tree", params);
    },
    system_role_create(params) {
        //新增角色
        return request.post("/system/role/create", params);
    },
    system_role_update(params) {
        //更新角色
        return request.put("/system/role/update", params);
    },
    system_role_delete(deleteIds) {
        //删除角色
        return request.delete(`/system/role/delete/${deleteIds}`);
    },
    system_role_list(params) {
        //查询角色（分页）
        return request.get("/system/role/list", {params});
    },
    system_dept_create(params) {
        //新增部门
        return request.post("/system/dept/create", params);
    },
    system_dept_update(params) {
        //更新部门
        return request.put("/system/dept/update", params);
    },
    system_dept_delete(deleteIds) {
        //删除部门
        return request.delete(`/system/dept/delete/${deleteIds}`);
    },
    system_dept_tree(params) {
        //查询部门tree
        return request.get("/system/dept/tree", params);
    },
};
