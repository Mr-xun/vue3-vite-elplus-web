<template>
    <div v-if="!route.hidden" class="menu-wrapper">
        <template v-if="onlyOneShowChild(route.children, route) && (!onlyOneChild.children || onlyOneChild.noShowingChildren) && !route.meta?.alwaysShow">
            <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{ 'submenu-title-noDropdown': !isNest }">
                <el-icon v-if="onlyOneChild.meta?.icon || route.meta?.icon">
                    <component :is="onlyOneChild.meta.icon || route.meta.icon" />
                </el-icon>
                <template #title>{{ onlyOneChild.meta?.title }}</template>
            </el-menu-item>
        </template>
        <el-sub-menu ref="subMenu" v-else :index="resolvePath(route.path)" popper-append-to-body>
            <template #title>
                <el-icon v-if="route.meta?.icon">
                    <component :is="route.meta.icon" />
                </el-icon>
                <span>{{ route.meta?.title }}</span>
            </template>
            <sidebar-item v-for="(child, index) in filterRoutes(route.children)" :key="child.path + index" :route="child" :base-path="resolvePath(child.path)" />
        </el-sub-menu>
    </div>
</template>
<script setup>
import { isExternal } from "@/utils/validate";
defineOptions({
    name: "SidebarItem",
});
const props = defineProps({
    route: {
        type: Object,
        default: () => {
            return {};
        },
    },
    isNest: {
        type: Boolean,
        default: false,
    },
    basePath: {
        type: String,
        default: "",
    },
});
let onlyOneChild = ref(null);
//只有一个孩子时展示
const onlyOneShowChild = (children = [], parent) => {
    let showChildren = children.filter((item) => {
        if (item.meta?.hidden) {
            return false;
        } else {
            onlyOneChild.value = item;
            return true;
        }
    });
    // 当只有一个子路由时，将默认展示其子路由
    if (showChildren.length === 1) {
        return true;
    }

    // 如果没有子路由则展示其父路由
    if (showChildren.length === 0) {
        onlyOneChild.value = { ...parent, path: "", noShowingChildren: true };
        return true;
    }
    return false;
};
//获取正确的路经
const getNormalPath = (path) => {
    if (path.length === 0 || !path || path == "undefined") {
        return path;
    }
    const newPath = path.replace("//", "/");
    const length = newPath.length;
    if (newPath[length - 1] === "/") {
        return newPath.slice(0, length - 1);
    }
    return newPath;
};
const resolvePath = (routePath) => {
    if (isExternal(routePath)) {
        return routePath;
    }
    if (isExternal(props.basePath)) {
        return props.basePath;
    }

    return getNormalPath(`${props.basePath}/${routePath}`);
};
//过滤路由
const filterRoutes = (routes = []) => routes.filter((route) => !route.meta?.hidde);
</script>
