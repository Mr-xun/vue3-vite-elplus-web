/*
 * @Author: xunxiao
 * @Date: 2023-02-20 13:53:42
 * @LastEditors: xunxiao
 * @LastEditTime: 2023-02-20 13:54:31
 * @Description: 日志模块接口
 */
import request from "@/utils/request";
export default {
    log_login_delete(deleteIds) {
        //删除登录日志
        return request.delete(`/log/login/delete/${deleteIds}`);
    },
    log_login_list(params) {
        //查询登录日志（分页）
        return request.get("/log/login/list", { params });
    },
    log_login_all(params = {}) {
        //查询所有登录日志
        return request.get("/log/login/all", { params });
    },
    log_operation_delete(deleteIds) {
        //删除操作日志
        return request.delete(`/log/operation/delete/${deleteIds}`);
    },
    log_operation_list(params) {
        //查询操作日志（分页）
        return request.get("/log/operation/list", { params });
    },
    log_operation_all(params = {}) {
        //查询所有操作日志
        return request.get("/log/operation/all", { params });
    },
};
