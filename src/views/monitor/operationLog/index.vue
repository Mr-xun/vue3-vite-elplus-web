<!--
 * @Author: xunxiao
 * @Date: 2023-02-20 09:52:09
 * @LastEditors: xunxiao
 * @LastEditTime: 2023-02-21 10:40:12
 * @Description: 系统监控-操作日志
-->
<template>
    <div class="app-container">
        <div class="filter-container">
            <el-form :inline="true" :model="searchForm">
                <el-form-item label="用户名">
                    <el-input v-model="searchForm.userName" placeholder="用户名" clearable @clear="search" @keyup.enter="search" class="filter-item search-item" />
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input v-model="searchForm.realName" placeholder="姓名" clearable @clear="search" @keyup.enter="search" class="filter-item search-item" />
                </el-form-item>
                <el-form-item label="操作时间">
                    <el-date-picker
                        v-model="searchForm.timeRange"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        value-format="YYYY-MM-DD HH:mm:ss"
                        :default-time="timeDefault"
                        :disabled-date="timeDisabledDate"
                        class="filter-item search-item"
                        type="datetimerange"
                    />
                </el-form-item>
                <el-form-item label style="margin-left: 0.75rem">
                    <el-button class="filter-item" type="primary" plain @click="search">搜索</el-button>
                    <el-button class="filter-item" type="warning" plain @click="reset">重置</el-button>
                    <el-dropdown v-has-any-permission="['operationLog:delete']" trigger="click" class="filter-item">
                        <el-button>
                            更多操作
                            <el-icon class="el-icon--right"><arrow-down /></el-icon>
                        </el-button>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <div v-has-permission="['operationLog:delete']">
                                    <el-dropdown-item @click="batchDelete">删除</el-dropdown-item>
                                </div>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </el-form-item>
            </el-form>
        </div>
        <div class="center-container">
            <el-table
                ref="tableRef"
                v-loading="tableLoading"
                :data="tableData"
                border
                fit
                style="width: 100%"
                :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
                stripe
                :max-height="tableHeight"
                @selection-change="onSelectChange"
            >
                <el-table-column type="selection" align="center" width="40px" />
                <el-table-column label="操作用户名" prop="userName" :show-overflow-tooltip="true" align="center" min-width="90"></el-table-column>
                <el-table-column label="操作人姓名" prop="realName" :show-overflow-tooltip="true" align="center" min-width="90"></el-table-column>
                <el-table-column label="操作描述" prop="describe" :show-overflow-tooltip="true" align="center" min-width="120"></el-table-column>
                <el-table-column label="请求方法" prop="method" :show-overflow-tooltip="true" align="center" min-width="80"></el-table-column>
                <el-table-column label="请求地址" prop="url" :show-overflow-tooltip="true" align="center" min-width="180"></el-table-column>
                <el-table-column label="请求参数" prop="params" :show-overflow-tooltip="true" align="center" min-width="240"></el-table-column>
                <el-table-column label="耗时" prop="duration" :show-overflow-tooltip="true" align="center" min-width="80">
                    <template #default="{row}"> {{ row.duration }}ms </template>
                </el-table-column>
                <el-table-column label="操作系统" prop="os" align="center" min-width="100"> </el-table-column>
                <el-table-column label="浏览器" prop="browser" :show-overflow-tooltip="true" align="center" min-width="140"></el-table-column>
                <!-- <el-table-column label="IP" prop="ip" :show-overflow-tooltip="true" align="center" min-width="100"></el-table-column> -->
                <!-- <el-table-column label="登录地点" prop="location" align="center" min-width="100"></el-table-column> -->
                <el-table-column label="操作时间" prop="createTime" align="center" min-width="160"></el-table-column>
                <el-table-column label="操作" align="center" min-width="80" class-name="small-padding fixed-width" fixed="right">
                    <template #default="{ row }">
                        <el-icon v-has-permission="['operationLog:delete']" class="table-operation" style="color: #f50" @click="singleDelete(row)"><Delete /></el-icon>
                        <el-link v-has-no-permission="['operationLog:delete']" class="no-perm">无权限</el-link>
                    </template>
                </el-table-column>
            </el-table>
            <pagination
                v-show="pagination.total > 0"
                :total="pagination.total"
                v-model:page="pagination.pageNum"
                v-model:limit="pagination.pageSize"
                @pagination="paginationChange"
            />
        </div>
    </div>
</template>
<script setup>
import Pagination from "@/components/Pagination/index.vue";
import usePage from "@/composables/usePage";
import dayjs from "dayjs";
import api from "@/api";
//table高度
const tableHeight = inject("tableHeight");

//查询条件
const searchForm = reactive({});

//删除前置数据处理，用户校验
const deleteFrontFn = () => {
    return new Promise((resolve) => {
        const logIds = unref(selection).map((u) => u.logId);
        resolve(logIds);
    });
};

//选择日期后的默认时间值
const timeDefault = [dayjs().hour(0).minute(0).second(0), dayjs().hour(23).minute(59).second(59)];
//限制日期选择
const timeDisabledDate = (time) => {
    return time.getTime() > Date.now();
};
// 接收 查询参数、获取列表的接口 返回 列表所需要的数据、分页参数、分页函数等
const { reset, search, tableRef, tableData, tableLoading, pagination, fetchData, selection, singleDelete, batchDelete, onSelectChange, paginationChange } = usePage({
    searchForm,
    getListApi: api.log_operation_list,
    deleteApi: api.log_operation_delete,
    deleteFrontFn,
});
</script>
