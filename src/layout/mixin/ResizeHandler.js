/*
 * @Author: xunxiao
 * @Date: 2022-09-19 08:24:40
 * @LastEditors: xunxiao
 * @LastEditTime: 2022-09-19 17:50:47
 * @Description: ResizeHandler
 */
import store from "../../store/index";

const { body } = document;
const WIDTH = 992; // refer to Bootstrap's responsive design

export default {
    watch: {
        $route(route) {
            if (store.state.setting.device === "mobile" && store.state.setting.sidebar.opened) {
                store.commit("setting/closeSidebar", { withoutAnimation: false });
            }
        },
    },
    beforeMount() {
        window.addEventListener("resize", this.$_resizeHandler);
    },
    beforeDestroy() {
        window.removeEventListener("resize", this.$_resizeHandler);
    },
    mounted() {
        const isMobile = this.$_isMobile();
        if (isMobile) {
            store.commit("setting/toggleDevice", "mobile");
            store.commit("setting/closeSidebar", { withoutAnimation: true });
        }
    },
    methods: {
        $_isMobile() {
            const rect = body.getBoundingClientRect();
            return rect.width - 1 < WIDTH;
        },
        $_resizeHandler() {
            if (!document.hidden) {
                const isMobile = this.$_isMobile();
                store.commit("setting/toggleDevice", isMobile ? "mobile" : "desktop");
                if (isMobile) {
                    store.commit("setting/closeSidebar", { withoutAnimation: true });
                }
            }
        },
    },
};
