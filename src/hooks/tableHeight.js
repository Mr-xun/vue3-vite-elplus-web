/**
 * @description 表格高度
 * @param {Number} initRow 初始条件行数
 * @param {Number} totalRow 总条件行数
 */
export default function tableHeight(initRow = 1, totalRow = 1) {
    //默认条件是否展开
    const headerCollapse = ref(false);

    //当前条件展示行数
    const headerRow = ref(initRow);

    //列表高度 40 为技术中台Tab高度 打包技术中台时应- 40
    const tableHeight = computed(() => document.body.clientHeight - headerRow.value * 44 - 285 + "px");

    //无操作按钮时，列表高度
    const tableHeightV = computed(() => document.body.clientHeight - headerRow.value * 44 - 245 + "px");

    //无搜索区域时，列表高度
    const noHeadertableHeight = computed(() => document.body.clientHeight - headerRow.value * 44 - 125 + "px");

    //展开/隐藏操作
    const collapse = () => {
        headerCollapse.value = !headerCollapse.value;
        if (headerCollapse.value) {
            headerRow.value = headerCollapse.value ? totalRow : initRow; // 根据具体条件行数赋值
        } else {
            setTimeout(() => {
                headerRow.value = headerCollapse.value ? totalRow : initRow; // 根据具体条件行数赋值
            }, 200);
        }
    };
    return {
        headerCollapse,
        tableHeight,
        tableHeightV,
        noHeadertableHeight,
        collapse,
    };
}
