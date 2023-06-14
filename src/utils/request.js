/*
 * @Author: xunxiao 17810204418@163.com
 * @Date: 2022-09-17 21:10:34
 * @LastEditors: xunxiao
 * @LastEditTime: 2023-02-24 15:29:30
 * @Description: request
 */
import { ElNotification } from "element-plus";
import db from "@/utils/localstorage";
import router from "@/router";
import { getToken, } from '@/utils/auth';

const service = axios.create({
    withCredentials: true,
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 3 * 1000,
    headers: {
        "Content-Type": "application/json; charset=UTF-8",
    },
});
//请求错误异常处理
const ErrorHandle = (error) => {
    console.log(error,'error')
    let message = "";
    if (error.response) {
        let { status } = error.response;
        switch (status) {
            case 400:
                message = "请求错误(400)";
                break;
            case 401:
                message = "未授权，将重新登录(401)";
                db.clear();
                router.push("/login");
                break;
            case 403:
                message = "拒绝访问(403)";
                break;
            case 404:
                message = "请求出错(404)";
                break;
            case 408:
                message = "请求超时(408)";
                break;
            case 500:
                message = "服务器错误(500)";
                break;
            case 501:
                message = "服务未实现(501)";
                break;
            case 502:
                message = "网络错误(502)";
                break;
            case 503:
                message = "服务不可用(503)";
                break;
            case 504:
                message = "网络超时(504)";
                break;
            case 505:
                message = "HTTP版本不受支持(505)";
                break;
            default:
                message = `连接出错(${status})!`;
        }
        message = `${message}，请检查网络或联系管理员！`;
        
    }else{
        message = `服务异常，请检查网络或联系管理员！`;
    }
    ElNotification({
        title: "请求失败",
        message: message,
        type: "error",
    });
    return Promise.reject(error);
};
service.interceptors.request.use((config) => {
    if (!config?.headers) {
        throw new Error(`Expected 'config' and 'config.headers' not to be undefined`);
    }
    config.headers["Authorization"] = `Bearer ${getToken()}`;
    return config;
}, ErrorHandle);

service.interceptors.response.use((response) => {
    const { data } = response;
    if (data.code != 200) {
        ElNotification({
            message: data.msg || "Error",
            type: "error",
        });
    } 
    return data;
}, ErrorHandle);

export default service;
