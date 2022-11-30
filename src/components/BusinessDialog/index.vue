<!--
 * @Author: xunxiao
 * @Date: 2022-09-13 14:08:02
 * @LastEditors: xunxiao
 * @LastEditTime: 2022-11-30 14:14:00
 * @Description: 业务弹窗组件
-->
<template>
    <el-dialog
        v-model="isVisible"
        custom-class="business-dialog"
        :width="width"
        top="8vh"
        append-to-body
        center
        :fullscreen="fullscreen"
        :show-close="showClose"
        :draggable="draggable"
        :close-on-click-modal="false"
    >
        <template #header>
            <FormSubLabel :label="title"></FormSubLabel>
            <el-divider />
        </template>
        <el-card shadow="never">
            <slot name="content" />
        </el-card>
        <template #footer>
            <slot name="footer" />
        </template>
    </el-dialog>
</template>
<script setup>
import "../FormSubLabel/index.vue";
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false,
    },
    title: {
        type: String,
        required: true,
    },
    width: {
        type: String,
        default: "800px",
    },
    fullscreen: {
        type: Boolean,
        default: false,
    },
    showClose: {
        type: Boolean,
        default: true,
    },
    draggable: {
        type: Boolean,
        default: false,
    },
});
const emits = defineEmits(["update:modelValue", "beforeClose"]);
const isVisible = computed({
    get: () => props.modelValue,
    set: (val) => emits("update:modelValue", val),
});
</script>
<style lang="scss">
.business-dialog {
    background: #f5f5f5 !important;
    .el-dialog__body {
        padding: 0 15px 10px !important;
    }
    .el-dialog__header {
        padding: 5px 15px 0px !important;
        margin-right: 0 !important;
    }
    .el-dialog__footer {
        padding-top: 0 !important;
        padding-bottom: 10px !important;
    }
    .el-divider {
        margin: 5px 0 !important;
    }
}
</style>
