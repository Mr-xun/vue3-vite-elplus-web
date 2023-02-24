<template>
    <div class="login-container">
        <div class="login-info">
            <!-- <div class="main-title">Vue3+Vite+ElementPlus</div> -->
        </div>
        <el-form ref="form" :model="loginForm" :rules="rules" status-icon class="login-form" autocomplete="off" label-position="left">
            <div class="title-container">
                <h3 class="title">
                    <span>管理系统登录</span>
                </h3>
            </div>
            <el-form-item prop="userName">
                <el-input ref="userName" v-model="loginForm.userName" placeholder="用户名" @keyup.enter="handleLogin">
                    <template #prefix>
                        <el-icon><User /></el-icon>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input ref="password" v-model="loginForm.password" type="password" placeholder="个人密码" :show-password="true" @keyup.enter="handleLogin">
                    <template #prefix>
                        <el-icon><Key /></el-icon>
                    </template>
                </el-input>
            </el-form-item>
            <el-button :loading="loading" type="primary" style="width: 100%; margin-bottom: 14px" @click.prevent="handleLogin"> 立即登录 </el-button>
        </el-form>
    </div>
</template>

<script setup>
import db from "@/utils/localstorage";
import api from "@/api";
import { ref } from "vue";
const router = useRouter();
const store = useStore();
defineOptions({
    name: "Login",
});
const loginForm = reactive({
    userName: "",
    password: "",
});
const rules = reactive({
    userName: {
        required: true,
        message: "不能为空",
        trigger: "blur",
    },
    password: {
        required: true,
        message: "不能为空",
        trigger: "blur",
    },
});

const loading = ref(false);
const form = ref(null);
const handleLogin = () => {
    unref(form).validate((valid) => {
        if (valid) {
            loading.value = true;
            api.login(loginForm)
                .then(({ code, data }) => {
                    if (code == 200) {
                        saveLoginToken(data);
                        getUserInfo();
                        ElMessage({
                            message: "登录成功",
                            type: "success",
                        });
                        router.push({ path: "/" });
                    }
                    loading.value = false;
                })
                .catch((error) => {
                    console.error(error);
                    loading.value = false;
                });
        }
    });
};

const getUserInfo = async () => {
    const { data } = await api.getUserInfo();
    store.commit("account/setUser", data);
};
const saveLoginToken = (data) => {
    store.commit("account/setAccessToken", data.token);
};
onMounted(() => {
    db.clear();
});
</script>

<style lang="scss">
@import "login";
</style>
<style lang="scss" scoped>
@import "login-scoped";
</style>
