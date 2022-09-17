<template>
    <el-breadcrumb class="app-breadcrumb" separator="/">
        <transition-group name="breadcrumb">
            <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
                <span v-if="item.redirect === 'noredirect' || index == levelList.length - 1" class="no-redirect">{{ item.meta.title }}</span>
                <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
            </el-breadcrumb-item>
        </transition-group>
    </el-breadcrumb>
</template>
<script setup>
import * as pathToRegexp from "path-to-regexp";
const levelList = ref(null);
const router = useRouter();
const getBreadcrumb = () => {
    let matched = unref(router.currentRoute).matched.filter((item) => item.name);
    matched = [
        {
            path: "/",
            meta: {
                title: "智慧车险",
            },
        },
    ].concat(matched);
    levelList.value = matched.filter((item) => item.meta && item.meta.title && item.meta.breadcrumb !== false);
};
const pathCompile = (path) => {
    const { params } = unref(router.currentRoute);
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
watch(router.currentRoute, () => getBreadcrumb(), { immediate: true });
</script>

<style lang="scss" scoped>
.app-breadcrumb.ep-breadcrumb {
    display: inline-block;
    font-size: 14px;
    line-height: 50px;
    margin-left: 10px;

    .no-redirect {
        color: #97a8be;
        cursor: text;
    }
    .ep-breadcrumb__inner,
    .ep-breadcrumb__inner a {
        font-weight: 400 !important;
    }
}
</style>
