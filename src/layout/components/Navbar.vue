<!--
 * @Author: xunxiao
 * @Date: 2022-09-19 08:24:39
 * @LastEditors: xunxiao
 * @LastEditTime: 2023-02-21 17:15:42
 * @Description: Navbar Component
-->
<template>
    <div class="navbar">
        <hamburger @toggleClick="toggleSideBar" :is-active="sidebarCollapse" class="hamburger-container" />
        <breadcrumb />
        <div class="right-menu">
            <template v-if="device !== 'mobile'">
                <!-- <search id="header-search" class="right-menu-item" />
                <screenfull id="screenfull" class="right-menu-item hover-effect" /> -->
                <!-- <lang-select class="right-menu-item hover-effect" /> -->
            </template>
            <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
                <div class="avatar-wrapper">
                    <img :src="avatar" class="user-avatar" alt="avatar" />
                    <span class="user-name">{{ userName }}</span>
                </div>
                <template #dropdown>
                    <el-dropdown-menu class="user-dropdown">
                        <router-link to="/profile/index">
                            <el-dropdown-item>个人中心</el-dropdown-item>
                        </router-link>
                        <el-dropdown-item divided>
                            <span style="display: block" @click="deleteCache">清除缓存</span>
                        </el-dropdown-item>
                        <el-dropdown-item divided>
                            <span style="display: block" @click="logout">退出登录</span>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>
<script setup>
import Breadcrumb from "@/components/Breadcrumb/index.vue";
import Hamburger from "@/components/Hamburger/index.vue";
import db from "@/utils/localstorage";
import { ElMessageBox } from "element-plus";
const store = useStore();

const sidebarCollapse = computed(() => !!store.state.setting.sidebar.opened);
const userName = computed(() => store.state.account.user.realName);
const device = computed(() => store.state.setting.device);
const avatar = computed(() => new URL(`../../assets/avatar/19034103295190235.jpg`, import.meta.url).href);

const toggleSideBar = () => store.commit("setting/toggleSidebar");
const logout = () => {
    db.clear();
    location.reload();
};
//清除缓存
const deleteCache = () => {
    ElMessageBox.confirm("是否立即清除用户权限缓存？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
    }).then(() => {
        let removeMap = ["USER_ROUTER", "PERMISSIONS,"];
        removeMap.forEach((v) => {
            db.remove(v);
        });
        location.reload();
    });
};
</script>
<style lang="scss" scoped>
.navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    border-bottom: 1px solid #f1f1f1;
    .hamburger-container {
        float: left;
        padding: 0 15px;
        align-items: center;
        height: 100%;
        line-height: 58px;
    }

    .right-menu {
        float: right;
        height: 100%;
        line-height: 50px;

        &:focus {
            outline: none;
        }

        .right-menu-item {
            display: inline-block;
            padding: 0 8px;
            height: 100%;
            font-size: 18px;
            color: #5a5e66;
            vertical-align: text-bottom;

            &.hover-effect {
                cursor: pointer;
                transition: background 0.3s;

                &:hover {
                    background: rgba(0, 0, 0, 0.025);
                }
            }
        }

        .avatar-container {
            margin-right: 10px;

            .avatar-wrapper {
                height: 100%;
                position: relative;
                display: flex;
                align-items: center;
                .user-name {
                    vertical-align: top;
                    font-size: 0.9rem;
                    margin-left: 5px;
                    display: inline-block;
                }
                .user-avatar {
                    cursor: pointer;
                    width: 2rem;
                    height: 2rem;
                    border-radius: 50%;
                    vertical-align: text-bottom;
                }

                .el-icon-caret-bottom {
                    cursor: pointer;
                    position: absolute;
                    right: -20px;
                    top: 25px;
                    font-size: 12px;
                }
            }
        }
    }
}
</style>
