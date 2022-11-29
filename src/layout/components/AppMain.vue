<template>
    <section class="app-main">
        <router-view v-slot="{ Component }">
            <transition name="fade-transform" mode="out-in">
                <component :is="Component" @vnode-mounted="componentMounted" :key="$route.path" />
            </transition>
        </router-view>
    </section>
</template>
<script setup>
import setTableHeight from "../hooks/setTableHeight";
let getTableHeight = setTableHeight();
const componentMounted = () => getTableHeight.initHeight();//重置页面table height
provide("tableHeight", getTableHeight.tableHeight); //设置页面table height
</script>
<style lang="scss" scoped>
.app-main {
    /* 50= navbar  50  */
    min-height: calc(100vh - 50px);
    width: 100%;
    position: relative;
    overflow: hidden;
    background: #f3f5f8;
    font-size: 0.88rem;
}

.fixed-header + .app-main {
    padding-top: 50px;
    height: 100vh;
    overflow: auto;
}
.hasTagsView {
    .app-main {
        /* 84 = navbar + tags-view = 50 + 34 */
        min-height: calc(100vh - 84px);
    }

    .fixed-header + .app-main {
        padding-top: 84px;
        overflow-x: hidden;
    }
}
</style>
<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
    .fixed-header {
        padding-right: 15px;
    }
}
</style>
