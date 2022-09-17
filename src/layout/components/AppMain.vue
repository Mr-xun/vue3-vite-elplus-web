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

<style scoped>
.app-main {
    /*50 = navbar  */
    min-height: calc(100vh - 93px);
    position: relative;
    overflow: hidden;
    background-color: #f5f5f5;
    /* height: 100vh; */
}
</style>
