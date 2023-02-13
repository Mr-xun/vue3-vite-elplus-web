<template>
    <div class="dept">
        <el-row :gutter="10">
            <el-col :xs="24" :sm="12">
                <div class="app-container">
                    <div class="filter-container">
                        <el-input v-model="deptName" placeholder="部门名称" class="filter-item search-item" />
                        <el-button class="filter-item" type="primary" plain @click="search">搜索</el-button>
                        <el-button class="filter-item" type="warning" plain @click="reset">重置</el-button>
                        <el-dropdown v-has-any-permission="['dept:add','dept:delete']" trigger="click" class="filter-item">
                            <el-button>
                                更多操作
                                <el-icon class="el-icon--right"><arrow-down /></el-icon>
                            </el-button>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <div v-has-permission="['dept:create']">
                                        <el-dropdown-item @click="add">新增</el-dropdown-item>
                                    </div>
                                    <div v-has-permission="['dept:delete']">
                                        <el-dropdown-item @click="deleteDept">删除</el-dropdown-item>
                                    </div>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </div>
                    <div class="center-container">
                        <el-tree
                            ref="deptTreeRef"
                            :data="deptTree"
                            :check-strictly="true"
                            show-checkbox
                            accordion
                            node-key="deptId"
                            :props="{
                                label: 'deptName',
                            }"
                            highlight-current
                            :filter-node-method="filterNode"
                            @node-click="nodeClick"
                        />
                    </div>
                </div>
            </el-col>
            <el-col :xs="24" :sm="12">
                <el-card class="box-card">
                    <template #header>
                        <div class="clearfix">
                            <span>{{ dept.deptId === "" ? "新增" : "修改" }}</span>
                        </div>
                    </template>
                    <div>
                        <el-form ref="formRef" :model="dept" :rules="rules" label-position="right" label-width="100px">
                            <el-form-item label="上级部门" prop="parentId">
                                <el-tree-select
                                    v-model="dept.parentId"
                                    :data="deptTree"
                                    node-key="deptId"
                                    :props="{
                                        label: 'deptName',
                                    }"
                                    filterable
                                    clearable
                                    accordion
                                    highlight-current
                                    check-strictly
                                    :render-after-expand="false"
                                    class="w-full"
                                />
                            </el-form-item>
                            <el-form-item label="部门名称" prop="deptName">
                                <el-input v-model="dept.deptName" />
                            </el-form-item>
                            <el-form-item label="排序" prop="orderNum">
                                <el-input-number v-model="dept.orderNum" :min="0" :max="100" @change="handleNumChange" />
                            </el-form-item>
                        </el-form>
                    </div>
                </el-card>
                <el-card class="box-card" style="margin-top: -2rem">
                    <el-row>
                        <el-col :span="24" style="text-align: right">
                            <el-button type="primary" plain :loading="buttonLoading" @click="submit">{{ dept.deptId === "" ? "新增" : "修改" }}</el-button>
                        </el-col>
                    </el-row>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>
<script setup>
import api from "@/api";
defineOptions({
    name: "DeptManage",
});
const deptName = ref("");
const buttonLoading = ref(false);
const formRef = ref(null);
const deptTreeRef = ref(null);
const deptTree = ref([]);
const initDept = () => {
    return {
        deptId: "",
        deptName: "",
        parentId: null,
        orderNum: 0,
    };
};
const dept = ref(initDept());
const rules = reactive({
    deptName: [
        { required: true, message: "不能为空", trigger: "blur" },
        {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
        },
    ],
});
const handleNumChange = (val) => {
    dept.value.orderNum = val;
};
const filterNode = (value, data) => {
    if (!value) return true;
    return data.deptName.indexOf(value) !== -1;
};
const nodeClick = (data) => {
    dept.value.parentId = data.parentId;
    if (dept.value.parentId === 0) {
        dept.value.parentId = null;
    }
    dept.value.orderNum = data.orderNum;
    dept.value.deptName = data.deptName;
    dept.value.deptId = data.deptId;
    unref(formRef).clearValidate();
};
const resetForm = () => {
    unref(formRef).clearValidate();
    unref(formRef).resetFields();
    dept.value = initDept();
};
const add = () => {
    resetForm();
    ElMessage({
        message: "请在表单中填写相关信息",
        type: "info",
    });
};
const deleteDept = () => {
    const checked = unref(deptTreeRef).getCheckedKeys();
    if (checked.length === 0) {
        ElMessage({
            message: "请先选择节点",
            type: "warning",
        });
    } else {
        ElMessageBox.confirm("选中节点及其子结点将被永久删除, 是否继续？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
        })
            .then(() => {
                let deleteIds = checked.join(",");
                api.system_dept_delete(deleteIds).then(({ code }) => {
                    if (code == 200) {
                        ElMessage({
                            message: "删除成功",
                            type: "success",
                        });
                        reset();
                    }
                });
            })
            .catch(() => {
                unref(deptTreeRef).setCheckedKeys([]);
            });
    }
};
const search = () => {
    unref(deptTreeRef).filter(unref(deptName));
};
const reset = () => {
    initDeptTree();
    deptName.value = "";
    resetForm();
};
const submit = () => {
    unref(formRef).validate((valid) => {
        if (valid) {
            buttonLoading.value = true;
            if (unref(dept).deptId) {
                api.system_dept_update({
                    ...unref(dept),
                }).then(({ code }) => {
                    buttonLoading.value = false;
                    if (code == 200) {
                        ElMessage({
                            message: "修改成功",
                            type: "success",
                        });
                        reset();
                    }
                });
            } else {
                api.system_dept_create({
                    ...unref(dept),
                }).then(({ code }) => {
                    if (code == 200) {
                        ElMessage({
                            message: "新增成功",
                            type: "success",
                        });
                        reset();
                    }
                    buttonLoading.value = false;
                });
            }
        } else {
            return false;
        }
    });
};
const initDeptTree = () => {
    api.system_dept_tree().then(({ data }) => {
        deptTree.value = data;
    });
};
onMounted(() => initDeptTree());
</script>
<style lang="scss" scoped>
.dept {
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
<style lang="scss">
.vue-treeselect__menu {
    max-height: 165px !important;
}
</style>
