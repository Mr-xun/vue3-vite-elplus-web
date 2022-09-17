<template>
    <div :class="classObj" class="app-wrapper">
        <sidebar v-if="isDevelopment" class="sidebar-container" />
        <div class="main-container">
            <navbar v-if="isDevelopment" />
            <app-main style="min-width: calc(100vh - 93px)" />
        </div>
    </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from "./components/index.js";
import ResizeMixin from "./mixin/ResizeHandler";
export default {
    name: "Layout",
    components: {
        Navbar,
        Sidebar,
        AppMain,
    },
    mixins: [ResizeMixin],
    computed: {
        sidebar() {
            return this.$store.state.app.sidebar;
        },
        device() {
            return this.$store.state.app.device;
        },
        classObj() {
            return {
                hideSidebar: !this.sidebar.opened,
                openSidebar: this.sidebar.opened,
                withoutAnimation: this.sidebar.withoutAnimation,
                mobile: this.device === "mobile",
            };
        },
        isDevelopment() {
            //开发环境
            return import.meta.env.VUE_APP_FLAG === "dev";
        },
    },
    methods: {
        handleClickOutside() {
            this.$store.dispatch("CloseSideBar", {
                withoutAnimation: false,
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.app-wrapper {
    position: relative;
    height: 100%;
    width: 100%;

    &.mobile.openSidebar {
        position: fixed;
        top: 0;
    }
}
</style>
