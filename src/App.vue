<!--
 * @Author: xunxiao 17810204418@163.com
 * @Date: 2022-09-17 21:10:34
 * @LastEditors: xunxiao
 * @LastEditTime: 2022-12-03 16:40:26
 * @Description: app-vue
-->
<template>
    <el-config-provider :locale="locale" namespace="el">
        <router-view />
    </el-config-provider>
</template>

<script>
import { defineComponent, onBeforeMount } from "vue";
import { ElConfigProvider } from "element-plus";
import zhCn from "element-plus/lib/locale/lang/zh-cn";
export default defineComponent({
    components: {
        ElConfigProvider,
    },
    setup() {
        return {
            locale: zhCn,
        };
    },
});
</script>
