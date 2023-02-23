/*
 * @Author: xunxiao
 * @Date: 2022-09-26 15:00:09
 * @LastEditors: xunxiao
 * @LastEditTime: 2023-02-23 16:50:36
 * @Description: Routes
 */
import Layout from "@/layout/index.vue";
/*
  meta: {
    title: 'title'               the name showed in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon showed in the sidebar
    hidden: true                 if true, this route will not show in the sidebar (default is false)
    alwaysShow: true             if true, will always show the root menu (default is false)
                                 if false, hide the root menu when has less or equal than one children route
    breadcrumb: false            if false, the item will be hidden in breadcrumb (default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
*/
export const routes = [
    {
        path: "/redirect",
        component: Layout,
        hidden: true,
        children: [
            {
                path: "/redirect/:paths*",
                component: () => import("@/views/redirect/index.vue"),
            },
        ],
    },
    {
        path: "/404",
        component: () => import("@/views/error-page/404"),
        hidden: true,
    },
    {
        path: "/login",
        name: "登录页",
        component: () => import("@/views/login/index.vue"),
        meta: {
            hidden: true,
        },
    },
    {
        path: "/",
        name: "Tracker",
        redirect: "/tracker/index",
        component: Layout,
        meta: {
            icon: "Files",
            title: "埋点管理",
        },
        children: [
            {
                path: "/tracker/index",
                name: "TrackerIndex",
                component: () => import("@/views/tracker/index.vue"),
                meta: {
                    title: "埋点查看",
                },
            },
            {
                path: "/tracker/report",
                name: "TrackerReport",
                component: () => import("@/views/tracker/Report.vue"),
                meta: {
                    title: "埋点报表",
                },
            },
        ],
    },
];
