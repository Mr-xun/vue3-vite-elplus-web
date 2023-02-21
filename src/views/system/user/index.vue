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
                    <el-dropdown v-has-any-permission="['user:add', 'user:delete', 'user:passwordReset']" trigger="click" class="filter-item">
                        <el-button>
                            更多操作
                            <el-icon class="el-icon--right"><arrow-down /></el-icon>
                        </el-button>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <div v-has-permission="['user:create']">
                                    <el-dropdown-item @click="add">新增</el-dropdown-item>
                                </div>
                                <div v-has-permission="['user:delete']">
                                    <el-dropdown-item @click="batchDelete">删除</el-dropdown-item>
                                </div>
                                <div v-has-permission="['user:passwordReset']">
                                    <el-dropdown-item @click="resetPassword">密码重置</el-dropdown-item>
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
                <el-table-column label="姓名" prop="realName" :show-overflow-tooltip="true" align="center" min-width="100"></el-table-column>
                <el-table-column label="用户名" prop="userName" :show-overflow-tooltip="true" align="center" min-width="100"></el-table-column>
                <el-table-column label="性别" class-name="status-col">
                    <template #default="{ row }">
                        <el-tag :type="sexFilter(row.gender)">{{ transSex(row.gender) }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="部门" prop="deptName" align="center" min-width="110"> </el-table-column>
                <el-table-column label="邮箱" prop="email" :show-overflow-tooltip="true" align="center" min-width="200"></el-table-column>
                <el-table-column label="电话" prop="mobile" :show-overflow-tooltip="true" align="center" min-width="100"></el-table-column>
                <el-table-column label="状态" prop="status" class-name="status-col"></el-table-column>
                <el-table-column label="创建时间" prop="createTime" align="center" min-width="180"></el-table-column>
                <el-table-column label="操作" align="center" min-width="150" class-name="small-padding fixed-width" fixed="right">
                    <template #default="{ row }">
                        <el-icon v-has-permission="['user:view']" class="table-operation" style="color: #87d068" @click="view(row)"><View /></el-icon>
                        <el-icon v-has-permission="['user:update']" class="table-operation" style="color: #2db7f5" @click="edit(row)"><Setting /></el-icon>
                        <el-icon v-has-permission="['user:delete']" class="table-operation" style="color: #f50" @click="singleDelete(row)"><Delete /></el-icon>
                        <el-link v-has-no-permission="['user:view', 'user:update', 'user:delete']" class="no-perm">无权限</el-link>
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
            <user-edit ref="editRef" :dialog-visible="editDialog.isVisible" :title="editDialog.title" @success="editSuccess" @close="editClose" />
            <user-view ref="viewUserRef" v-model="userViewVisible" />
        </div>
    </div>
</template>
<script setup>
import UserEdit from "./Edit.vue";
import UserView from "./View.vue";
import Pagination from "@/components/Pagination/index.vue";
import usePage from "@/composables/usePage";
import api from "@/api";
import { unref } from "vue";
const store = useStore();

//table高度
const tableHeight = inject("tableHeight");

//查询条件
const searchForm = reactive({});

const currentUser = computed(() => store.state.account.user);

//删除前置数据处理，用户校验
const deleteFrontFn = () => {
    return new Promise((resolve) => {
        let contain = false;
        const userIds = [];
        unref(selection).forEach((u) => {
            if (u.userId === unref(currentUser).userId) {
                contain = true;
                return;
            }
            userIds.push(u.userId);
        });
        if (contain) {
            ElMessage({
                message: "包含当前登录用户，操作已取消",
                type: "warning",
            });
            resolve(null);
        } else {
            resolve(userIds);
        }
    });
};

// 接收 查询参数、获取列表的接口 返回 列表所需要的数据、分页参数、分页函数等
const {
    tableRef,
    tableData,
    tableLoading,
    search,
    reset,
    pagination,
    paginationChange,
    fetchData,
    selection,
    onSelectChange,
    clearSelections,
    singleDelete,
    batchDelete,
    editRef,
    editDialog,
    add,
    edit,
    editClose,
    editSuccess,
} = usePage({
    searchForm,
    getListApi: api.system_user_list,
    deleteApi: api.system_user_delete,
    deleteFrontFn,
});

const userViewVisible = ref(false);
const viewUserRef = ref(null);
const sexFilter = (status) => {
    const map = {
        1: "success",
        2: "danger",
        0: "info",
    };
    return map[status];
};

const statusFilter = (status) => {
    const map = {
        0: "danger",
        1: "success",
    };
    return map[status];
};
const transSex = (gender) => {
    switch (Number(gender)) {
        case 1:
            return "男性";
        case 2:
            return "女性";
        default:
            return "保密";
    }
};
const view = (row) => {
    unref(viewUserRef).setUser(row);
    userViewVisible.value = true;
};

//用户密码重置
const resetPassword = () => {
    if (!unref(selection).length) {
        ElMessage({
            message: "请先选择需要操作的数据",
            type: "warning",
        });
        return;
    }
    ElMessageBox.confirm("确定重置所选用户密码？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
    })
        .then(() => {
            const userIds = unref(selection)
                .map((row) => row.userId)
                .join(",");
            api.system_user_password_reset({ userIds })
                .then(({ code }) => {
                    if (code == 200) {
                        ElMessage({
                            message: "密码重置成功",
                            type: "success",
                        });
                        search();
                        clearSelections();
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        })
        .catch(() => {
            clearSelections();
        });
};
</script>
