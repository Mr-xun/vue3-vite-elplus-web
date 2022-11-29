<!--
 * @Author: xunxiao
 * @Date: 2022-09-19 08:24:40
 * @LastEditors: xunxiao
 * @LastEditTime: 2022-11-29 15:25:21
 * @Description: Sidebar Component
-->
<template>
    <div :class="{ 'has-logo': showLogo }">
        <logo v-if="showLogo" :collapse="sidebarCollapse" />
        <el-scrollbar wrap-class="scrollbar-wrapper">
            <el-menu
                :default-active="activeMenu"
                class="el-menu-vertical-demo"
                :collapse="sidebarCollapse"
                :background-color="variables.menuBg"
                :text-color="variables.menuText"
                :active-text-color="variables.menuActiveText"
                :collapse-transition="true"
                mode="vertical"
                router
            >
                <sidebar-item v-for="route in userRoutes" :key="route.path" :route="route" :base-path="route.path" />
            </el-menu>
        </el-scrollbar>
    </div>
</template>

<script setup>
import Logo from './Logo.vue';
import SidebarItem from "./SidebarItem.vue";
import { routes } from "@/router/routes";
import sassVariables from "@/styles/variables.module.scss";
const route = useRoute();
const store = useStore();
const menuRoutes = computed(() => routes.filter((route) => !route.meta?.hidden));
const activeMenu = computed(() => {
    if (route.meta.activeMenu) {
        return route.meta.activeMenu;
    }
    return route.path;
});
const showLogo = computed(() => store.state.setting.sidebarLogo);
const sidebarCollapse = computed(() => !store.state.setting.sidebar.opened);
const userRoutes = computed(() => [...menuRoutes.value, ...store.state.account.routes]);
const variables = reactive(sassVariables);
</script>
