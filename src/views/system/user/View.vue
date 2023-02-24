<template>
    <el-dialog title="查看" :width="width" v-model="isVisible" class="user-view">
        <el-row :gutter="10">
            <el-col :xs="24" :sm="24">
                <div class="img-wrapper">
                    <img :src="avatar" />
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="10">
            <el-col :xs="24" :sm="12">
                <div class="view-item">
                    <el-icon><User /></el-icon>
                    <span>用户名：</span> {{ user.userName }}
                </div>
            </el-col>
            <el-col :xs="24" :sm="12">
                <div class="view-item">
                    <el-icon><User /></el-icon><span>姓名：</span> {{ user.realName }}
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="10">
            <el-col :xs="24" :sm="12">
                <div class="view-item">
                    <el-icon><Suitcase /></el-icon><span>部门：</span> {{ user.deptName }}
                </div>
            </el-col>
            <el-col :xs="24" :sm="12">
                <div class="view-item">
                    <el-icon><Trophy /></el-icon><span>角色：</span> {{ user.roleNames.join(",") }}
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="10">
            <el-col :xs="24" :sm="12">
                <div class="view-item">
                    <el-icon><Trophy /></el-icon><span>机构：</span> {{ user.orgId }}
                </div>
            </el-col>
            <el-col :xs="24" :sm="12">
                <div class="view-item">
                    <el-icon><Phone /></el-icon> <span>电话：</span> {{ user.mobile }}
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="10">
            <el-col :xs="24" :sm="12">
                <div class="view-item">
                    <el-icon><Star /></el-icon><span>性别：</span> {{ transSex(user.sex) }}
                </div>
            </el-col>
            <el-col :xs="24" :sm="12">
                <div class="view-item">
                    <el-icon><Aim /></el-icon><span>状态：</span> {{ user.status === "1" ? "有效" : "禁用" }}
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="10">
            <el-col :xs="24" :sm="12">
                <div class="view-item">
                    <el-icon><Timer /></el-icon><span>创建时间</span> {{ user.createTime }}
                </div>
            </el-col>
            <el-col :xs="24" :sm="12">
                <div class="view-item">
                    <el-icon><Brush /></el-icon><span>修改时间：</span>{{ user.updateTime }}
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="10">
            <el-col :xs="24" :sm="24">
                <div class="view-item">
                    <el-icon><Calendar /></el-icon><span>最后登录时间：</span>{{ user.lastLoginTime ?? "从未登录过系统" }}
                </div>
            </el-col>
            <el-col :xs="24" :sm="24">
                <div class="view-item">
                    <el-icon><Document /></el-icon><span>描述：</span> {{ user.description ?? "这家伙很懒，什么都没留下" }}
                </div>
            </el-col>
        </el-row>
    </el-dialog>
</template>
<script setup>
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false,
    },
});
const screenWidth = ref(0);
const user = ref({});
const initWidth = () => {
    screenWidth.value = document.body.clientWidth;
    if (screenWidth.value < 550) {
        return "95%";
    } else if (screenWidth.value < 990) {
        return "580px";
    } else if (screenWidth.value < 1400) {
        return "750px";
    } else {
        return "900px";
    }
};
const width = initWidth();
const emits = defineEmits(["update:modelValue"]);
const isVisible = computed({
    get: () => props.modelValue,
    set: (val) => emits("update:modelValue", val),
});
const avatar = computed(() => {
    if (user.value.avatar) {
        return new URL(`../../../assets/avatar/19034103295190235.jpg`, import.meta.url).href;
    } else {
        return new URL(`../../../assets/avatar/default.jpg`, import.meta.url).href;
    }
});
const transSex = (sex) => {
    switch (Number(sex)) {
        case 1:
            return "男";
        case 2:
            return "女";
        default:
            return "保密";
    }
};
const setFormData = (val) => (user.value = { ...val });
defineExpose({ setFormData });
</script>
<style lang="scss" scoped>
.user-view {
    .img-wrapper {
        text-align: center;
        margin-top: -1.5rem;
        margin-bottom: 10px;
        img {
            width: 4rem;
            border-radius: 50%;
        }
    }
    .view-item {
        margin: 7px;
        i {
            font-size: 0.97rem;
        }
        span {
            margin-left: 5px;
        }
    }
}
</style>
