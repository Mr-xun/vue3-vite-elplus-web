import { ElMessage  } from 'element-plus'

// 创建axios实例
const service = axios.create({
    timeout: 3 * 60000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
    config => {
        let token = localStorage.getItem('token') || "";
        config.headers['token'] = token.replace(/"/g, "");
        return config
    },
    error => {
        // Do something with request error
        console.log(error) // for debug
        Promise.reject(error)
    }
)

// response 拦截器
service.interceptors.response.use(
    response => {
        //网络请求响应
        if (response.status != 200) {
            let errMsg = response.status == '400' ? response.msg : "服务器开小差了，请稍后再试！！！";
            ElMessage ({
                message: errMsg,
                type: 'error',
                duration: 5 * 1000,
                customClass: 'zZindex'
            })
            return response;
        } else {
            const res = response.data;
            if (res.code == undefined) {
                //文件下载，没有code
                return res;
            } else {
                //code 非'200',80308:查不到投保明细
                if (res.code != 200 && res.code != '401') {
                    let errMsg = res.msg;
                    if (res.code == '500') {
                        errMsg = "服务器开小差了，请稍后再试！！！"
                    } else if (res.code == '400' && res.code != '80308') {
                        errMsg = res.msg;
                    }
                    let requestUrl = response.request.responseURL;
                    //从中台（数据字典，组织机构，供应商）获取字典数据错误，不弹出错误提示
                    if (requestUrl && requestUrl.indexOf('cs-sys-dict') == -1 && requestUrl.indexOf('org-web-service') == -1 &&
                        requestUrl.indexOf('supplyer-info-web-service') == -1 && requestUrl.indexOf('cicore-base-service/user/get') == -1) {
                            ElMessage({
                            message: errMsg,
                            type: 'error',
                            duration: 5 * 1000,
                            customClass: 'zZindex'
                        })
                    }
                }
                return res
            }
        }
    }, error => {
        let errResponse = error.response;
        console.log('err', errResponse) //异常信息
        let errMsg = errResponse.status == '400' ? errResponse.data.msg : "服务器开小差了，请稍后再试！！！";
        if (errResponse.data.code != '80308' && errMsg) {
            let requestUrl = error.response.request.responseURL;
            //从中台（数据字典，组织机构，供应商）获取字典数据错误，不弹出错误提示
            if (requestUrl && requestUrl.indexOf('cs-sys-dict') == -1 && requestUrl.indexOf('org-web-service') == -1 &&
                requestUrl.indexOf('supplyer-info-web-service') == -1 && requestUrl.indexOf('cicore-base-service/user/get') == -1) {
                    ElMessage({
                    message: errMsg,
                    type: 'error',
                    duration: 5 * 1000,
                    customClass: 'zZindex'
                })
            }
        }
        return Promise.reject(error)
    }
)

export default service