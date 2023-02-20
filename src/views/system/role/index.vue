<template>
    <div class="role">
        <el-row :gutter="10">
            <el-col :xs="24" :sm="14">
                <div class="app-container">
                    <div class="filter-container">
                        <el-input v-model="searchForm.roleName" placeholder="角色名称" class="filter-item search-item" />
                        <el-button class="filter-item" type="primary" plain @click="search">搜索</el-button>
                        <el-button class="filter-item" type="warning" plain @click="reset">重置</el-button>
                        <el-dropdown v-has-any-permission="['role:create','role:delete']" trigger="click" class="filter-item">
                            <el-button>
                                更多操作
                                <el-icon class="el-icon--right"><arrow-down /></el-icon>
                            </el-button>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <div v-has-permission="['role:create']">
                                        <el-dropdown-item @click="add">新增</el-dropdown-item>
                                    </div>
                                    <div v-has-permission="['role:delete']">
                                        <el-dropdown-item @click="batchDelete">删除</el-dropdown-item>
                                    </div>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </div>
                    <div class="center-container">
                        <el-table
                            ref="tableRef"
                            v-loading="tableLoading"
                            :data="tableData"
                            :max-height="tableHeight"
                            border
                            fit
                            style="width: 100%"
                            @selection-change="onSelectChange"
                        >
                            <el-table-column type="selection" align="center" width="40px" />
                            <el-table-column label="角色名称" prop="roleName" :show-overflow-tooltip="true" align="center" min-width="100px"> </el-table-column>
                            <el-table-column label="角色描述" prop="remark" :show-overflow-tooltip="true" align="center" min-width="200px"> </el-table-column>
                            <el-table-column label="创建时间" prop="createTime" :show-overflow-tooltip="true" align="center" min-width="180px"> </el-table-column>
                            <el-table-column label="操作" align="center" width="150px" class-name="small-padding fixed-width" fixed="right">
                                <template #default="{ row }">
                                    <el-icon v-has-permission="['role:update']" class="table-operation" style="color: #2db7f5" @click="edit(row)"><Setting /></el-icon>
                                    <el-icon v-has-permission="['role:delete']" class="table-operation" style="color: #f50" @click="singleDelete(row)"><Delete /></el-icon>
                                    <el-link v-has-no-permission="['role:update','role:delete']" class="no-perm">无权限</el-link>
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
            </el-col>
            <el-col :xs="24" :sm="10">
                <el-card class="box-card">
                    <template #header>
                        <div class="clearfix">
                            <span>{{ role.roleId === "" ? "新增" : "修改" }}</span>
                        </div>
                    </template>
                    <div>
                        <el-form ref="formRef" :model="role" :rules="rules" label-position="right" label-width="100px">
                            <el-form-item label="角色名称" prop="roleName">
                                <el-input v-model="role.roleName" :readonly="role.roleId === '' ? false : 'readonly'" />
                            </el-form-item>
                            <el-form-item label="角色描述">
                                <el-input v-model="role.remark" type="textarea" rows="3" />
                            </el-form-item>
                            <el-form-item label="角色权限">
                                <el-tree
                                    ref="permsTreeRef"
                                    :data="permsTree"
                                    :props="{
                                        label: 'menuName',
                                    }"
                                    show-checkbox
                                    check-strictly
                                    accordion
                                    node-key="menuId"
                                    highlight-current
                                />
                            </el-form-item>
                        </el-form>
                    </div>
                </el-card>
                <el-card class="box-card">
                    <el-row>
                        <el-col :span="24" style="text-align: right">
                            <el-button type="primary" :loading="buttonLoading" plain @click="submit">{{ role.roleId === "" ? "新增" : "修改" }}</el-button>
                        </el-col>
                    </el-row>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>
<script setup>
import Pagination from "@/components/Pagination/index.vue";
import usePage from "@/composables/usePage";
import api from "@/api";
//table高度
const tableHeight = inject("tableHeight");
const searchForm = reactive({});

//删除前置数据处理，用户校验
const deleteFrontFn = () => {
    return new Promise((resolve) => {
        const roleIds = unref(selection).map((v) => v.roleId);
        resolve(roleIds);
    });
};

// 接收 查询参数、获取列表的接口 返回 列表所需要的数据、分页参数、分页函数等
const { tableRef, tableData, tableLoading, search, reset, pagination, paginationChange, fetchData, selection, onSelectChange, singleDelete, batchDelete } = usePage({
    searchForm,
    searchFunc: () => resetForm(),
    resetFunc: () => resetForm(),
    getListApi: api.system_role_list,
    deleteApi: api.system_role_delete,
    deleteFrontFn,
});
const buttonLoading = ref(false);
const permsTree = ref([]);
const permsTreeRef = ref(null);
const initRole = () => {
    return {
        roleId: "",
        roleName: "",
        remark: "",
    };
};
const formRef = ref(null);
const role = ref(initRole());
const rules = reactive({
    roleName: [
        { required: true, message: "不能为空", trigger: "blur" },
        {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
        },
    ],
    remark: {
        max: 50,
        message: "长度不能超过50个字符",
        trigger: "blur",
    },
});
const initMenuTree = () => {
    api.system_menu_tree().then(({ data }) => {
        permsTree.value = data;
    });
};
const resetForm = () => {
    unref(formRef).clearValidate();
    unref(formRef).resetFields();
    role.value = initRole();
    unref(permsTreeRef).setCheckedKeys([]);
};

const add = () => {
    resetForm();
    ElMessage({
        message: "请在表单中填写相关信息",
        type: "info",
    });
};
const edit = (row) => {
    unref(formRef).clearValidate();
    role.value = { ...row };
    if (unref(role).menuIds) {
        unref(permsTreeRef).setCheckedKeys(unref(role).menuIds);
    } else {
        unref(permsTreeRef).setCheckedKeys([]);
    }
};
const submit = () => {
    unref(formRef).validate((valid) => {
        if (valid) {
            buttonLoading.value = true;
            if (unref(role).roleId) {
                role.value.menuIds = unref(permsTreeRef).getCheckedKeys();
                api.system_role_update({ ...unref(role) }).then(({ code }) => {
                    if (code == 200) {
                        ElMessage({
                            message: "修改成功",
                            type: "success",
                        });
                    }
                    reset();
                    buttonLoading.value = false;
                });
            } else {
                role.value.menuIds = unref(permsTreeRef).getCheckedKeys();
                api.system_role_create({ ...unref(role) }).then(({ code }) => {
                    if (code == 200) {
                        ElMessage({
                            message: "新增成功",
                            type: "success",
                        });
                        reset();
                    }
                    reset();
                    buttonLoading.value = false;
                });
            }
        } else {
            return false;
        }
    });
};
onMounted(() => initMenuTree());
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
