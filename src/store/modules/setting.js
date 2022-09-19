/*
 * @Author: xunxiao
 * @Date: 2022-09-19 08:24:40
 * @LastEditors: xunxiao
 * @LastEditTime: 2022-09-19 18:02:50
 * @Description: settings
 */
import defaultSettings from "@/utils/settings";
import db from "@/utils/localstorage";
const { fixedHeader, sidebarLogo } = defaultSettings;

const state = {
    fixedHeader: fixedHeader,
    sidebarLogo: sidebarLogo,
    settingBar: {
        opened: false,
    },
    sidebar: {
        opened: db.get("SIDEBAR_STATUS", true),
        withoutAnimation: false,
    },
    device: "desktop",
    sidebarLogo: db.get("SIDEBAR_LOGO", true),
    multipage: db.get("MULTIPAGE", false),
    fixSiderbar: db.get("FIX_SIDERBAR", true),
    fixHeader: db.get("FIX_HEADER", true),
    colorList: ["rgb(245, 34, 45)", "rgb(250, 84, 28)", "rgb(250, 173, 20)", "rgb(66, 185, 131)", "rgb(82, 196, 26)", "rgb(24, 144, 255)", "rgb(47, 84, 235)", "rgb(114, 46, 209)"],
    color: db.get("COLOR", "rgb(24, 144, 255)"),
    theme: "#1890FF",
    tableHeight: 0,
};

const mutations = {
    CHANGE_SETTING: (state, { key, value }) => {
        if (state.hasOwnProperty(key)) {
            state[key] = value;
        }
    },
    toggleSidebar: (state) => {
        state.sidebar.opened = !state.sidebar.opened;
        state.sidebar.withoutAnimation = false;
        if (state.sidebar.opened) {
            db.save("SIDEBAR_STATUS", 1);
        } else {
            db.save("SIDEBAR_STATUS", 0);
        }
    },
    closeSidebar: (state, withoutAnimation) => {
        db.save("SIDEBAR_STATUS", 0);
        state.sidebar.opened = false;
        state.sidebar.withoutAnimation = withoutAnimation;
    },
    openSettingBar(state, val) {
        state.settingBar.opened = val;
    },
    setMultipage(state, multipage) {
        db.save("MULTIPAGE", multipage);
        state.multipage = multipage;
    },
    fixSiderbar(state, val) {
        db.save("FIX_SIDERBAR", val);
        state.fixSiderbar = val;
    },
    fixHeader(state, val) {
        db.save("FIX_HEADER", val);
        state.fixHeader = val;
    },
    setSettingBar(state, val) {
        state.settingBar.opened = val;
    },
    setColor(state, color) {
        db.save("COLOR", color);
        state.color = color;
    },
    setLanguage: (state, language) => {
        db.save("LANGUAGE", language);
        state.language = language;
    },
    toggleDevice: (state, device) => {
        state.device = device;
    },
    setSidebarLogo(state, val) {
        db.save("SIDEBAR_LOGO", val);
        state.sidebarLogo = val;
    },
    setTheme(state, val) {
        state.theme = val;
    },
    setTableHeight(state, val) {
        state.tableHeight = val;
    },
};

const actions = {
    changeSetting({ commit }, data) {
        commit("CHANGE_SETTING", data);
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
};
