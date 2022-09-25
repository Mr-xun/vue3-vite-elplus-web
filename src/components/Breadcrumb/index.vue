<!--
 * @Author: xunxiao
 * @Date: 2022-09-19 08:24:39
 * @LastEditors: xunxiao
 * @LastEditTime: 2022-09-19 17:33:54
 * @Description: Breadcrumb Component
-->
<template>
    <el-breadcrumb class="app-breadcrumb" separator="/">
        <transition-group name="breadcrumb">
            <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
                <span v-if="item.redirect === 'noRedirect' || index == levelList.length - 1" class="no-redirect">{{ item.meta.title }}</span>
                <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
            </el-breadcrumb-item>
        </transition-group>
    </el-breadcrumb>
</template>
<script setup>
import * as pathToRegexp from "path-to-regexp";
const levelList = ref(null);
const router = useRouter();
const route = useRoute();
const isDashboard = (route) => {
    const name = route && route.name;
    if (!name) {
        return false;
    }
    return name.trim().toLocaleLowerCase() === "Dashboard".toLocaleLowerCase();
};
const getBreadcrumb = () => {
    // only show routes with meta.title
    // let matched = unref(router.currentRoute).matched.filter((item) => item.name);
    let matched = route.matched.filter((item) => item.meta && item.meta.title);
    const first = matched[0];
    if (!isDashboard(first)) {
        matched = [{ path: "/", meta: { title: "智慧车险" } }].concat(matched);
    }
    levelList.value = matched.filter((item) => item.meta && item.meta.title && item.meta.breadcrumb !== false);
};
const pathCompile = (path) => {
    const { params } = unref(route);
    var toPath = pathToRegexp.compile(path);
    return toPath(params);
};

const handleLink = (item) => {
    const { redirect, path } = item;
    if (redirect) {
        router.push(redirect);
        return;
    }
    router.push(pathCompile(path));
};
watch(
    route,
    () => {
        // if you go to the redirect page, do not update the breadcrumbs
        if (route.path.startsWith("/redirect/")) {
            return;
        }
        getBreadcrumb();
    },
    { immediate: true }
);
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
    display: inline-block;
    font-size: 14px;
    line-height: 50px;
    margin-left: 8px;
    .no-redirect {
        color: #97a8be;
        cursor: text;
    }
}
</style>
