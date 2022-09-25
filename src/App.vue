<!--
 * @Author: xunxiao 17810204418@163.com
 * @Date: 2022-09-17 21:10:34
 * @LastEditors: xunxiao 17810204418@163.com
 * @LastEditTime: 2022-09-17 21:13:10
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
        const store = useStore();
        onBeforeMount(() => {
        });
        return {
            locale: zhCn,
        };
    },
});
</script>
