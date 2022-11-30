<template>
    <div ref="tagsViewContainer" id="tags-view-container" class="tags-view-container">
        <scroll-pane ref="scrollPane" class="tags-view-wrapper" :tagRef="tagRef">
            <router-link
                v-for="tag in visitedViews"
                ref="tagRef"
                :key="tag.path"
                :class="isActive(tag) ? 'active' : ''"
                :to="{
                    path: tag.path,
                    query: tag.query,
                    fullPath: tag.fullPath,
                }"
                tag="span"
                class="tags-view-item"
                @click.middle="closeSelectedTag(tag)"
                @contextmenu.prevent="openMenu(tag, $event)"
            >
                {{ generateTitle(tag.title) }}
                <el-icon v-if="!tag.meta.affix" class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)"><CircleClose /></el-icon>
                <span v-else class="el-icon-none" />
            </router-link>
        </scroll-pane>
        <ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu">
            <!-- <li @click="refreshSelectedTag(selectedTag)">刷新当前</li> -->
            <li v-if="!(selectedTag.meta && selectedTag.meta.affix)" @click="closeSelectedTag(selectedTag)">关闭当前</li>
            <li @click="closeOthersTags">关闭其它</li>
            <li @click="closeAllTags(selectedTag)">关闭所有</li>
        </ul>
    </div>
