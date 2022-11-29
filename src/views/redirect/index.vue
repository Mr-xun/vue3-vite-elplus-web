<!--
 * @Author: xunxiao
 * @Date: 2022-11-29 15:35:13
 * @LastEditors: xunxiao
 * @LastEditTime: 2022-11-29 16:23:20
 * @Description: 
-->
<script>
export default defineComponent({
    setup() {
        const router = useRouter();
        const route = useRoute();
        onBeforeMount(() => {
            const { path, query } = route;
            router.replace({ path: path.replace("/redirect", ""), query });
        });
    },
    render(ins) {
        return h(ins);
    },
});
</script>
