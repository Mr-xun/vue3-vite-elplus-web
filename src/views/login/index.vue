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
            <!-- <el-form-item class="code-input">
				<el-input
					ref="code"
					v-model="loginForm.code"
					prefix-icon="el-icon-lock"
					placeholder="验证码"
					name="code"
					type="text"
					autocomplete="off"
					style="width: 70%"
					@keyup.enter="handleLogin"
				/>
			</el-form-item> -->
            <!-- <img
				:src="imageCode"
				alt="codeImage"
				class="code-image"
				@click="getCodeImage"
			/> -->
            <el-button :loading="loading" type="primary" style="width: 100%; margin-bottom: 14px" @click.prevent="handleLogin"> 立即登录 </el-button>
        </el-form>
    </div>
</template>

<script setup>
import db from "@/utils/localstorage";
import { randomNum } from "@/utils";
import baseURL from "@/utils/baseURL";
import api from "@/api";
import { ref } from "vue";
const router = useRouter();
const store = useStore();
defineOptions({
    name: "Login",
});
const codeUrl = ref(`${baseURL}auth/captcha`);
const randomId = ref(randomNum(24, 16));
const imageCode = ref("");
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
            api["system"]
                .login(loginForm)
                .then(({ data }) => {
                    saveLoginToken(data);
                    getUserInfo();
                    ElMessage({
                        message: "登录成功",
                        type: "success",
                    });
                    loading.value = false;
                    router.push({ path: "/" });
                })
                .catch((error) => {
                    console.error(error);
                    loading.value = false;
                });
        }
    });
};

const getUserInfo = async () => {
    const { data } = await api["system"].getUserInfo();
    store.commit("account/setUser", data);
};
const saveLoginToken = (data) => {
    store.commit("account/setAccessToken", data.token);
};
const getCodeImage = () => {
    axios({
        method: "GET",
        url: `${unref(codeUrl)}?key=${unref(randomId)}`,
        responseType: "arraybuffer",
    })
        .then((res) => {
            return "data:image/png;base64," + btoa(new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), ""));
        })
        .then((res) => {
            imageCode.value = res;
        })
        .catch((e) => {
            if (e.toString().indexOf("429") !== -1) {
                ElMessage({
                    message: "获取验证码过于频繁，请稍后再试",
                    type: "error",
                });
            } else {
                ElMessage({
                    message: "获取图形验证码失败",
                    type: "error",
                });
            }
        });
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
