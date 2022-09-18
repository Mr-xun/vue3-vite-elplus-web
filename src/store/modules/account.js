/*
 * @Author: xunxiao 17810204418@163.com
 * @Date: 2022-09-17 21:10:34
 * @LastEditors: xunxiao 17810204418@163.com
 * @LastEditTime: 2022-09-18 20:07:04
 * @Description: 账号相关
 */
import db from '@/utils/localstorage';

export default {
    namespaced: true,
    state: {
        accessToken: db.get('ACCESS_TOKEN'),
        refreshToken: db.get('REFRESH_TOKEN'),
        routeToken: db.get('ROUTE_TOKEN', null),
        expireTime: db.get('EXPIRE_TIME', 0),
        user: db.get('USER'),
        permissions: db.get('PERMISSIONS'),
        routes: db.get('USER_ROUTER') || [],
        userOrg: db.get('USER_ORG')
    },
    mutations: {
        setAccessToken(state, val) {
            db.save('ACCESS_TOKEN', val);
            state.accessToken = val;
        },
        setRefreshToken(state, val) {
            db.save('REFRESH_TOKEN', val);
            state.refreshToken = val;
        },
        setExpireTime(state, val) {
            db.save('EXPIRE_TIME', val);
            state.expireTime = val;
        },
        setUser(state, val) {
            db.save('USER', val);
            state.user = val;
        },
        setPermissions(state, val) {
            db.save('PERMISSIONS', val);
            state.permissions = val;
        },
        setRoutes(state, val) {
            db.save('USER_ROUTER', val);
            state.routes = val;
        },
        setRouteToken(state, val) {
            db.save('ROUTE_TOKEN', val);
            state.routeToken = val;
        },
        setUserOrg(state, val) {
            db.save('USER_ORG', val);
            state.userOrg = val;
        }
    }
};
