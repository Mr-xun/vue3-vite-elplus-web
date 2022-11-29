<!--
 * @Author: xunxiao
 * @Date: 2022-09-19 08:24:40
 * @LastEditors: xunxiao
 * @LastEditTime: 2022-11-29 15:13:55
 * @Description: Layout Component
-->
<template>
    <div :class="classObj" class="app-wrapper">
        <div v-if="device === 'mobile' && sidebarObj.opened" class="drawer-bg" @click="handleClickOutside" />
        <sidebar class="sidebar-container" />
        <div :class="{ hasTagsView: needTagsView }" class="main-container">
            <div :class="{ 'fixed-header': fixedHeader }">
                <navbar />
                <tags-view v-if="needTagsView" />
            </div>
            <app-main style="min-width: calc(100vh - 93px)" />
        </div>
    </div>
</template>
<script setup>
import { Navbar, Sidebar, AppMain, TagsView } from "./components/index.js";
import resizeHandler from "./hooks/resizeHandler";
resizeHandler();
const store = useStore();
const sidebarObj = computed(() => store.state.setting.sidebar);
const device = computed(() => store.state.setting.device);
const needTagsView = computed(() => store.state.setting.multipage);
const fixedHeader = computed(() => store.state.setting.fixHeader);

const classObj = computed(() => {
    return {
        hideSidebar: !sidebarObj.value.opened,
        openSidebar: sidebarObj.value.opened,
        withoutAnimation: sidebarObj.value.withoutAnimation,
        mobile: device.value === "mobile",
    };
});

const handleClickOutside = () => store.commit("setting/closeSidebar", { withoutAnimation: false });
</script>

<style lang="scss" scoped>
@import "@/styles/mixin.scss";
@import "@/styles/variables.module.scss";
.app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;

    &.mobile.openSidebar {
        position: fixed;
        top: 0;
    }
}

.drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
}

.fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
}

.hideSidebar .fixed-header {
    width: calc(100% - 54px);
}

.mobile .fixed-header {
    width: 100%;
}
.footer {
    position: fixed;
    bottom: 0;
    right: 0;
    text-align: center;
    height: 2.4rem;
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
    font-size: 13px;
    background: #fff;
    width: calc(100% - #{$sideBarWidth});
    display: block;
    z-index: 999;
    color: #606266;
    line-height: 2.4rem;
}
.hideSidebar .footer {
    width: calc(100% - 54px);
}

.mobile .footer {
    width: 100%;
}
</style>
