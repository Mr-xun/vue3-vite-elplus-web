<template>
    <div class="tracker-index app-m-cls">
        <div ref="header" class="header-cls">
            <el-card shadow="never">
                <el-form ref="form" :model="searchForm" label-width="110px" size="small">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="用户ID：">
                                <el-input maxlength="40" v-model="searchForm.userId" placeholder="请输入用户ID" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="业务来源：">
                                <el-select v-model="searchForm.businessSource" placeholder="请选择业务来源" clearable filterable style="width: 100%">
                                    <el-option v-for="item in businessSourceOptions" :key="item.value" :label="item.dictName" :value="item.dictCode" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="事件类型：">
                                <el-select v-model="searchForm.eventType" placeholder="请选择事件类型" clearable filterable style="width: 100%">
                                    <el-option v-for="item in eventTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="事件标识：">
                                <el-input maxlength="40" v-model="searchForm.eventKey" placeholder="请输入事件标识" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="事件名称/描述">
                                <el-input maxlength="40" v-model="searchForm.eventName" placeholder="请输入事件名称/描述" clearable></el-input>
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
                <el-table size="small" v-loading="tableData.loading" :data="tableData.list" :height="tableHeight" :header-cell-style="{ background: '#d0e6ffa8' }" border fit>
                    <el-table-column label="用户ID" prop="userId" align="center" show-overflow-tooltip min-width="100"></el-table-column>
                    <el-table-column label="业务来源" prop="businessSource" align="center" show-overflow-tooltip min-width="90">
                        <template #default="{ row }">
                            {{ businessSourceFilter(row.businessSource) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="事件类型" prop="eventType" align="center" show-overflow-tooltip width="80">
                        <template #default="{ row }">
                            {{ eventTypeFilter(row.eventType) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="事件标识" prop="eventKey" align="center" show-overflow-tooltip min-width="180"></el-table-column>
                    <el-table-column label="事件名称/描述" prop="eventName" align="center" show-overflow-tooltip min-width="140"></el-table-column>
                    <el-table-column label="停留时间" prop="dwellTime" align="center" show-overflow-tooltip width="90">
                        <template #default="{ row }">{{ row.dwellTime ? mssToSecFormat(row.dwellTime) : "--" }}</template>
                    </el-table-column>
                    <el-table-column label="页面/接口地址" prop="pathName" align="center" show-overflow-tooltip min-width="110"></el-table-column>
                    <el-table-column label="事件参数" prop="params" align="center" show-overflow-tooltip min-width="120">
                        <template #default="{ row }">{{ row.params ?? "--" }}</template>
                    </el-table-column>
                    <el-table-column label="上报时间" prop="eventTime" align="center" show-overflow-tooltip min-width="150">
                        <template #default="{ row }">
                            {{ dateTimeFilter(row.eventTime) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="浏览器类型版本" prop="browserType" align="center" show-overflow-tooltip width="140">
                        <template #default="{ row }"> {{ row.browserType }} {{ row.browserVersion }} </template>
                    </el-table-column>
                    <el-table-column label="浏览器引擎" prop="browserEngine" align="center" show-overflow-tooltip width="90"></el-table-column>
                    <el-table-column label="设备类型版本" prop="osType" align="center" show-overflow-tooltip width="100">
                        <template #default="{ row }"> {{ row.osType }} {{ row.osVersion }} </template>
                    </el-table-column>
                </el-table>
                <pagination v-show="tableData.total > 0" :total="tableData.total" v-model:page="pagination.page" v-model:limit="pagination.size" @pagination="paginationChange" />
            </el-card>
        </div>
    </div>
</template>

<script setup>
import Pagination from "@/components/Pagination/index.vue";
import trackerRequest from "@/api/tracker";
import days from "dayjs";

const store = useStore();

//业务来源下拉数据
const businessSourceOptions = unref(computed(() => store.state.basic.businessSource));
//table高度
const tableHeight = inject("tableHeight");

//事件类型下拉数据
const eventTypeOptions = [
    {
        label: "点击事件",
        value: "click",
    },
    {
        label: "预览事件",
        value: "preview",
    },
    {
        label: "结果事件",
        value: "result",
    },
    {
        label: "接口调用",
        value: "interfaceUse",
    },
];

//业务来源过滤
const businessSourceFilter = (val) => {
    let temp = businessSourceOptions.find((o) => o.dictCode === val);
    return temp?.dictName ?? "--";
};

//事件类型过滤
const eventTypeFilter = (val) => {
    let temp = eventTypeOptions.find((o) => o.value === val);
    return temp?.label ?? "--";
};

//事件过滤
const dateTimeFilter = (time) => {
    return days(time).format("YYYY-MM-DD HH:mm:ss");
};

//毫秒转秒
const mssToSecFormat = (mss) => (mss ? mss / 1000 + "s" : "--");

//查询条件
const searchForm = reactive({});
const tableData = reactive({
    list: [],
    loading: true,
    total: 0,
});
const pagination = reactive({
    page: 1,
    size: 10,
});

//查询
const search = () => {
    pagination.page = 1;
    fetchData();
};
//重置
const reset = () => {
    pagination.page = 1;
    Object.keys(searchForm).forEach((key) => delete searchForm[key]);
};
//更改页码
const paginationChange = () => {
    fetchData();
};

const fetchData = () => {
    let params = {
        page: pagination.page,
        size: pagination.size,
        ...searchForm,
    };
    tableData.loading = true;
    trackerRequest
        .getList(params)
        .then((res) => {
            let { code, data } = res;
            if (code == 200) {
                tableData.list = data.list;
                tableData.total = data.total;
            }
            tableData.loading = false;
        })
        .catch((err) => {
            console.log(err);
            tableData.loading = false;
        });
};
onMounted(() => search());
</script>
