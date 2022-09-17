/*
 * @Author: xunxiao
 * @Date: 2022-08-11 13:41:15
 * @LastEditors: xunxiao
 * @LastEditTime: 2022-09-13 13:24:08
 * @Description: 埋点接口
 */
import request from "@/utils/request";
import getUrl from "@/utils/get-url";
export default {
    /**
     * 埋点查询
     */
    getList(params) {
        return request.post(getUrl(`/signTrack/list`), params);
    },
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
};
