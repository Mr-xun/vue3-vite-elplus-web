/*
 * @Author: xunxiao
 * @Date: 2022-11-29 14:57:52
 * @LastEditors: xunxiao
 * @LastEditTime: 2022-12-05 17:58:27
 * @Description: 设置table高度
 */
import { debounce } from "@/utils";
export default function () {
    let tableHeight = ref(0);
    const initHeight = () => {
        nextTick(() => {
            const CLIENT_HEIGHT = document.body.clientHeight;
            const APP_CONTAINER_PADDING = 20; //app-container区padding
            const FIXED_HEADER_HEIGHT = document.querySelector(".intelligent-net-app .fixed-header")?.offsetHeight ?? 0; //头部筛选高度
            const FILTER_CONTAINER_HEIGHT = document.querySelector(".intelligent-net-app .filter-container")?.offsetHeight ?? 0; //头部筛选高度
            const FILTER_CONTAINER_MARGIN = FILTER_CONTAINER_HEIGHT ? 15 : 0; //头部筛选margin
            const TABLE_PAGINATE_HEIGHT = document.querySelector(".intelligent-net-app .pagination-content") ? 28 : 0; //table区分页高度
            const TABLE_CONTAINER_PADDING = 40; //table区padding
            const TABLE_HEIGHT =
                CLIENT_HEIGHT - APP_CONTAINER_PADDING - FIXED_HEADER_HEIGHT - FILTER_CONTAINER_HEIGHT - FILTER_CONTAINER_MARGIN - TABLE_PAGINATE_HEIGHT - TABLE_CONTAINER_PADDING;
            tableHeight.value = TABLE_HEIGHT;
        });
    };
    const __resizeHandler = debounce(() => initHeight(), 100);
    onMounted(() => window.addEventListener("resize", __resizeHandler));
    onBeforeUnmount(() => window.removeEventListener("resize", __resizeHandler));
    return {
        tableHeight,
        initHeight,
    };
}
