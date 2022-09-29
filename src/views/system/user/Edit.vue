<template>
    <el-dialog v-model="isVisible" :title="title" :width="width" top="50px" :close-on-click-modal="false" :close-on-press-escape="false" draggable>
        <el-form ref="form" :inline="true" :model="user" :rules="rules" label-position="right" label-width="140px">
            <!-- <el-form-item label="机构：" prop="orgId">
                <el-select :style="{ width: itemWidth }" v-model="user.orgId" @change="getTargetName($event, 'id', 'orgArchives', 'orgName')" filterable >
                    <el-option v-for="item in orgArchives" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </el-form-item> -->
            <!-- <el-form-item label="编码：" prop="code">
                <el-input :style="{ width: itemWidth }" v-model="user.code" :disabled="!!user.userId" />
            </el-form-item> -->
            <el-form-item label="用户名：" prop="userName">
                <el-input :style="{ width: itemWidth }" v-model="user.userName" :disabled="!!user.userId" />
            </el-form-item>
            <el-form-item label="姓名：" prop="realName">
                <el-input :style="{ width: itemWidth }" v-model="user.realName" />
            </el-form-item>
            <el-form-item label="邮箱：" prop="email">
                <el-input :style="{ width: itemWidth }" v-model="user.email" />
            </el-form-item>
            <el-form-item v-show="!user.userId" label="密码：" prop="password">
                <el-tooltip class="item" effect="dark" :content="`用户的默认密码为123456`" placement="top-start">
                    <el-input :style="{ width: itemWidth }" value="123456" type="password" readonly />
                </el-tooltip>
            </el-form-item>
            <el-form-item label="电话：">
                <el-input :style="{ width: itemWidth }" v-model="user.mobile" />
            </el-form-item>
            <el-form-item label="部门：" prop="deptId">
                <el-tree-select
                    v-model="user.deptId"
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
                    :style="{ width: itemWidth }"
                />
            </el-form-item>
            <el-form-item label="角色：" prop="roleId">
                <el-select :style="{ width: itemWidth }" v-model="user.roleId" multiple value placeholder>
                    <el-option v-for="item in roles" :key="item.roleId" :label="item.roleName" :value="String(item.roleId)" />
                </el-select>
            </el-form-item>
            <el-form-item label="性别：" prop="gender">
                <el-select :style="{ width: itemWidth }" v-model="user.gender" placeholder>
                    <el-option :value="1" label="男" />
                    <el-option :value="2" label="女" />
                    <el-option :value="3" label="保密" />
                </el-select>
            </el-form-item>

            <el-form-item label="描述：" prop="description">
                <el-input :style="{ width: itemWidth }" v-model="user.description" />
            </el-form-item>
            <el-form-item label="状态：" prop="status">
                <el-radio-group v-model="user.status" :style="{ width: itemWidth }">
                    <el-radio label="1">有效</el-radio>
                    <el-radio label="2">禁用</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="warning" plain :loading="buttonLoading" @click="isVisible = false">取消</el-button>
                <el-button type="primary" plain :loading="buttonLoading" @click="submitForm">确定</el-button>
            </div>
        </template>
    </el-dialog>
</template>
<script>
import { validMobile } from "@/utils/my-validate";
import { mapGetters } from "vuex";
import api from "@/api";
export default {
    name: "UserEdit",
    props: {
        dialogVisible: {
            type: Boolean,
            default: false,
        },
        title: {
            type: String,
            default: "",
        },
    },
    data() {
        return {
            itemWidth: "295px",
            user: this.initUser(),
            buttonLoading: false,
            screenWidth: 0,
            width: this.initWidth(),
            roles: [],
            deptTree: [],
            rules: {
                realName: [{ required: true, message: "不能为空", trigger: "blur" }],
                userName: [
                    { required: true, message: "不能为空", trigger: "blur" },
                    {
                        min: 4,
                        max: 10,
                        message: "长度在 4 到 10 个字符",
                        trigger: "blur",
                    },
                ],
                email: {
                    type: "email",
                    message: "请输入正确的邮箱地址",
                    trigger: "blur",
                },
                mobile: {
                    validator: (rule, value, callback) => {
                        if (value !== "" && !validMobile(value)) {
                            callback("请输入合法的手机号");
                        } else {
                            callback();
                        }
                    },
                    trigger: "blur",
                },
                roleId: {
                    required: true,
                    message: "不能为空",
                    trigger: "change",
                },
                gender: { required: true, message: "不能为空", trigger: "change" },
                status: {
                    required: true,
                    message: "不能为空",
                    trigger: "blur",
                },
            },
        };
    },
    computed: {
        // ...mapGetters("basic", ["orgArchives"]),

        isVisible: {
            get() {
                return this.dialogVisible;
            },
            set() {
                this.close();
                this.reset();
            },
        },
    },
    mounted() {
        this.initDept();
        this.initRoles();
        window.onresize = () => {
            return (() => {
                this.width = this.initWidth();
            })();
        };
    },
    methods: {
        initUser() {
            return {
                orgId: "",
                avatar: "",
                deptId: null,
                description: "",
                email: "",
                mobile: "",
                roleId: [],
                gender: "",
                status: "1",
                userName: "",
                realName: "",
            };
        },
        getTargetName(val, key, options, targetKey) {
            this[options].forEach((item) => {
                if (item[key] == val) {
                    this.user[targetKey] = item.name;
                }
            });
        },
        initWidth() {
            this.screenWidth = document.body.clientWidth;

            return "1000px";
        },
        initDept() {
            api.system_dept_tree().then(({ data }) => {
                this.deptTree = data;
            });
        },
        initRoles() {
            api.system_role_all().then(({ data }) => {
                this.roles = data;
            });
        },
        setUser(val) {
            this.user = { ...val };
        },
        close() {
            this.$emit("close");
        },
        submitForm() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.buttonLoading = true;
                    let params = { ...this.user };
                    params.roleId = params.roleId.join(",");
                    if (!params.userId) {
                        // create
                        api.system_user_create(params).then(({ code }) => {
                            if (code == 200) {
                                this.isVisible = false;
                                ElMessage({
                                    message: "新增成功",
                                    type: "success",
                                });
                                this.$emit("success");
                            }
                            this.buttonLoading = false;
                        });
                    } else {
                        // update
                        api.system_user_update({ ...this.user }).then(({ code }) => {
                            if (code == 200) {
                                this.isVisible = false;
                                ElMessage({
                                    message: "修改成功",
                                    type: "success",
                                });
                                this.$emit("success");
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
            // 先清除校验，再清除表单，不然有奇怪的bug
            this.$refs.form.clearValidate();
            this.$refs.form.resetFields();
            this.user = this.initUser();
        },
    },
};
</script>
<style lang="scss" scoped></style>
