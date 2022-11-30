<template>
    <div class="menu">
        <el-row :gutter="10">
            <el-col :xs="24" :sm="12">
                <div class="app-container">
                    <div class="filter-container">
                        <el-input v-model="menuName" placeholder="名称" class="filter-item search-item" />
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
                                    <el-dropdown-item @click="deleteMenu">删除</el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </div>
                    <div class="center-container">
                        <el-tree
                            ref="menuTree"
                            :data="menuTree"
                            :check-strictly="true"
                            :props="{
                                label: 'menuName',
                            }"
                            show-checkbox
                            accordion
                            node-key="menuId"
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
                            <span>{{ menu.menuId === "" ? "新增" : "修改" }}</span>
                        </div>
                    </template>
                    <div>
                        <el-form ref="form" :model="menu" :rules="rules" label-position="right" label-width="100px">
                            <el-form-item label="上级菜单" prop="parentId">
                                <el-tree-select
                                    v-model="menu.parentId"
                                    :data="menuTree"
                                    node-key="menuId"
                                    :props="{
                                        label: 'menuName',
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
                            <el-form-item label="名称" prop="menuName">
                                <el-input v-model="menu.menuName" clearable />
                            </el-form-item>
                            <el-form-item label="类型" prop="type">
                                <el-radio-group v-model="menu.type">
                                    <el-radio :label="1">菜单</el-radio>
                                    <el-radio :label="2">按钮</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item v-show="menu.type == 1" label="图标" prop="icon">
                                <el-input v-model="menu.icon">
                                    <template #append>
                                        <el-button style="padding-left: 0" @click="chooseIcons">
                                            <el-icon class="el-icon--right">
                                                <Brush />
                                            </el-icon>
                                        </el-button>
                                    </template>
                                </el-input>
                            </el-form-item>
                            <el-form-item v-show="menu.type == 1" label="URL" prop="path">
                                <el-input v-model="menu.path" clearable />
                            </el-form-item>
                            <el-form-item v-show="menu.type == 1" label="组件" prop="component">
                                <el-input v-model="menu.component" clearable />
                            </el-form-item>
                            <el-form-item label="权限" prop="perms">
                                <el-input v-model="menu.perms" clearable />
                            </el-form-item>
                            <el-form-item v-show="menu.type == 1" label="排序" prop="orderNum">
                                <el-input-number v-model="menu.orderNum" :min="0" :max="100" @change="handleNumChange" />
                            </el-form-item>
                        </el-form>
                    </div>
                </el-card>
                <el-card class="box-card" style="margin-top: -2rem">
                    <el-row>
                        <el-col :span="24" style="text-align: right">
                            <el-button type="primary" plain :loading="buttonLoading" @click="submit">{{ menu.menuId === "" ? "新增" : "修改" }}</el-button>
                        </el-col>
                    </el-row>
                </el-card>
            </el-col>
        </el-row>
        <Icons :dialog-visible="iconVisible" @close="iconVisible = false" @choose="chooseIcon" />
    </div>
</template>

<script>
import Icons from "./Icons.vue";
import api from "@/api";
export default {
    name: "MenuManage",
    components: {
        Icons,
    },
    data() {
        return {
            iconVisible: false,
            buttonLoading: false,
            selection: [],
            menuTree: [],
            menuName: "",
            menu: this.initMenu(),
            rules: {
                menuName: [
                    {
                        required: true,
                        message: "不能为空",
                        trigger: "blur",
                    },
                    {
                        min: 2,
                        max: 10,
                        message: "长度在 2 到 10 个字符",
                        trigger: "blur",
                    },
                ],
                path: {
                    max: 100,
                    message: "长度不能超过100个字符",
                    trigger: "blur",
                },
                component: {
                    max: 100,
                    message: "长度不能超过100个字符",
                    trigger: "blur",
                },
                perms: {
                    max: 50,
                    message: "长度不能超过50个字符",
                    trigger: "blur",
                },
            },
        };
    },
    mounted() {
        this.initMenuTree();
    },
    methods: {
        initMenuTree() {
            api.system_menu_tree().then(({ data }) => {
                this.menuTree = data;
            });
        },
        initMenu() {
            return {
                menuId: "",
                menuName: "",
                parentId: null,
                path: "",
                component: "",
                perms: "",
                type: 1, //1 菜单 2 按钮
                orderNum: 0,
                icon: "",
            };
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.menuName.indexOf(value) !== -1;
        },
        nodeClick(data, node, v) {
            this.menu.parentId = data.parentId;
            if (this.menu.parentId === 0) {
                this.menu.parentId = null;
            }
            this.menu.orderNum = data.orderNum;
            this.menu.type = data.type;
            this.menu.perms = data.perms;
            this.menu.path = data.path;
            this.menu.component = data.component;
            this.menu.icon = data.icon;
            this.menu.menuName = data.menuName;
            this.menu.menuId = data.menuId;
            this.$refs.form.clearValidate();
        },
        handleNumChange(val) {
            this.menu.orderNum = val;
        },
        chooseIcons() {
            this.iconVisible = true;
        },
        chooseIcon(icon) {
            this.menu.icon = icon;
            this.iconVisible = false;
        },
        submit() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.buttonLoading = true;
                    if (this.menu.menuId) {
                        api.system_menu_update({
                            ...this.menu,
                        })
                            .then(({ code }) => {
                                if (code == 200) {
                                    ElMessage({
                                        message: "修改成功",
                                        type: "success",
                                    });
                                    this.reset();
                                }
                                this.buttonLoading = false;
                            })
                            .catch((err) => {
                                console.log(err);
                                this.buttonLoading = false;
                            });
                    } else {
                        api.system_menu_create({
                            ...this.menu,
                        }).then(({ code }) => {
                            if (code == 200) {
                                ElMessage({
                                    message: "新增成功",
                                    type: "success",
                                });
                                this.reset();
                            }
                            this.buttonLoading = false;
                        });
                    }
                } else {
                    return false;
                }
            });
        },
        reset() {
            this.initMenuTree();
            this.menuName = "";
            this.resetForm();
        },
        search() {
            this.$refs.menuTree.filter(this.menuName);
        },
        add() {
            this.resetForm();
            ElMessage({
                message: "请在表单中填写相关信息",
                type: "info",
            });
        },
        deleteMenu() {
            const checked = this.$refs.menuTree.getCheckedKeys();
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
                        api.system_menu_delete(deleteIds).then(({ code }) => {
                            if (code == 200) {
                                ElMessage({
                                    message: "删除成功",
                                    type: "success",
                                });
                                this.reset();
                            }
                        });
                    })
                    .catch(() => {
                        this.$refs.menuTree.setCheckedKeys([]);
                    });
            }
        },
        resetForm() {
            this.$refs.form.clearValidate();
            this.$refs.form.resetFields();
            this.menu = this.initMenu();
        },
    },
};
</script>

<style lang="scss" scoped>
.menu {
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
