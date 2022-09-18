let BASEURL = process.env.VUE_APP_BASE_URL;

module.exports = {
    title: 'Tiv-DCMS Cloud',
    // 获取令牌时，请求头信息(Basic Base64.encode(client_id:client_secret))
    authorizationValue: 'Basic emt0dzoxMjM0NTY=',
    // 社交登录后台地址
    socialLoginUrl: `${BASEURL}:8301/auth/social/login`,
    // 请替换为您的实际地址
    pages: {
        // DMS-Admin 控制台地址
        springBootAdminUrl: `${BASEURL}:8401/login`,
        // kibana 控制台地址
        kibanaUrl: `${BASEURL}:5601`,
        // nacos 控制台地址
        nacosUrl: `${BASEURL}:8001/nacos`,
        // skywalking地址
        skywalkingUrl: `${BASEURL}:8080/`,
        // 文档中心
        docUrl: `${BASEURL}:8301/doc.html`,
        // Granfana控制台
        grafanaUrl: `${BASEURL}:8404/`,
        // tx-manager控制台
        txUrl: `${BASEURL}:8501/admin/index.html#/login`
    }
};
