/*
 * @Author: xunxiao
 * @Date: 2023-02-23 17:04:20
 * @LastEditors: xunxiao
 * @LastEditTime: 2023-02-24 11:10:34
 * @Description: 基础档案模块接口
 */
import request from "@/utils/request";
export default {
    basic_enumType_create(params) {
        //新增枚举类型
        return request.post("/basic/enumType/create", params);
    },
    basic_enumType_update(params) {
        //更新枚举类型
        return request.put("/basic/enumType/update", params);
    },
    basic_enumType_delete(deleteIds) {
        //批量删除枚举类型
        return request.delete(`/basic/enumType/delete/${deleteIds}`);
    },
    basic_enumType_list(params) {
        //查询枚举类型（分页）
        return request.get("/basic/enumType/list", { params });
    },
    basic_enumType_all() {
        //查询全部枚举类型
        return request.get("/basic/enumType/all", { params });
    },
    basic_enumType_allDict() {
        //查询全部枚举类型字典
        return request.get("/basic/enumType/allDict", { params });
    },
    basic_enum_create(params) {
        //新增枚举字典
        return request.post("/basic/enum/create", params);
    },
    basic_enum_update(params) {
        //更新枚举字典
        return request.put("/basic/enum/update", params);
    },
    basic_enum_delete(deleteIds) {
        //批量删除枚举字典
        return request.delete(`/basic/enum/delete/${deleteIds}`);
    },
    basic_enum_list(params) {
        //查询枚举字典（分页）
        return request.get("/basic/enum/list", { params });
    },
    basic_enum_all() {
        //查询全部枚举字典
        return request.get("/basic/enum/all", { params });
    },
    basic_enum_allByType(params) {
        //查询全部枚举字典通过枚举字典
        return request.get("/basic/enum/allByType", { params });
    },
};
