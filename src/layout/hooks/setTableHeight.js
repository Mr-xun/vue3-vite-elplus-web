/*
 * @Author: xunxiao
 * @Date: 2022-11-29 14:57:52
 * @LastEditors: xunxiao
 * @LastEditTime: 2022-11-29 15:01:44
 * @Description: 设置table高度
 */
import { debounce } from "@/utils";
export default function () {
    const isDevelopment = computed(() => import.meta.env.VUE_APP_FLAG === "dev");
    let tableHeight = ref(0);
    const initHeight = () => {
        nextTick(() => {
            const CLIENT_HEIGHT = document.body.clientHeight;
            const HEADER_HEIGHT = unref(isDevelopment) ? 50 : 0; //顶部高度  集成中台90 开发环境50
            const FILTER_CLS_HEIGHT = document.querySelector(".intelligent-net-app .header-cls")?.offsetHeight ?? 0; //头部筛选高度
            const FILTER_CLS_MARGIN = FILTER_CLS_HEIGHT ? 30 : 0; //头部筛选margin
            const TABLE_OPERATE_HEIGHT = document.querySelector(".intelligent-net-app .table-btn-cls") ? 45 : 0; //table区操作栏高度
            const TABLE_PAGINATE_HEIGHT = document.querySelector(".intelligent-net-app .pagination-content") ? 28 : 0; //table区分页高度
            const TABLE_CONTAINER_PADDING = 30; //table区padding
            const TABLE_HEIGHT = CLIENT_HEIGHT - HEADER_HEIGHT - FILTER_CLS_HEIGHT - FILTER_CLS_MARGIN - TABLE_OPERATE_HEIGHT - TABLE_PAGINATE_HEIGHT - TABLE_CONTAINER_PADDING;
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
