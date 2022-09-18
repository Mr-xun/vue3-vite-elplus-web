<template>
	<div class="login-container">
		<div class="login-info">
			<!-- <div class="main-title">Vue3+Vite+ElementPlus</div> -->
		</div>
		<el-form
			ref="loginForm"
			:model="loginForm"
			:rules="rules"
			class="login-form"
			autocomplete="off"
			label-position="left"
		>
			<div class="title-container">
				<h3 class="title">
					<!-- <img
						class="logo-img"
						src="../../assets/trt/tiv-logo.png"
						alt=""
						srcset=""
					/> -->
					<span>管理系统登录</span>
				</h3>
			</div>
			<el-form-item prop="user_name">
				<el-input
					ref="user_name"
					v-model="loginForm.user_name"
					placeholder="用户名"
					prefix-icon="el-icon-user"
					name="user_name"
					type="text"
					autocomplete="off"
					@keyup.enter="handleLogin"
				/>
			</el-form-item>
			<el-form-item prop="password">
				<el-input
					ref="password"
					v-model="loginForm.password"
					prefix-icon="el-icon-key"
					type="password"
					placeholder="个人密码"
					name="password"
					autocomplete="off"
					:show-password="true"
					@keyup.enter="handleLogin"
				/>
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
			<el-button
				:loading="loading"
				type="primary"
				style="width: 100%; margin-bottom: 14px"
				@click.prevent="handleLogin"
			>
				立即登录
			</el-button>
		</el-form>
	</div>
</template>

<script>
import db from "@/utils/localstorage";
import { randomNum } from "@/utils";
import { mapMutations } from "vuex";
import baseURL from "@/utils/baseURL";
import api from "@/api/system";
export default {
	name: "Login",
	data() {
		return {
			codeUrl: `${baseURL}auth/captcha`,
			loginForm: {
				user_name: "",
				password: "",
			},
			rules: {
				user_name: {
					required: true,
					message: "不能为空",
					trigger: "blur",
				},
				password: {
					required: true,
					message: "不能为空",
					trigger: "blur",
				},
			},
			loading: false,
			randomId: randomNum(24, 16),
			imageCode: "",
		};
	},
	mounted() {
		db.clear();
		// this.getCodeImage();
	},
	methods: {
		...mapMutations("enum", [
			"setMedicareType",
			"setReimbursementType",
			"setPrescriptionType",
			"setCrafts",
			"setUnits",
			"setUrgent",
			"setClassifies",
			"setOrgType",
			"setDrugNotes",
			"setIncompatibility",
			"setRefuseSendReason",
		]),
		getCodeImage() {
			axios({
				method: "GET",
				url: `${this.codeUrl}?key=${this.randomId}`,
				responseType: "arraybuffer",
			})
				.then((res) => {
					return (
						"data:image/png;base64," +
						btoa(
							new Uint8Array(res.data).reduce(
								(data, byte) =>
									data + String.fromCharCode(byte),
								""
							)
						)
					);
				})
				.then((res) => {
					this.imageCode = res;
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
		},
		handleLogin() {
			this.$refs.loginForm.validate((valid) => {
				if (valid) {
					this.loading = true;
					api.login({
						...this.loginForm,
					})
						.then((r) => {
							const data = r.data;
							this.saveLoginData(data);
							this.getUserDetailInfo();
						})
						.catch((error) => {
							console.error(error);
							this.loading = false;
							// this.getCodeImage();
						});
				}
			});
		},
		saveLoginData(data) {
			this.$store.commit("account/setAccessToken", data.token);
		},
		getUserDetailInfo() {
			ElMessage({
				message: "登录成功",
				type: "success",
			});
			this.loading = false;
			this.$router.push("/");
			// this.$get("auth/user")
			// 	.then((r) => {
			// 		this.$store.commit("account/setUser", r.data.principal);
			// 		this.getUserOrgInfo(r.data.principal.orgId);
			// 		ElMessage({
			// 			message: "登录成功",
			// 			type: "success",
			// 		});
			// 		this.loading = false;
			// 		this.$router.push("/");
			// 	})
			// 	.catch((error) => {
			// 		ElMessage({
			// 			message: "登录失败",
			// 			type: "error",
			// 		});
			// 		console.error(error);
			// 		this.loading = false;
			// 	});
		},
		//获取所属机构信息
		getUserOrgInfo(orgId) {
			let params = {
				id: orgId,
			};
			this.$api.basic_baseOrg_getOneOrg(params).then((res) => {
				this.$store.commit("account/setUserOrg", res.data || {});
			});
		},
	},
};
</script>

<style lang="scss">
@import "login";
</style>
<style lang="scss" scoped>
@import "login-scoped";
</style>
