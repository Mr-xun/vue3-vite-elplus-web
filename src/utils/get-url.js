export default function getUrl(url, domainType = 1) {
    //domainType 默认为1，取apiDomain；可自定义其他域名
    let domain = import.meta.env.VUE_APP_APIDOMAIN;
    if(domainType == 1){
        domain = domain + '/' + import.meta.env.VUE_APP_NETWORKING_SERVICE;
    }
    
    return domain + url;
}
