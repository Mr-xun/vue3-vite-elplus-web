<template>
    <el-dialog v-model="isVisible" title="图标" :width="width" top="50px" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-tabs v-model="activeName" style="margin-top: -1rem">
            <el-tab-pane label="系统" name="first">
                <ul>
                    <li v-for="icon in icons.systemIcons" :key="icon">
                        <span :class="{ active: activeIndex === icon }">
                            <el-icon :title="icon" @click="chooseIcon(icon)">
                                <component :is="icon"></component>
                            </el-icon>
                        </span>
                    </li>
                </ul>
            </el-tab-pane>
            <el-tab-pane label="指向性" name="second">
                <ul>
                    <li v-for="icon in icons.directivityIcons" :key="icon">
                        <span :class="{ active: activeIndex === icon }">
                            <el-icon :title="icon" @click="chooseIcon(icon)">
                                <component :is="icon"></component>
                            </el-icon>
                        </span>
                    </li>
                </ul>
            </el-tab-pane>
            <el-tab-pane label="填充类" name="third">
                <ul>
                    <li v-for="icon in icons.solidIcons" :key="icon">
                        <span :class="{ active: activeIndex === icon }">
                            <el-icon :title="icon" @click="chooseIcon(icon)">
                                <component :is="icon"></component>
                            </el-icon>
                        </span>
                    </li>
                </ul>
            </el-tab-pane>
            <el-tab-pane label="食品类" name="fourth">
                <ul>
                    <li v-for="icon in icons.foodIcons" :key="icon">
                        <span :class="{ active: activeIndex === icon }">
                            <el-icon :title="icon" @click="chooseIcon(icon)">
                                <component :is="icon"></component>
                            </el-icon>
                        </span>
                    </li>
                </ul>
            </el-tab-pane>
        </el-tabs>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="warning" plain @click="isVisible = false"> 取消 </el-button>
                <el-button type="primary" plain @click="confirm"> 确定 </el-button>
            </div>
        </template>
    </el-dialog>
