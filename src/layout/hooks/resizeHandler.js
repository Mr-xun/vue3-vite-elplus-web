/*
 * @Author: xunxiao
 * @Date: 2022-10-17 11:04:50
 * @LastEditors: xunxiao
 * @LastEditTime: 2022-10-17 13:21:38
 * @Description: resizeHandler
 */
export default function resizeHandler() {
    const { body } = document;
    const WIDTH = 992; // refer to Bootstrap's responsive design
    const route = useRoute();
    const store = useStore();
    watch(
        route,
        () => {
            if (store.state.setting.device === "mobile" && store.state.setting.sidebar.opened) {
                store.commit("setting/closeSidebar", { withoutAnimation: false });
            }
        },
        { immediate: true }
    );
    const $_isMobile = () => {
        const rect = body.getBoundingClientRect();
        return rect.width - 1 < WIDTH;
    };
    const $_resizeHandler = () => {
        if (!document.hidden) {
            const isMobile = $_isMobile();
            store.commit("setting/toggleDevice", isMobile ? "mobile" : "desktop");
            if (isMobile) {
                store.commit("setting/closeSidebar", { withoutAnimation: true });
            }
        }
    };
    onBeforeMount(() => {
        window.addEventListener("resize", $_resizeHandler);
    });
    onBeforeUnmount(() => {
        window.removeEventListener("resize", $_resizeHandler);
    });
    onMounted(() => {
        const isMobile = $_isMobile();
        if (isMobile) {
            store.commit("setting/toggleDevice", "mobile");
            store.commit("setting/closeSidebar", { withoutAnimation: true });
        }
    });
}
