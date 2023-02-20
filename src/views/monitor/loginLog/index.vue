<!--
 * @Author: xunxiao
 * @Date: 2023-02-20 09:52:01
 * @LastEditors: xunxiao
 * @LastEditTime: 2023-02-20 14:56:12
 * @Description: 系统监控-登录日志
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
                <el-form-item label style="margin-left: 0.75rem">
                    <el-button class="filter-item" type="primary" plain @click="search">搜索</el-button>
                    <el-button class="filter-item" type="warning" plain @click="reset">重置</el-button>
                    <el-dropdown v-has-any-permission="['loginLog:delete']" trigger="click" class="filter-item">
                        <el-button>
                            更多操作
                            <el-icon class="el-icon--right"><arrow-down /></el-icon>
                        </el-button>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <div v-has-permission="['loginLog:delete']">
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
                <el-table-column label="用户名" prop="userName" :show-overflow-tooltip="true" align="center" min-width="100"></el-table-column>
                <el-table-column label="姓名" prop="realName" :show-overflow-tooltip="true" align="center" min-width="100"></el-table-column>
                <el-table-column label="登录系统" prop="os" align="center" min-width="110px"> </el-table-column>
                <el-table-column label="浏览器" prop="browser" :show-overflow-tooltip="true" align="center" min-width="140"></el-table-column>
                <el-table-column label="IP" prop="ip" :show-overflow-tooltip="true" align="center" min-width="100"></el-table-column>
                <el-table-column label="登录地点" prop="location" align="center" min-width="100"></el-table-column>
                <el-table-column label="登录时间" prop="loginTime" align="center" min-width="160"></el-table-column>
                <el-table-column label="上次登录时间" prop="lastLoginTime" align="center" min-width="160"></el-table-column>
                <el-table-column label="操作" align="center" min-width="90" class-name="small-padding fixed-width" fixed="right">
                    <template #default="{ row }">
                        <el-icon v-has-permission="['loginLog:delete']" class="table-operation" style="color: #f50" @click="singleDelete(row)"><Delete /></el-icon>
                        <el-link v-has-no-permission="['loginLog:delete']" class="no-perm">无权限</el-link>
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
import api from "@/api";
//table高度
const tableHeight = inject("tableHeight");

//查询条件
const searchForm = reactive({});

//删除前置数据处理，用户校验
const deleteFrontFn = () => {
    return new Promise((resolve) => {
        const userIds = unref(selection).map(u=>u.logId);
        resolve(userIds);
    });
};

// 接收 查询参数、获取列表的接口 返回 列表所需要的数据、分页参数、分页函数等
const {
    reset,
    search,
    tableRef,
    tableData,
    tableLoading,
    pagination,
    fetchData,
    selection,
    singleDelete,
    batchDelete,
    onSelectChange,
    paginationChange,
} = usePage({
    searchForm,
    getListApi: api.log_login_list,
    deleteApi: api.log_login_delete,
    deleteFrontFn,
});

</script>