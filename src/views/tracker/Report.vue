<template>
    <div class="tracker-index app-m-cls">
        <div ref="header" class="header-cls">
            <el-card shadow="never">
                <el-form ref="form" :model="searchForm" label-width="110px" size="small">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="业务来源：">
                                <el-select v-model="searchForm.businessSource" placeholder="请选择业务来源" clearable filterable style="width: 100%">
                                    <el-option v-for="item in businessSourceOptions" :key="item.value" :label="item.dictName" :value="item.dictCode" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <div class="flex justify-center">
                                <el-button size="small" icon="RefreshLeft" @click="reset">重置</el-button>
                                <el-button size="small" type="primary" icon="Search" @click="search">查询</el-button>
                            </div>
                        </el-col>
                    </el-row>
                </el-form>
            </el-card>
        </div>
        <div class="table-cls">
            <el-card shadow="never">
                <template #header>
                    <el-button type="primary" size="small" icon="Download" @click="exportReport" :loading="tableData.exporting">默认导出</el-button>
                    <el-button type="primary" size="small" icon="Download" @click="exportDailyReport">按天导出</el-button>
                </template>
                <el-table
                    size="small"
                    v-loading="tableData.loading"
                    :data="tableData.list"
                    :height="tableHeightV"
                    :span-method="mergeColMethod"
                    :header-cell-style="{ background: '#d0e6ffa8' }"
                    border
                    fit
                >
                    <el-table-column label="数据指标" align="center" show-overflow-tooltip>
                        <el-table-column label="收集页面" prop="gatherPos" align="center" show-overflow-tooltip width="140"></el-table-column>
                        <el-table-column label="指标事件" prop="indexName" align="center" show-overflow-tooltip width="180"></el-table-column>
                    </el-table-column>
                    <el-table-column :label="tableBusinessSourceTitle" align="center">
                        <el-table-column label="当日" prop="currentDay" align="center" show-overflow-tooltip> </el-table-column>
                        <el-table-column label="昨日" prop="beforeDay" align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column label="近7天" prop="nearlySevenDay" align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column label="近30天" prop="nearlyThirtyDay" align="center" show-overflow-tooltip></el-table-column>
                    </el-table-column>
                </el-table>
            </el-card>
        </div>
        <business-dialog v-model="dailyExportDialog.visible" title="选择导出日期" width="460px">
            <template #content>
                <el-form ref="form" :model="dailyExportDialog.form" label-width="80px" size="small">
                    <el-form-item label="导出日期" prop="signedDate">
                        <el-date-picker
                            v-model="dailyExportDialog.form.date"
                            type="daterange"
                            range-separator="-"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="YYYY-MM-DD"
                            :disabled-date="dailyExportDialog.disabledDate"
                        />
                    </el-form-item>
                </el-form>
            </template>
            <template #footer>
                <el-button size="small" type="primary" icon="Check" :loading="dailyExportDialog.exporting" @click="sureDailyExport">确认</el-button>
                <el-button size="small" icon="Close" :loading="dailyExportDialog.exporting" @click="dailyExportDialog.visible = false">取消</el-button>
            </template>
        </business-dialog>
    </div>
</template>

<script setup>
import "@/components/BusinessDialog/index.vue";
import trackerRequest from "@/api/tracker";
import tableHeight from "@/hooks/tableHeight";
import days from "dayjs";
const store = useStore();

//业务来源下拉数据
const businessSourceOptions = unref(
    computed(() => {
        let businessSource = store.state.basic.businessSource || [];
        return [{ dictCode: "", dictName: "全部来源" }, ...businessSource];
    })
);

//table高度
const { tableHeightV } = tableHeight(1, 1);

//查询条件
const searchForm = reactive({
    businessSource: "",
});

//当前数据源
const tableBusinessSourceTitle = ref("全部来源");

const tableData = reactive({
    list: [],
    loading: true,
    exporting: false,
});

//按天导出弹窗
const dailyExportDialog = reactive({
    visible: false,
    exporting: false,
    form: {},
    disabledDate: (time) => time.getTime() < new Date("2022-08-10") || time.getTime() > Date.now() - 8.64e7,
});

//合并内容
const mergeSpanArr = ref([]);
const mergePosition = ref(0);

//选择合并
const chooseMergeRow = (data) => {
    mergeSpanArr.value = [];
    mergePosition.value = 0;
    data.forEach((item, index) => {
        if (index === 0) {
            mergeSpanArr.value.push(1);
            mergePosition.value = 0;
        } else {
            if (data[index].gatherPos === data[index - 1].gatherPos) {
                mergeSpanArr.value[mergePosition.value] += 1;
                mergeSpanArr.value.push(0);
            } else {
                mergeSpanArr.value.push(1);
                mergePosition.value = index;
            }
        }
    });
};
//合并单元格
const mergeColMethod = ({ rowIndex, columnIndex }) => {
    if (columnIndex === 0) {
        const _row = mergeSpanArr.value[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
            rowspan: _row,
            colspan: _col,
        };
    }
};
//查询
const search = () => {
    let temp = businessSourceOptions.find((o) => o.dictCode === searchForm.businessSource);
    tableBusinessSourceTitle.value = temp?.dictName ?? "--";
    fetchData();
};

