<template>
    <el-dialog v-model="isVisible" :title="title" :width="width" top="50px" :close-on-click-modal="false" :close-on-press-escape="false" draggable>
        <el-form ref="formRef" :inline="true" :model="form" :rules="rules" label-position="right" label-width="140px">
            <el-form-item label="枚举类型编码：" prop="typeCode">
                <el-input :style="{ width: itemWidth }" v-model="form.typeCode" :disabled="!!form.typeId" />
            </el-form-item>
            <el-form-item label="枚举类型名称：" prop="typeName">
                <el-input :style="{ width: itemWidth }" v-model="form.typeName" />
            </el-form-item>
            <el-form-item label="枚举类型说明：">
                <el-input :style="{ width: itemWidth }" v-model="form.remark" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="warning" plain :loading="buttonLoading" @click="isVisible = false">取消</el-button>
                <el-button type="primary" plain :loading="buttonLoading" @click="submitForm">确定</el-button>
            </div>
        </template>
    </el-dialog>
</template>
<script setup>
import api from "@/api";
const props = defineProps({
    dialogVisible: {
        type: Boolean,
        default: false,
    },
    title: {
        type: String,
        default: "",
    },
});
const itemWidth = ref("295px");
const initFormData = () => {
    return {
        typeCode: "",
        typeName: "",
        remark: "",
    };
};
const form = ref(initFormData());
const buttonLoading = ref(false);
const screenWidth = ref(0);
const initWidth = () => {
    screenWidth.value = document.body.clientWidth;
    return "500px";
};
const width = ref(initWidth());
const formRef = ref(null);
const rules = reactive({
    typeName: [{ required: true, message: "不能为空", trigger: "blur" }],
    typeCode: [{ required: true, message: "不能为空", trigger: "blur" }],
});
const emits = defineEmits(["close", "success"]);
const close = () => emits("close");
const reset = () => {
    // 先清除校验，再清除表单，不然有奇怪的bug
    unref(formRef).clearValidate();
    unref(formRef).resetFields();
    form.value = initFormData();
};

//设置默认表单数据
const setFormData = (val) => {
    form.value = { ...val };
};

const submitForm = () => {
    unref(formRef).validate((valid) => {
        if (valid) {
            buttonLoading.value = true;
            let params = { ...unref(form) };
            let opFetch = params.typeId ? api.basic_enumType_update : api.basic_enumType_create;
            opFetch(params)
                .then(({ code }) => {
                    if (code == 200) {
                        isVisible.value = false;
                        ElMessage({
                            message: params.typeId ? "修改成功" : "新增成功",
                            type: "success",
                        });
                        emits("success");
                    }
                    buttonLoading.value = false;
                })
                .catch((err) => {
                    console.log(err);
                    buttonLoading.value = false;
                });
        } else {
            return false;
        }
    });
};
const isVisible = computed({
    get: () => props.dialogVisible,
    set: () => {
        close();
        reset();
    },
});
onMounted(() => {
    window.onresize = () => {
        return (() => {
            width.value = initWidth();
        })();
    };
});
defineExpose({ setFormData });
</script>
