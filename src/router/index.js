/*
 * @Author: xunxiao 17810204418@163.com
 * @Date: 2022-09-17 22:08:49
 * @LastEditors: xunxiao 17810204418@163.com
 * @LastEditTime: 2022-09-17 22:09:16
 * @Description: Router
 */
import { createRouter, createWebHashHistory } from 'vue-router'
import { routes } from './routes'
const VUE_APP_ROOT_PATH = import.meta.env.VUE_APP_ROOT_PATH;
const router = createRouter({
    history: createWebHashHistory(VUE_APP_ROOT_PATH), // createWebHashHistory
    routes,
    scrollBehavior(to, from, savedPosition) {
        //返回 savedPosition，在按下 后退/前进 按钮时，就会像浏览器的原生表现那样：
        if (savedPosition) {
            return savedPosition
        } else {
            const el = document.getElementsByClassName('scroll-wrapper')[0]
            if (el) el.scrollTo({ top: 0, behavior: "smooth" })
        }
    },
})

export default router