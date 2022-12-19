/*
 * @Author: xunxiao 17810204418@163.com
 * @Date: 2022-09-17 21:10:34
 * @LastEditors: xunxiao
 * @LastEditTime: 2022-12-12 10:33:37
 * @Description: entry
 */
import { createApp } from "vue";
import App from "./App.vue";
import store from "./store/index";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import "element-plus/theme-chalk/src/message.scss";
import "element-plus/theme-chalk/src/notification.scss";
import "@/styles/index.scss"; // global css
import router from "@/router";
const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}
app.use(router);
app.use(store);
app.mount("#app");
