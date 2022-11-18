<template>
    <div class="app-container">
        <div class="filter-container">
            <el-form :inline="true" :model="queryParams">
                <!-- <el-form-item label="机构" prop="orgId">
                    <el-select v-model="queryParams.orgId" clearable filterable autocomplete="on" default-first-option @change="search" class="filter-item search-item">
                        <el-option v-for="item in orgArchives" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item> -->
                <el-form-item label="姓名">
                    <el-input v-model="queryParams.fullname" placeholder="姓名" clearable @clear="search" @keyup.enter="search" class="filter-item search-item" />
                </el-form-item>
                <el-form-item label="部门">
                    <el-input v-model="queryParams.deptName" placeholder="部门" clearable @clear="search" @keyup.enter="search" class="filter-item search-item" />
                </el-form-item>
                <el-form-item label style="margin-left: 0.75rem">
                    <el-button class="filter-item" type="primary" plain @click="search">搜索</el-button>
                    <el-button class="filter-item" type="warning" plain @click="reset">重置</el-button>
                    <el-dropdown trigger="click" class="filter-item">
                        <el-button>
                            更多操作
                            <el-icon class="el-icon--right"><arrow-down /></el-icon>
                        </el-button>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item @click="add">新增</el-dropdown-item>
                                <el-dropdown-item @click="batchDelete">删除</el-dropdown-item>
                                <el-dropdown-item @click="resetPassword">密码重置</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </el-form-item>
            </el-form>
        </div>
        <div class="center-container">
            <el-table
                ref="table"
                :key="tableKey"
                v-loading="loading"
                :data="list"
                border
                fit
                style="width: 100%"
                :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
                stripe
                @selection-change="onSelectChange"
                :max-height="tableHeight"
            >
                <el-table-column type="selection" align="center" width="40px" />
                <el-table-column label="姓名" prop="realName" :show-overflow-tooltip="true" align="center" min-width="120px"></el-table-column>
                <el-table-column label="用户名" prop="userName" :show-overflow-tooltip="true" align="center" min-width="120px"></el-table-column>
                <el-table-column label="性别" class-name="status-col">
                    <template #default="{ row }">
                        <el-tag :type="sexFilter(row.gender)">{{ transSex(row.gender) }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="部门" prop="deptName" align="center" min-width="110px"> </el-table-column>
                <el-table-column label="邮箱" prop="email" :show-overflow-tooltip="true" align="center" min-width="200px"></el-table-column>
                <el-table-column label="电话" prop="mobile" :show-overflow-tooltip="true" align="center" min-width="120px"></el-table-column>
                <el-table-column label="状态" prop="status" class-name="status-col"></el-table-column>
                <el-table-column label="创建时间" prop="createTime" align="center" min-width="180px"></el-table-column>
                <el-table-column label="操作" align="center" min-width="150px" class-name="small-padding fixed-width" fixed="right">
                    <template #default="{ row }">
                        <el-icon class="table-operation" style="color: #87d068" @click="view(row)"><View /></el-icon>
                        <el-icon class="table-operation" style="color: #2db7f5" @click="edit(row)"><Setting /></el-icon>
                        <el-icon class="table-operation" style="color: #f50" @click="singleDelete(row)"><Delete /></el-icon>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="total > 0" :total="total" v-model:page="pagination.pageNum" v-model:limit="pagination.pageSize" @pagination="fetch" />
            <user-edit ref="edit" :dialog-visible="dialog.isVisible" :title="dialog.title" @success="editSuccess" @close="editClose" />
            <user-view ref="view" :dialog-visible="userViewVisible" @close="viewClose" />
        </div>
    </div>
</template>

<script>
import Pagination from "@/components/Pagination/index.vue";
import UserEdit from "./Edit.vue";
import UserView from "./View.vue";
import api from "@/api/system";
import { mapGetters } from "vuex";
export default {
    name: "UserManage",
    components: { Pagination, UserEdit, UserView },
    filters: {
        sexFilter(status) {
            const map = {
                1: "success",
                2: "danger",
                0: "info",
            };
            return map[status];
        },
        statusFilter(status) {
            const map = {
                0: "danger",
                1: "success",
            };
            return map[status];
        },
    },
    data() {
        return {
            dialog: {
                isVisible: false,
                title: "",
            },
            userViewVisible: false,
            tableKey: 0,
            loading: false,
            list: [],
            total: 0,
            queryParams: {},
            sort: {},
            selection: [],
            pagination: {
                pageSize: 10,
                pageNum: 1,
            },
        };
    },
    computed: {
        ...mapGetters(["tableHeight"]),

        // ...mapGetters("basic", ["orgArchives"]),
        currentUser() {
            return this.$store.state.account.user;
        },
    },
    mounted() {
        this.fetch();
    },
    methods: {
        sexFilter(status) {
            const map = {
                1: "success",
                2: "danger",
                0: "info",
            };
            return map[status];
        },
        transSex(gender) {
            switch (Number(gender)) {
                case 1:
                    return "男性";
                case 2:
                    return "女性";
                default:
                    return "保密";
            }
        },
        viewClose() {
            this.userViewVisible = false;
        },
        editClose() {
            this.dialog.isVisible = false;
        },
        editSuccess() {
            this.fetch();
        },
        onSelectChange(selection) {
            this.selection = selection;
        },
        search() {
            this.pagination.pageNum = 1;
            this.fetch();
        },
        reset() {
            this.pagination.pageNum = 1;

            this.queryParams = {};
            this.sort = {};
            this.$refs.table.clearSort();
            this.$refs.table.clearFilter();
            this.search();
        },
        add() {
            this.dialog.title = "新增";
            this.dialog.isVisible = true;
        },
        resetPassword() {
            if (!this.selection.length) {
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
                    const userNames = [];
                    this.selection.forEach((u) => {
                        userNames.push(u.username);
                    });
                    this.$put("system/user/password/reset", {
                        usernames: userNames.join(","),
                    }).then(() => {
                        ElMessage({
                            message: `所选用户密码重置已被重置为123456`,
                            type: "success",
                        });
                        this.clearSelections();
                    });
                })
                .catch(() => {
                    this.clearSelections();
                });
        },
        singleDelete(row) {
            this.$refs.table.clearSelection();
            this.$refs.table.toggleRowSelection(row, true);
            this.batchDelete();
        },
        batchDelete() {
            if (!this.selection.length) {
                ElMessage({
                    message: "请先选择需要操作的数据",
                    type: "warning",
                });
                return;
            }
            let contain = false;
            ElMessageBox.confirm("选中数据将被永久删除, 是否继续？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    const userIds = [];
                    this.selection.forEach((u) => {
                        if (u.userId === this.currentUser.userId) {
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
                        this.clearSelections();
                    } else {
                        this.delete(userIds);
                    }
                })
                .catch(() => {
                    this.clearSelections();
                });
        },
        clearSelections() {
            this.$refs.table.clearSelection();
        },
        delete(deleteIds) {
            api.system_user_delete(deleteIds).then(({ code }) => {
                if (code == 200) {
                    ElMessage({
                        message: "删除成功",
                        type: "success",
                    });
                    this.search();
                }
            });
        },
        view(row) {
            this.$refs.view.setUser(row);
            this.userViewVisible = true;
        },
        edit(row) {
            let roleIds = [];
            if (row.roleIds && typeof row.roleIds === "string") {
                roleIds = row.roleIds.split(",");
                row.roleIds = roleIds;
            }
            this.$refs.edit.setUser(row);
            this.dialog.title = "修改";
            this.dialog.isVisible = true;
        },
        fetch() {
            let params = this.queryParams;
            params.pageSize = this.pagination.pageSize;
            params.pageNum = this.pagination.pageNum;
            this.loading = true;
            api.system_user_list({ ...params })
                .then(({ data }) => {
                    this.total = data.total;
                    this.list = data.rows;
                    this.loading = false;
                })
                .catch((err) => {
                    console.log(err);
                    this.loading = false;
                });
        },
    },
};
</script>
<style lang="scss" scoped></style>
