/*
 * @Author: xunxiao 17810204418@163.com
 * @Date: 2022-09-17 21:10:34
 * @LastEditors: xunxiao
 * @LastEditTime: 2023-02-13 14:26:56
 * @Description: entry
 */
import { createApp } from "vue";
import App from "./App.vue";
import store from "./store/index";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import { hasPermission, hasNoPermission, hasAnyPermission } from "@/directives/permission";
import "element-plus/theme-chalk/src/message.scss";
import "element-plus/theme-chalk/src/notification.scss";
import "@/styles/index.scss"; // global css
import router from "@/router";

const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}
const Plugins = [hasPermission, hasNoPermission, hasAnyPermission];
Plugins.map((plugin) => app.use(plugin));
app.use(router);
app.use(store);
app.mount("#app");