//重置
const reset = () => {
    searchForm.businessSource = "";
};

//加载数据
const fetchData = () => {
    let params = {
        ...searchForm,
    };
    tableData.loading = true;
    trackerRequest
        .queryTrackInfoReport(params)
        .then((res) => {
            let { code, data } = res;
            let showTableData = []; //页面展示数据
            tableData.list = [];
            if (code == 200) {
                let mapKeyValue = {
                    首页: {
                        pv: "homePv",
                        uv: "homeUv",
                        累计停留时长: "homePreview",
                        新车未上牌点击: "homeInfoClick",
                        已上牌报价点击: "homeQuoteClick",
                    },
                    授权弹窗: {
                        pv: "quoteIndexAgreementPv",
                        uv: "quoteIndexAgreementUv",
                    },
                    投保信息页: {
                        pv: "quoteIndexPv",
                        uv: "quoteIndexUv",
                        累计停留时长: "quoteIndexPreview",
                        开始报价点击: "quoteIndexQuoteClick",
                    },
                    车险报价页: {
                        pv: "quoteListPv",
                        uv: "quoteListUv",
                        累计停留时长: "quoteListPreview",
                        去投保点击: "quoteListInsureClick",
                    },
                    报价方案页: {
                        pv: "quoteSchemePv",
                        uv: "quoteSchemeUv",
                        累计停留时长: "quoteSchemePreview",
                        开始报价点击: "quoteSchemeQuoteClick",
                    },
                    订单详情页: {
                        pv: "quoteDetailPv",
                        uv: "quoteDetailUv",
                        累计停留时长: "quoteDetailPreview",
                        提交核保点击: "quoteDetailUnderwritingClick",
                        立即支付点击: "quoteDetailPayClick",
                    },
                };
                const valueFormat = (val, key) => {
                    if (key === "累计停留时长") {
                        return val ? val + " s" : "--";
                    }
                    return val ? val + " 次" : "--";
                };
                Object.keys(mapKeyValue).forEach((key) => {
                    let indexObj = mapKeyValue[key];
                    Object.keys(indexObj).forEach((iKey) => {
                        showTableData.push({
                            gatherPos: key,
                            indexName: iKey,
                            currentDay: valueFormat(data[0][indexObj[iKey]], iKey),
                            beforeDay: valueFormat(data[1][indexObj[iKey]], iKey),
                            nearlySevenDay: valueFormat(data[2][indexObj[iKey]], iKey),
                            nearlyThirtyDay: valueFormat(data[3][indexObj[iKey]], iKey),
                        });
                    });
                });
                chooseMergeRow(showTableData);
                tableData.list = showTableData;
            }
            tableData.loading = false;
        })
        .catch((err) => {
            console.log(err);
            tableData.loading = false;
        });
};
//导出报表
const exportReport = () => {
    tableData.exporting = true;
    trackerRequest
        .exportTrackInfoReport()
        .then((content) => {
            const filename = "埋点报表" + days().format("YYYYMMDDHHmmss");
            downImportFile(content, filename);
            tableData.exporting = false;
        })
        .catch((err) => {
            console.log(err);
            tableData.exporting = false;
        });
};

//按天导出
const exportDailyReport = () => {
    dailyExportDialog.form.date = null;
    dailyExportDialog.visible = true;
};
//按天确定导出
const sureDailyExport = () => {
    if (_.isEmpty(dailyExportDialog.form.date)) {
        ElMessage.error("请选择导出日期");
        return;
    }
    let params = {
        businessSource: searchForm.businessSource,
        countTimeStart: dailyExportDialog.form.date[0],
        countTimeEnd: dailyExportDialog.form.date[1],
    };
    dailyExportDialog.exporting = true;
    trackerRequest
        .exportTrackCountReport(params)
        .then((content) => {
            const temp = businessSourceOptions.find((o) => o.dictCode === searchForm.businessSource);
            const businessSourceName = temp?.dictName ?? "--";
            const timeName = `${days(params.countTimeStart).format("YYMMDD")}-${days(params.countTimeEnd).format("YYMMDD")}`;
            const filename = `埋点${businessSourceName}${timeName}统计报表`;
            downImportFile(content, filename);
            dailyExportDialog.exporting = false;
            dailyExportDialog.visible = false;
        })
        .catch((err) => {
            console.log(err);
            dailyExportDialog.exporting = false;
        });
};
//导出文件下载
const downImportFile = (content, filename) => {
    const blob = new Blob([content], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; application/octet-stream",
    });
    if ("download" in document.createElement("a")) {
        const eLink = document.createElement("a");
        eLink.download = filename;
        eLink.style.display = "none";
        eLink.href = URL.createObjectURL(blob);
        document.body.appendChild(eLink);
        eLink.click();
        URL.revokeObjectURL(eLink.href);
        document.body.removeChild(eLink);
    } else {
        navigator.msSaveBlob(blob, filename);
    }
};
onMounted(() => search());
</script>
