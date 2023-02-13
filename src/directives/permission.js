/*
 * @Author: xunxiao
 * @Date: 2023-02-13 14:25:05
 * @LastEditors: xunxiao
 * @LastEditTime: 2023-02-13 15:34:00
 * @Description: 权限有关的指令
 */
// 必须包含列出的所有权限，元素才显示
import store from "@/store/index";
export const hasPermission = {
    install(Vue) {
        Vue.directive("hasPermission", {
            mounted(el, binding, vnode) {
                try {
                    const permissions = store.state.account.permissions;
                    const value = binding.value;
                    let flag = true;
                    for (const v of value) {
                        if (!permissions.includes(v)) {
                            flag = false;
                        }
                    }
                    if (!flag) {
                        if (!el.parentNode) {
                            el.style.display = "none";
                        } else {
                            el.parentNode.removeChild(el);
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
            },
        });
    },
};

// 当不包含列出的权限时，渲染该元素
export const hasNoPermission = {
    install(Vue) {
        Vue.directive("hasNoPermission", {
            mounted(el, binding, vnode) {
                const permissions = store.state.account.permissions;
                const value = binding.value;
                let flag = true;
                for (const v of value) {
                    if (permissions.includes(v)) {
                        flag = false;
                    }
                }
                if (!flag) {
                    if (!el.parentNode) {
                        el.style.display = "none";
                    } else {
                        el.parentNode.removeChild(el);
                    }
                }
            },
        });
    },
};

// 只要包含列出的任意一个权限，元素就会显示
export const hasAnyPermission = {
    install(Vue) {
        Vue.directive("hasAnyPermission", {
            mounted(el, binding, vnode) {
                const permissions = store.state.account.permissions;
                const value = binding.value;
                let flag = false;
                for (const v of value) {
                    if (permissions.includes(v)) {
                        flag = true;
                    }
                }
                if (!flag) {
                    if (!el.parentNode) {
                        el.style.display = "none";
                    } else {
                        el.parentNode.removeChild(el);
                    }
                }
            },
        });
    },
};
