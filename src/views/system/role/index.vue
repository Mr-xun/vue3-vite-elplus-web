<template>
    <div class="role">
        <el-row :gutter="10">
            <el-col :xs="24" :sm="14">
                <div class="app-container">
                    <div class="filter-container">
                        <el-input v-model="queryParams.roleName" placeholder="角色名称" class="filter-item search-item" />
                        <el-button class="filter-item" type="primary" plain @click="search">搜索</el-button>
                        <el-button class="filter-item" type="warning" plain @click="reset">重置</el-button>
                        <el-dropdown trigger="click" class="filter-item">
                            <el-button>
                                更多操作
                                <i class="el-icon-arrow-down el-icon--right" />
                            </el-button>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item @click="add">新增</el-dropdown-item>
                                    <el-dropdown-item @click="batchDelete">删除</el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </div>
                    <div class="center-container">
                        <el-table ref="table" :key="tableKey" v-loading="loading" :data="list" border fit style="width: 100%" @selection-change="onSelectChange">
                            <el-table-column type="selection" align="center" width="40px" />
                            <el-table-column label="角色名称" prop="roleName" :show-overflow-tooltip="true" align="center" min-width="100px"> </el-table-column>
                            <el-table-column label="角色描述" prop="remark" :show-overflow-tooltip="true" align="center" min-width="200px"> </el-table-column>
                            <el-table-column label="创建时间" prop="createdAt" :show-overflow-tooltip="true" align="center" min-width="180px"> </el-table-column>
                            <el-table-column label="操作" align="center" width="150px" class-name="small-padding fixed-width" fixed="right">
                                <template #default="{ row }">
                                    <el-icon class="table-operation" style="color: #2db7f5" @click="edit(row)"><Setting /></el-icon>
                                    <el-icon class="table-operation" style="color: #f50" @click="edit(row)"><Delete /></el-icon>
                                </template>
                            </el-table-column>
                        </el-table>
                        <pagination v-show="total > 0" :total="total" v-model:page="pagination.pageNum" v-model:limit="pagination.pageSize" @pagination="fetch" />
                    </div>
                </div>
            </el-col>
            <el-col :xs="24" :sm="10">
                <el-card class="box-card">
                    <template #header>
                        <div class="clearfix">
                            <span>{{ role.id === "" ? "新增" : "修改" }}</span>
                        </div>
                    </template>
                    <div>
                        <el-form ref="form" :model="role" :rules="rules" label-position="right" label-width="100px">
                            <el-form-item label="角色名称" prop="roleName">
                                <el-input v-model="role.roleName" :readonly="role.id === '' ? false : 'readonly'" />
                            </el-form-item>
                            <el-form-item label="角色描述">
                                <el-input v-model="role.remark" type="textarea" rows="3" />
                            </el-form-item>
                            <el-form-item label="角色权限">
                                <el-tree
                                    ref="permsTree"
                                    :data="permsTree"
                                    :props="{
                                        label: 'menu_name',
                                    }"
                                    show-checkbox
                                    check-strictly
                                    accordion
                                    node-key="id"
                                    highlight-current
                                />
                            </el-form-item>
                        </el-form>
                    </div>
                </el-card>
                <el-card class="box-card">
                    <el-row>
                        <el-col :span="24" style="text-align: right">
                            <el-button type="primary" :loading="buttonLoading" plain @click="submit">{{ role.id === "" ? "新增" : "修改" }}</el-button>
                        </el-col>
                    </el-row>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import Pagination from "@/components/Pagination/index.vue";
