<template>
    <el-pagination
        class="pagination-content"
        :background="background"
        v-model:currentPage="currentPage"
        v-model:pageSize="pageSize"
        :layout="layout"
        :page-sizes="pageSizes"
        :total="total"
        :small="small"
        v-bind="$attrs"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
    />
</template>

<script setup>
import { scrollTo } from "@/utils/scroll-to";
const props = defineProps({
    small: {
        type: Boolean,
        default: true,
    },
    total: {
        required: true,
        type: Number,
    },
    page: {
        type: Number,
        default: 1,
    },
    limit: {
        type: Number,
        default: 20,
    },
    pageSizes: {
        type: Array,
        default() {
            return [5, 10, 20, 30, 50];
        },
    },
    layout: {
        type: String,
        default: "total, sizes, prev, pager, next, jumper",
    },
    background: {
        type: Boolean,
        default: true,
    },
    autoScroll: {
        type: Boolean,
        default: true,
    },
    hidden: {
        type: Boolean,
        default: false,
    },
});

const emits = defineEmits(["pagination", "update:page", "update:limit"]);
const handleSizeChange = (val) => {
    emits("pagination", { page: currentPage.value, limit: val });
    if (props.autoScroll) {
        scrollTo(0, 800);
    }
};
const handleCurrentChange = (val) => {
    emits("pagination", { page: val, limit: pageSize.value });
    if (props.autoScroll) {
        scrollTo(0, 800);
    }
};
const currentPage = computed({
    get: () => props.page,
    set: (val) => emits("update:page", val),
});
const pageSize = computed({
    get: () => props.limit,
    set: (val) => emits("update:limit", val),
});
</script>

<style scoped>
.pagination-content {
    margin-top: 8px;
    justify-content: end;
}
</style>