</template>
<script setup>
import path from "path";
import ScrollPane from "./ScrollPane.vue";
const store = useStore();
const _route = useRoute();
const _router = useRouter();
const visible = ref(false);
const top = ref(0);
const left = ref(0);
const selectedTag = ref({});
const affixTags = ref([]);
const tagRef = ref(null);
const tagsViewContainer = ref(null);
const scrollPane = ref(null);
const visitedViews = computed(() => store.state.tagsView.visitedViews);
const routes = computed(() => store.state.account.routes || []);
const generateTitle = (title) => title;
const isActive = (route) => {
    return route.path === _route.path;
};
const filterAffixTags = (routes, basePath = "/") => {
    let tags = [];
    routes.forEach((route) => {
        if (route.meta && route.meta.affix) {
            const tagPath = path.resolve(basePath, route.path);
            tags.push({
                fullPath: tagPath,
                path: tagPath,
                name: route.name,
                meta: { ...route.meta },
            });
        }
        if (route.children) {
            const tempTags = filterAffixTags(route.children, route.path);
            if (tempTags.length >= 1) {
                tags = [...tags, ...tempTags];
            }
        }
    });
    return tags;
};
const initTags = () => {
    const affixTagArr = (affixTags.value = filterAffixTags(unref(routes)));
    for (const tag of affixTagArr) {
        // Must have tag name
        if (tag.name) {
            this.$store.dispatch("tagsView/addVisitedView", tag);
        }
    }
};
const addTags = () => {
    const { name } = _route;
    if (name) {
        store.dispatch("tagsView/addView", _route);
    }
    return false;
};
const moveToCurrentTag = () => {
    const tagRefs = unref(tagRef);
    nextTick(() => {
        for (const tag of tagRefs) {
            if (tag.to.path === _route.path) {
                unref(scrollPane).moveToTarget(tag);
                // when query is different then update
                if (tag.to.fullPath !== _route.fullPath) {
                    store.dispatch("tagsView/updateVisitedView", _route);
                }
                break;
            }
        }
    });
};
const refreshSelectedTag = (view) => {
    store.dispatch("tagsView/delCachedView", view).then(() => {
        const { fullPath } = view;
        nextTick(() => {
            _router.replace({
                path: "/redirect" + fullPath,
            });
        });
    });
};
const closeSelectedTag = (view) => {
    store.dispatch("tagsView/delView", view).then(({ visitedViews }) => {
        if (isActive(view)) {
            toLastView(visitedViews, view);
        }
    });
};
const closeOthersTags = () => {
    _router.push(unref(selectedTag));
    store.dispatch("tagsView/delOthersViews", unref(selectedTag)).then(() => {
        moveToCurrentTag();
    });
};
const closeAllTags = (view) => {
    store.dispatch("tagsView/delAllViews").then(({ visitedViews }) => {
        if (unref(affixTags).some((tag) => tag.path === view.path)) {
            return;
        }
        toLastView(visitedViews, view);
    });
};
const toLastView = (visitedViews, view) => {
    const latestView = visitedViews.slice(-1)[0];
    if (latestView) {
        _router.push(latestView);
    } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view.name === "Dashboard") {
            // to reload home page
            _router.replace({ path: "/redirect" + view.fullPath });
        } else {
            _router.push("/");
        }
    }
};
const openMenu = (tag, e) => {
    const menuMinWidth = 105;
    const offsetLeft = unref(tagsViewContainer).getBoundingClientRect().left; // container margin left
    const offsetWidth = unref(tagsViewContainer).offsetWidth; // container width
    const maxLeft = offsetWidth - menuMinWidth; // left boundary
    const posLeft = e.clientX - offsetLeft + 15; // 15: margin right
    if (posLeft > maxLeft) {
        left.value = maxLeft;
    } else {
        left.value = posLeft;
    }

    top.value = e.clientY;
    visible.value = true;
    selectedTag.value = tag;
    window.selectedTag = tag;
};
const closeMenu = () => (visible.value = false);
watch(_route, () => {
    // if you go to the redirect page, do not update the breadcrumbs
    addTags();
    moveToCurrentTag();
});
watch(visible, (value) => {
    if (value) {
        document.body.addEventListener("click", closeMenu);
    } else {
        document.body.removeEventListener("click", closeMenu);
    }
});
onMounted(() => {
    initTags();
    addTags();
});
</script>
<style lang="scss" scoped>
.tags-view-container {
    height: 35px;
    width: 100%;
    background: #fff;
    border-bottom: 1px solid #f1f1f1;

    .tags-view-wrapper {
        .tags-view-item {
            display: inline-block;
            position: relative;
            cursor: pointer;
            height: 34px;
            line-height: 34px;
            border-left: 1px solid #f1f1f1;
            color: #999;
            background: #fff;
            padding: 0 5px 0 20px;
            font-size: 13px;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            .el-icon-none {
                width: 16px;
                margin-left: 3px;
            }

            &:hover {
                color: #495060;

                & .el-icon-close {
                    font-weight: bold;
                    color: red;
                }
            }

            &:last-of-type {
                border-right: 1px solid #f1f1f1;
            }

            &.active {
                /*background-color: #42b983;*/
                /*color: #fff;*/
                /*border-color: #42b983;*/
                &::before {
                    content: "";
                    background: #85ef47 !important;
                    box-shadow: 0 0 7px #b7eb8f;
                    display: inline-block;
                    width: 5px;
                    height: 5px;
                    border-radius: 50%;
                    position: relative;
                    margin-right: 4px;
                }
            }
        }
    }

    .contextmenu {
        margin: 0;
        background: #fff;
        z-index: 3000;
        position: absolute;
        list-style-type: none;
        padding: 5px 0;
        border-radius: 4px;
        font-size: 13px;
        font-weight: 400;
        color: #333;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

        li {
            margin: 0;
            padding: 7px 20px;
            cursor: pointer;

            &:hover {
                background-color: #e8f4ff;
                color: #46a6ff;
            }
        }
    }
}
</style>
<style lang="scss">
.tags-view-wrapper {
    .tags-view-item {
        .el-icon-close {
            color: #fff;
            width: 16px;
            height: 16px;
            vertical-align: 2px;
            font-size: 12px;
            font-weight: 600;
            border-radius: 50%;
            text-align: center;
            transform-origin: 100% 50%;
            margin-left: 3px;
            &:before {
                transform: scale(0.6);
                display: inline-block;
                vertical-align: -3px;
            }
        }
    }
}
</style>
