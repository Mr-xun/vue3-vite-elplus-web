<template>
    <div class="navbar">
        <hamburger @toggleClick="toggleSideBar" :is-active="sidebarCollapse" class="hamburger-container" />
        <breadcrumb />
        <el-dropdown class="avatar-container" trigger="click">
            <div class="avatar-wrapper">
                <el-icon class="user-avatar">
                    <Avatar />
                </el-icon>
                <el-icon><CaretBottom /></el-icon>
            </div>
            <template #dropdown>
                <el-dropdown-menu class="user-dropdown">
                    <el-dropdown-item>
                        <span style="display: block" @click="logout">登出</span>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
</template>
<script setup>
import Breadcrumb from "@/components/Breadcrumb/index.vue";
import Hamburger from "@/components/Hamburger/index.vue";
const store = useStore();
const toggleSideBar = () => {
    store.dispatch("ToggleSideBar");
};
const sidebarCollapse = computed(() => store.state.app.sidebar.opened);
</script>
<style lang="scss" scoped>
.navbar {
    height: 50px;
    line-height: 50px;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);

    .hamburger-container {
        line-height: 50px;
        height: 50px;
        float: left;
        padding: 0 10px;
    }

    .avatar-container {
        height: 50px;
        display: inline-block;
        position: absolute;
        right: 35px;

        .avatar-wrapper {
            cursor: pointer;
            margin-top: 5px;
            position: relative;
            line-height: initial;

            .user-avatar {
                width: 40px;
                height: 40px;
                border-radius: 10px;
            }

            .ep-icon-caret-bottom {
                position: absolute;
                right: -20px;
                top: 25px;
                font-size: 12px;
            }
        }
    }
}
</style>
