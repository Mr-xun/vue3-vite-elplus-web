/*
 * @Author: xunxiao
 * @Date: 2022-12-05 15:41:06
 * @LastEditors: xunxiao
 * @LastEditTime: 2023-02-24 13:30:40
 * @Description: usePage 接收一个 opts 参数，返回列表所需数据
 */
/**
 * @description usePage 接收一个 opts 参数，返回列表所需数据
 * @param {Object} opts.searchForm - 默认查询参数
 * @param {Function} opts.getListApi  - 获取列表数据的接口
 * @param {Function} opts.fetchDataFunc  - 执行完 fetchData 成功后执行的逻辑 有一个opts参数
 * @param {Function} opts.searchFunc  - 执行完 search 后执行的回调
 * @param {Function} opts.resetFunc  - 执行完 reset 后执行的回调
 * @param {Function} opts.pageChangeFunc  - 执行完 paginationChange 后执行的回调
 * @param {Function} opts.deleteApi  - 删除数据的接口
 * @param {Function} opts.deleteFrontFn  - 执行 batchDelete 前执行的函数 返回promise
 * @param {Function} opts.deleteFunc  - 执行完 deleteSubmit 后执行的回调
 * @param {Function} opts.addOrEditFunc  - 执行完 editSuccess 后执行的回调
 *
 */
const usePage = (opts) => {
    // searchForm getListApi 由外部传入
    const {
        searchForm = {},
        getListApi,
        fetchDataFunc = (opts) => {},
        searchFunc = () => {},
        resetFunc = () => {},
        pageChangeFunc = () => {},
        deleteApi,
        deleteFrontFn = () => Promise.resolve(null),
        deleteFunc = () => {},
        addOrEditFunc = () => {},
    } = opts;
    const tableData = ref([]);
    const tableLoading = ref(false);
    const pagination = reactive({
        pageSize: 10,
        pageNum: 1,
        total: 0,
    });
    const tableRef = ref(null); //table ref
    const editRef = ref(null); //edit component ref
    //列表选中项
    const selection = ref([]);
    //新增/修改弹窗
    const editDialog = reactive({
        isVisible: false,
        title: "",
    });

    const search = () => {
        pagination.page = 1;
        fetchData();
        searchFunc();
    };
    const reset = () => {
        pagination.page = 1;
        Object.keys(searchForm).forEach((key) => delete searchForm[key]);
        fetchData();
        resetFunc();
    };

    const paginationChange = () => {
        fetchData();
        pageChangeFunc();
    };

    const fetchData = () => {
        const opts = {
            ...pagination,
            ...searchForm,
        };
        if (searchForm.timeRange) {
            opts.startTime = searchForm.timeRange[0];
            opts.endTime = searchForm.timeRange[1];
        }
        delete opts.timeRange;
        tableLoading.value = true;
        getListApi(opts)
            .then(({ code, data }) => {
                if (code == 200) {
                    tableData.value = data?.rows || [];
                    pagination.total = data?.total || 0;
                    fetchDataFunc(opts);
                }
                tableLoading.value = false;
            })
            .catch((error) => {
                console.log(error);
                tableLoading.value = false;
            });
    };
    const onSelectChange = (selects) => {
        selection.value = selects;
    };
    const clearSelections = () => {
        unref(tableRef).clearSelection();
    };

    const singleDelete = (row) => {
        unref(tableRef).clearSelection();
        unref(tableRef).toggleRowSelection(row, true);
        batchDelete();
    };
    const batchDelete = async () => {
        if (!unref(selection).length) {
            ElMessage({
                message: "请先选择需要操作的数据",
                type: "warning",
            });
            return;
        }
        //删除前置数据处理
        let deleteIds = await deleteFrontFn();
        if (!deleteIds) {
            clearSelections();
            return;
        }
        ElMessageBox.confirm("选中数据将被永久删除, 是否继续？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
        })
            .then(() => {
                deleteSubmit(deleteIds);
            })
            .catch(() => {
                clearSelections();
            });
    };
    const deleteSubmit = (deleteIds) => {
        deleteApi(deleteIds).then(({ code }) => {
            if (code == 200) {
                ElMessage({
                    message: "删除成功",
                    type: "success",
                });
                search();
                deleteFunc();
            }
        });
    };
    const add = () => {
        editDialog.title = "新增";
        editDialog.isVisible = true;
    };
    const edit = (row) => {
        unref(editRef).setFormData(row);
        editDialog.title = "修改";
        editDialog.isVisible = true;
    };
    const editClose = () => {
        editDialog.isVisible = false;
    };
    const editSuccess = () => {
        fetchData();
        addOrEditFunc();
    };
    onMounted(() => search());
    return {
        searchForm,
        search,
        reset,
        pagination,
        tableRef,
        tableData,
        tableLoading,
        paginationChange,
        fetchData,
        selection,
        onSelectChange,
        clearSelections,
        singleDelete,
        batchDelete,
        deleteSubmit,
        editRef,
        editDialog,
        add,
        edit,
        editClose,
        editSuccess,
    };
};
export default usePage;