import api from "@/api";
export default {
    name: "RoleManage",
    components: { Pagination },
    data() {
        return {
            tableKey: 0,
            loading: false,
            buttonLoading: false,
            list: [],
            selection: [],
            total: 0,
            permsTree: [],
            queryParams: {},
            sort: {},
            pagination: {
                pageSize: 10,
                pageNum: 1,
            },
            role: this.initRole(),
            rules: {
                roleName: [
                    { required: true, message: "不能为空", trigger: "blur" },
                    {
                        min: 3,
                        max: 10,
                        message: "长度在 3 到 10 个字符",
                        trigger: "blur",
                    },
                ],
                remark: { max: 50, message: "长度不能超过50个字符", trigger: "blur" },
            },
        };
    },
    mounted() {
        this.fetch();
        this.initMenuTree();
    },
    methods: {
        initRole() {
            return {
                id: "",
                roleName: "",
                remark: "",
            };
        },
        initMenuTree() {
            api.system_menu_tree().then((res) => {
                this.permsTree = res.data.rows;
            });
        },
        onSelectChange(selection) {
            this.selection = selection;
        },
        clearSelections() {
            this.$refs.table.clearSelection();
        },
        exportExcel() {
            this.$download(
                "system/role/excel",
                {
                    pageSize: this.pagination.pageSize,
                    pageNum: this.pagination.pageNum,
                    ...this.queryParams,
                },
                `role_${new Date().getTime()}.xlsx`
            );
        },
        edit(row) {
            this.$refs.form.clearValidate();
            this.role = { ...row };
            if (this.role.menuIds) {
                this.$refs.permsTree.setCheckedKeys(this.role.menuIds.split(","));
            } else {
                this.$refs.permsTree.setCheckedKeys([]);
            }
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
            ElMessageBox.confirm("选中数据将被永久删除, 是否继续？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    const roleIds = [];
                    this.selection.forEach((r) => {
                        roleIds.push(r.id);
                    });
                    this.delete(roleIds);
                })
                .catch(() => {
                    this.clearSelections();
                });
        },
        delete(deleteIds) {
            this.loading = true;
            api.system_role_delete(deleteIds).then(() => {
                ElMessage({
                    message: "删除成功",
                    type: "success",
                });
                this.search();
            });
        },
        submit() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.buttonLoading = true;
                    if (this.role.id) {
                        this.role.menuIds = this.$refs.permsTree.getCheckedKeys().join(",");
                        api.system_role_update({ ...this.role }).then(() => {
                            this.buttonLoading = false;
                            ElMessage({
                                message: "修改成功",
                                type: "success",
                            });
                            this.reset();
                        });
                    } else {
                        this.role.menuIds = this.$refs.permsTree.getCheckedKeys().join(",");
                        api.system_role_create({ ...this.role }).then(() => {
                            this.buttonLoading = false;
                            ElMessage({
                                message: "新增成功",
                                type: "success",
                            });
                            this.reset();
                        });
                    }
                } else {
                    return false;
                }
            });
        },
        add() {
            this.resetForm();
            ElMessage({
                message: "请在表单中填写相关信息",
                type: "info",
            });
        },
        reset() {
            this.pagination.pageNum = 1;
            this.resetForm();
            this.queryParams = {};
            this.sort = {};
            this.$refs.table.clearSort();
            this.search();
        },
        resetForm() {
            this.$refs.form.clearValidate();
            this.$refs.form.resetFields();
            this.role = this.initRole();
            this.$refs.permsTree.setCheckedKeys([]);
        },
        search() {
            this.resetForm();
            this.pagination.pageNum = 1;
            this.fetch();
        },
        fetch() {
            let params = this.queryParams;
            this.loading = true;
            params.pageSize = this.pagination.pageSize;
            params.pageNum = this.pagination.pageNum;
            api.system_role_list({ ...params }).then(({ data }) => {
                this.list = data.rows;
                this.total = data.total;
                this.loading = false;
            });
        },
    },
};
</script>
<style lang="scss" scoped>
.role {
    margin: 10px;
    .app-container {
        margin: 0 0 10px 0 !important;
    }
}
.el-card.is-always-shadow {
    box-shadow: none;
}
.el-card {
    border-radius: 0;
    border: none;
    .el-card__header {
        padding: 10px 20px !important;
        border-bottom: 1px solid #f1f1f1 !important;
    }
}
</style>
