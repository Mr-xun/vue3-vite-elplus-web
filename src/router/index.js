/*
 * @Author: xunxiao 17810204418@163.com
 * @Date: 2022-09-17 22:08:49
 * @LastEditors: xunxiao
 * @LastEditTime: 2023-02-13 14:53:10
 * @Description: Router
 */
import { createRouter, createWebHashHistory } from "vue-router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import db from "@/utils/localstorage";
import request from "@/utils/request";
import api from "@/api";
import store from "@/store/index";
import { routes } from "./routes";
const VUE_APP_ROOT_PATH = import.meta.env.VUE_APP_ROOT_PATH;
const router = createRouter({
    history: createWebHashHistory(VUE_APP_ROOT_PATH), // createWebHashHistory
    routes,
    scrollBehavior(to, from, savedPosition) {
        //返回 savedPosition，在按下 后退/前进 按钮时，就会像浏览器的原生表现那样：
        if (savedPosition) {
            return savedPosition;
        } else {
            const el = document.getElementsByClassName("scroll-wrapper")[0];
            if (el) el.scrollTo({ top: 0, behavior: "smooth" });
        }
    },
});
const whiteList = ["/login"];

let asyncRouter;
// 导航守卫，渲染动态路由
router.beforeEach((to, from, next) => {
    NProgress.start();
    if (whiteList.indexOf(to.path) !== -1) {
        next();
    } else {
        const token = db.get("ACCESS_TOKEN");
        const user = db.get("USER");
        const userRouter = db.get("USER_ROUTER", null);
        if (token.length && user) {
            if (!asyncRouter) {
                if (!userRouter) {
                    api.getUserMenu().then(({ data }) => {
                        const permissions = data.permissions;
                        store.commit("account/setPermissions", permissions);
                        asyncRouter = data.routes;
                        store.commit("account/setRoutes", asyncRouter);
                        save("USER_ROUTER", asyncRouter);
                        go(to, next);
                    });
                } else {
                    asyncRouter = userRouter;
                    go(to, next);
                }
            } else {
                next();
            }
        } else {
            if (to.path === "/login") {
                next();
            } else {
                next("/login");
            }
        }
    }
});
router.afterEach(() => {
    NProgress.done();
});

function go(to, next) {
    asyncRouter = filterAsyncRouter(asyncRouter);
    asyncRouter.forEach((route) => router.addRoute(route));
    next({ ...to, replace: true });
}

function save(name, data) {
    localStorage.setItem(name, JSON.stringify(data));
}

function get(name) {
    return JSON.parse(localStorage.getItem(name));
}

function filterAsyncRouter(routes) {
    return routes.filter((route) => {
        const component = route.component;
        if (component) {
            if (route.component === "Layout") {
            } else {
                route.component = (resolve) => require([`@/views/${component}.vue`], resolve);
            }
            if (route.children && route.children.length) {
                route.children = filterAsyncRouter(route.children);
            }
            return true;
        }
    });
}

export default router;
