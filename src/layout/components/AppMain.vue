<template>
    <section class="app-main">
        <router-view v-slot="{ Component }">
            <transition name="fade-transform" mode="out-in">
                <component :is="Component" :key="$route.path" />
            </transition>
        </router-view>
    </section>
</template>

<script>
export default {
    name: "AppMain",
};
</script>

<style lang="scss" scoped>
.app-main {
    /*50 = navbar  */
    min-height: calc(100vh - 93px);
    position: relative;
    overflow: hidden;
    background-color: #f5f5f5;
    /* height: 100vh; */
}
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
