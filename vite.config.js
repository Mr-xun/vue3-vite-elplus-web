/*
 * @Author: xunxiao 17810204418@163.com
 * @Date: 2022-09-17 21:10:34
 * @LastEditors: xunxiao
 * @LastEditTime: 2022-10-24 14:47:45
 * @Description: vite.config.js
 */
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite"; //自动导入
import Components from "unplugin-vue-components/vite";
import ElementPlus from 'unplugin-element-plus/vite'
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import DefineOptions from "unplugin-vue-define-options/vite";
import viteCompression from "vite-plugin-compression";
import commonjs from "rollup-plugin-commonjs";
import externalGlobals from "rollup-plugin-external-globals"; //配置全局变量
import { fileURLToPath, URL } from "url";
// 全局对象
let globals = externalGlobals({
    axios: "axios",
    lodash: "_",
});
// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
    const env = command == "serve" ? "development" : "production";
    return {
        server: {
            open: true,
            host: "0.0.0.0",
            proxy: {
                '^/api': {
                    target: 'http://127.0.0.1:3000',
                    changeOrigin: true,
                }
            }
        },
        plugins: [
            vue(),
            DefineOptions(),
            ElementPlus(),
            AutoImport({
                imports: ["vue", "vue-router", "vuex"], // 自动导入vue、vue-router、vuex相关函数
                resolvers: [
                    ElementPlusResolver({
                        importStyle: "sass", // 指示element-plus使用预处理样式
                    }),
                ],
            }),
            Components({
                resolvers: [
                    ElementPlusResolver({
                        importStyle: "sass", // 指示element-plus使用预处理样式
                    }),
                ],
            }),
            viteCompression(),
        ],
        optimizeDeps: {
            include: [
                "element-plus/es",
                "element-plus/es/components/loading/style/index",
                "element-plus/es/components/table/style/index",
                "element-plus/es/components/table-column/style/index",
                "element-plus/es/components/card/style/index",
                "element-plus/es/components/form/style/index",
                "element-plus/es/components/button/style/index",
                "element-plus/es/components/row/style/index",
                "element-plus/es/components/select/style/index",
                "element-plus/es/components/option/style/index",
                "element-plus/es/components/col/style/index",
                "element-plus/es/components/form-item/style/index",
                "element-plus/es/components/input/style/index",
                "element-plus/es/components/pagination/style/index",
                "element-plus/es/components/message-box/style/index",
                "element-plus/es/components/message/style/index",
                "element-plus/es/components/tooltip/style/index",
                "element-plus/es/components/radio-group/style/index",
                "element-plus/es/components/radio/style/index",
                "element-plus/es/components/dialog/style/index",
                "element-plus/es/components/date-picker/style/index",
                "element-plus/es/components/divider/style/index",
                "element-plus/es/components/config-provider/style/index",
                "element-plus/es/components/dropdown/style/index",
                "element-plus/es/components/icon/style/index",
                "element-plus/es/components/scrollbar/style/index",
                "element-plus/es/components/menu/style/index",
                "element-plus/es/components/input-number/style/index",
                "element-plus/es/components/tree-select/style/index",
                "element-plus/es/components/tree/style/index",
                "element-plus/es/components/tabs/style/index",
                "element-plus/es/components/tab-pane/style/index",
            ],
        },
        define: {
            "process.env": loadEnv(mode, process.cwd(), ""),
        },
        resolve: {
            alias: {
                "@": fileURLToPath(new URL("./src", import.meta.url)),
            },
        },
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `$env:${env};`, //scss设置环境变量、自定义elementui class前缀
                },
            },
        },
        envPrefix: "VUE_", //envPrefix 开头的环境变量会通过 import.meta.env 暴露

        build: {
            outDir: "dist",
            assetsDir: "static",
            chunkSizeWarningLimit: 1500,
            rollupOptions: {
                external: ["axios", "lodash"],
                plugins: [commonjs(), globals],
                output: {
                    chunkFileNames: "static/js/[name]-[hash].js",
                    entryFileNames: "static/js/[name]-[hash].js",
                    assetFileNames: "static/[ext]/[name]-[hash].[ext]",
                    manualChunks(id) {
                        if (id.includes("node_modules")) {
                            return id.toString().split("node_modules/")[1].split("/")[0].toString();
                        }
                    },
                },
            },
        },
    };
});