</template>
<script>
const systemIcons = [
    "Plus",
    "Minus",
    "CirclePlus",
    "Search",
    "Female",
    "Male",
    "Aim",
    "House",
    "FullScreen",
    "Loading",
    "Link",
    "Service",
    "Pointer",
    "Star",
    "Notification",
    "Connection",
    "ChatDotRound",
    "Setting",
    "Clock",
    "Position",
    "Discount",
    "Odometer",
    "ChatSquare",
    "ChatRound",
    "ChatLineRound",
    "ChatLineSquare",
    "ChatDotSquare",
    "View",
    "Hide",
    "Unlock",
    "Lock",
    "RefreshRight",
    "RefreshLeft",
    "Refresh",
    "Bell",
    "MuteNotification",
    "User",
    "Check",
    "CircleCheck",
    "Warning",
    "CircleClose",
    "Close",
    "PieChart",
    "More",
    "Compass",
    "Filter",
    "Switch",
    "Select",
    "SemiSelect",
    "CloseBold",
    "EditPen",
    "Edit",
    "Message",
    "MessageBox",
    "TurnOff",
    "Finished",
    "Delete",
    "Crop",
    "SwitchButton",
    "Operation",
    "Open",
    "Remove",
    "ZoomOut",
    "ZoomIn",
    "InfoFilled",
    "CircleCheckFilled",
    "SuccessFilled",
    "WarningFilled",
    "CircleCloseFilled",
    "QuestionFilled",
    "WarnTriangleFilled",
    "UserFilled",
    "MoreFilled",
    "Tools",
    "HomeFilled",
    "Menu",
    "UploadFilled",
    "Avatar",
    "HelpFilled",
    "Share",
    "StarFilled",
    "Comment",
    "Histogram",
    "Grid",
    "Promotion",
    "DeleteFilled",
    "RemoveFilled",
    "CirclePlusFilled",
];
const directivityIcons = [
    "el-icon-d-caret",
    "el-icon-caret-left",
    "el-icon-caret-right",
    "el-icon-caret-bottom",
    "el-icon-caret-top",
    "el-icon-bottom-left",
    "el-icon-bottom-right",
    "el-icon-back",
    "el-icon-right",
    "el-icon-bottom",
    "el-icon-top",
    "el-icon-top-left",
    "el-icon-top-right",
    "el-icon-arrow-left",
    "el-icon-arrow-right",
    "el-icon-arrow-down",
    "el-icon-arrow-up",
    "el-icon-d-arrow-left",
    "el-icon-d-arrow-right",
    "el-icon-sort",
    "el-icon-sort-up",
    "el-icon-sort-down",
    "el-icon-rank",
];
const solidIcons = [
    "el-icon-question",
    "el-icon-info",
    "el-icon-remove",
    "el-icon-circle-plus",
    "el-icon-success",
    "el-icon-error",
    "el-icon-platform-eleme",
    "el-icon-delete-solid",
    "el-icon-s-tools",
    "el-icon-user-solid",
    "el-icon-phone",
    "el-icon-star-on",
    "el-icon-s-goods",
    "el-icon-warning",
    "el-icon-s-help",
    "el-icon-picture",
    "el-icon-upload",
    "el-icon-camera-solid",
    "el-icon-video-camera-solid",
    "el-icon-message-solid",
    "el-icon-s-cooperation",
    "el-icon-s-order",
    "el-icon-s-platform",
    "el-icon-s-fold",
    "el-icon-s-unfold",
    "el-icon-s-operation",
    "el-icon-s-promotion",
    "el-icon-s-home",
    "el-icon-s-release",
    "el-icon-s-ticket",
    "el-icon-s-management",
    "el-icon-s-open",
    "el-icon-s-shop",
    "el-icon-s-marketing",
    "el-icon-s-flag",
    "el-icon-s-comment",
    "el-icon-s-finance",
    "el-icon-s-claim",
    "el-icon-s-custom",
    "el-icon-s-opportunity",
    "el-icon-s-data",
    "el-icon-s-check",
    "el-icon-s-grid",
    "el-icon-menu",
    "el-icon-share",
    "el-icon-d-caret",
    "el-icon-caret-left",
    "el-icon-caret-right",
    "el-icon-caret-bottom",
    "el-icon-caret-top",
    "el-icon-location",
];
const foodIcons = [
    "el-icon-dish",
    "el-icon-dish-1",
    "el-icon-food",
    "el-icon-chicken",
    "el-icon-fork-spoon",
    "el-icon-knife-fork",
    "el-icon-burger",
    "el-icon-tableware",
    "el-icon-sugar",
    "el-icon-dessert",
    "el-icon-ice-cream",
    "el-icon-hot-water",
    "el-icon-water-cup",
    "el-icon-coffee-cup",
    "el-icon-cold-drink",
    "el-icon-goblet",
    "el-icon-goblet-full",
    "el-icon-goblet-square",
    "el-icon-goblet-square-full",
    "el-icon-refrigerator",
    "el-icon-grape",
    "el-icon-watermelon",
    "el-icon-cherry",
    "el-icon-apple",
    "el-icon-pear",
    "el-icon-orange",
    "el-icon-coffee",
    "el-icon-ice-tea",
    "el-icon-ice-drink",
    "el-icon-milk-tea",
    "el-icon-potato-strips",
    "el-icon-lollipop",
    "el-icon-ice-cream-square",
    "el-icon-ice-cream-round",
];
export default {
    name: "Icons",
    props: {
        dialogVisible: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            icons: {
                systemIcons,
                directivityIcons,
                solidIcons,
                foodIcons,
            },
            activeIndex: "",
            choosedIcon: "",
            activeName: "first",
            screenWidth: 0,
            width: this.initWidth(),
        };
    },
    computed: {
        isVisible: {
            get() {
                console.log(this.dialogVisible);
                return this.dialogVisible;
            },
            set() {
                this.close();
            },
        },
    },
    mounted() {
        window.onresize = () => {
            return (() => {
                this.width = this.initWidth();
            })();
        };
    },
    methods: {
        initWidth() {
            this.screenWidth = document.body.clientWidth;
            if (this.screenWidth < 991) {
                return "90%";
            } else if (this.screenWidth < 1400) {
                return "60%";
            } else {
                return "800px";
            }
        },
        close() {
            this.$emit("close");
            this.activeName = "first";
            this.choosedIcon = this.activeIndex = "";
        },
        chooseIcon(icon) {
            this.activeIndex = icon;
            this.choosedIcon = icon;
            ElMessage({
                message: "已选择：" + icon,
                type: "success",
            });
        },
        confirm() {
            if (!this.choosedIcon) {
                ElMessage({
                    message: "尚未选择任何图标",
                    type: "warning",
                });
                return;
            }
            this.$emit("choose", this.choosedIcon);
            this.activeName = "first";
            this.choosedIcon = this.activeIndex = "";
        },
    },
};
</script>
<style lang="scss" scoped>
ul {
    overflow-y: auto;
    padding-left: 0.5rem;
    margin-top: -0.8rem;
    span.active {
        i {
            border-radius: 2px;
            border-color: #4a4a48;
            background-color: #4a4a48;
            color: #fff;
            transition: all 0.3s;
        }
    }
    i {
        font-size: 1.5rem;
        border: 1px solid #f1f1f1;
        padding: 0.2rem;
        margin: 0.3rem;
        cursor: pointer;
        &:hover {
            border-radius: 2px;
            border-color: #4a4a48;
            background-color: #4a4a48;
            color: #fff;
            transition: all 0.3s;
        }
    }
    li {
        list-style: none;
        float: left;
        width: 40px;
        text-align: center;
        cursor: pointer;
        color: #555;
        transition: color 0.3s ease-in-out, background-color 0.3s ease-in-out;
        position: relative;
        margin: 3px 0;
        border-radius: 4px;
        background-color: #fff;
        overflow: hidden;
        padding: 10px 0 0;
    }
}
</style>
