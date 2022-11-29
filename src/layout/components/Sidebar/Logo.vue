<template>
    <div class="sidebar-logo-container" :class="{ collapse: collapse }">
        <transition name="sidebarLogoFade">
            <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
                <img v-if="logo" :src="logo" class="sidebar-logo" />
                <h1 v-else class="sidebar-title">{{ title }}</h1>
            </router-link>
            <router-link v-else key="expand" class="sidebar-logo-link" to="/">
                <img v-if="logo" :src="logo" class="sidebar-logo" />
                <h1 class="sidebar-title">管理系统</h1>
            </router-link>
        </transition>
    </div>
</template>
<script setup>
defineOptions({
    name: "SidebarLogo",
});
const props = defineProps({
    collapse: {
        type: Boolean,
        required: true,
    },
});
const logo = computed(() => new URL(`../../../assets/avatar/BiazfanxmamNRoxxVxka.png`, import.meta.url).href);
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
    transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
    opacity: 0;
}

.sidebar-logo-container {
    position: relative;
    width: 100%;
    height: 54px;
    line-height: 54px;
    background: #272c33;
    text-align: center;
    overflow: hidden;

    & .sidebar-logo-link {
        height: 100%;
        width: 100%;

        & .sidebar-logo {
            width: 32px;
            margin-right: 12px;
            display: inline-block;
            vertical-align: middle;
            margin-bottom: -2px;
        }

        & .sidebar-title {
            display: inline-block;
            margin: 0;
            color: #fff;
            font-weight: 500;
            line-height: 50px;
            font-size: 16px;
            vertical-align: middle;
            & span {
                font-size: 12px;
                letter-spacing: 1px;
            }
        }
    }

    &.collapse {
        .sidebar-logo {
            margin-right: 0;
        }
    }
}
</style>
