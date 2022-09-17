<template>
    <div class="form-label">
        <span style="margin-right: 6px; background: #1890ff">&nbsp;</span>
        {{ label }}
    </div>
</template>
<script setup>
defineProps({
    label: {
        type: String,
        default: true,
    },
});
</script>
<style scoped>
.form-label {
    font-weight: bold;
    padding: 10px;
    display: flex;
    align-items: center;
    color: #606266;
    font-size: 14px;
}
</style>
