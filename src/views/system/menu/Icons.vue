<template>
    <el-dialog v-model="isVisible" title="图标" :width="width" top="50px" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-tabs v-model="activeName" style="margin-top: -1rem">
            <el-tab-pane v-for="item in iconsTab" :label="item.label" :name="item.name" :key="item.name">
                <ul>
                    <li v-for="icon in item.icons" :key="icon">
                        <span :class="{ active: activeIndex === icon }">
                            <el-icon :title="icon" :size="28" @click="chooseIcon(icon)">
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
<script setup>
const SystemIcons = [
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
const ArrowIcons = [
    "ArrowLeft",
    "ArrowUp",
    "ArrowRight",
    "ArrowDown",
    "ArrowLeftBold",
    "ArrowUpBold",
    "ArrowRightBold",
    "ArrowDownBold",
    "DArrowRight",
    "DArrowLeft",
    "Download",
    "Upload",
    "Top",
    "Bottom",
    "Back",
    "Right",
    "TopRight",
    "TopLeft",
    "BottomRight",
    "BottomLeft",
    "Sort",
    "SortUp",
    "SortDown",
    "Rank",
    "CaretLeft",
    "CaretTop",
    "CaretRight",
    "CaretBottom",
    "DCaret",
    "Expand",
    "Fold",
];
const DocumentIcons = [
    "DocumentAdd",
    "Document",
    "Notebook",
    "Tickets",
    "Memo",
    "Collection",
    "Postcard",
    "ScaleToOriginal",
    "SetUp",
    "DocumentDelete",
    "DocumentChecked",
    "DataBoard",
    "DataAnalysis",
    "CopyDocument",
    "FolderChecked",
    "Files",
    "Folder",
    "FolderDelete",
    "FolderRemove",
    "FolderOpened",
    "DocumentCopy",
    "DocumentRemove",
    "FolderAdd",
    "FirstAidKit",
    "Reading",
    "DataLine",
    "Management",
    "Checked",
    "Ticket",
    "Failed",
    "TrendCharts",
    "List",
];
const MediaIcons = [
    "Microphone",
    "Mute",
    "Mic",
    "VideoPause",
    "VideoCamera",
    "VideoPlay",
    "Headset",
    "Monitor",
    "Film",
    "Camera",
    "Picture",
    "PictureRounded",
    "Iphone",
    "Cellphone",
    "VideoCameraFilled",
    "PictureFilled",
    "Platform",
    "CameraFilled",
    "BellFilled",
];
const TrafficIcons = [
    "Location",
    "LocationInformation",
    "DeleteLocation",
    "Coordinate",
    "Bicycle",
    "OfficeBuilding",
    "School",
    "Guide",
    "AddLocation",
    "MapLocation",
    "Place",
    "LocationFilled",
    "Van",
];
const FoodIcons = [
    "Watermelon",
    "Pear",
    "NoSmoking",
    "Smoking",
    "Mug",
    "GobletSquareFull",
    "GobletFull",
    "KnifeFork",
    "Sugar",
    "Bowl",
    "MilkTea",
    "Lollipop",
    "Coffee",
    "Chicken",
    "Dish",
    "IceTea",
    "ColdDrink",
    "CoffeeCup",
    "DishDot",
    "IceDrink",
    "IceCream",
    "Dessert",
    "IceCreamSquare",
    "ForkSpoon",
    "IceCreamRound",
    "Food",
    "HotWater",
    "Grape",
    "Fries",
    "Apple",
    "Burger",
    "Goblet",
    "GobletSquare",
    "Orange",
    "Cherry",
];
const ToolIcons = [
    "Printer",
    "Calendar",
    "CreditCard",
    "Box",
    "Money",
    "Refrigerator",
    "Cpu",
    "Football",
    "Brush",
    "Suitcase",
    "SuitcaseLine",
    "Umbrella",
    "AlarmClock",
    "Medal",
    "GoldMedal",
    "Present",
    "Mouse",
    "Watch",
    "QuartzWatch",
    "Magnet",
    "Help",
    "Soccer",
    "ToiletPaper",
    "ReadingLamp",
    "Paperclip",
    "MagicStick",
    "Basketball",
    "Baseball",
    "Coin",
    "Goods",
    "Sell",
    "SoldOut",
    "Key",
    "ShoppingCart",
    "ShoppingCartFull",
    "ShoppingTrolley",
    "Phone",
    "Scissor",
    "Handbag",
    "ShoppingBag",
    "Trophy",
    "TrophyBase",
    "Stopwatch",
    "Timer",
    "CollectionTag",
    "TakeawayBox",
    "PriceTag",
    "Wallet",
    "Opportunity",
    "PhoneFilled",
    "WalletFilled",
    "GoodsFilled",
    "Flag",
    "BrushFilled",
    "Briefcase",
    "Stamp",
];
const WeatherIcons = ["Sunrise", "Sunny", "Ship", "MostlyCloudy", "PartlyCloudy", "Sunset", "Drizzling", "Pouring", "Cloudy", "Moon", "MoonNight", "Lightning"];
const OtherIcons = ["ChromeFilled", "Eleme", "ElemeFilled", "ElementPlus", "Shop", "SwitchFilled", "WindPower"];
const props = defineProps({
    dialogVisible: {
        type: Boolean,
        default: false,
    },
});
const iconsTab = reactive([
    {
        label: "系统类",
        name: "system",
        icons: SystemIcons,
    },
    {
        label: "指向类",
        name: "arrow",
        icons: ArrowIcons,
    },
    {
        label: "文档类",
        name: "document",
        icons: DocumentIcons,
    },
    {
        label: "媒体类",
        name: "media",
        icons: MediaIcons,
    },
    {
        label: "交通类",
        name: "traffic",
        icons: TrafficIcons,
    },
    {
        label: "食品类",
        name: "food",
        icons: FoodIcons,
    },
    {
        label: "工具类",
        name: "tool",
        icons: ToolIcons,
    },
    {
        label: "天气类",
        name: "weather",
        icons: WeatherIcons,
    },
    {
        label: "其他",
        name: "other",
        icons: OtherIcons,
    },
]);
const activeIndex = ref("");
const selectedIcon = ref("");
const activeName = ref("system");
const screenWidth = ref(0);
const initWidth = () => {
    screenWidth.value = document.body.clientWidth;
    if (unref(screenWidth) < 991) {
        return "90%";
    } else if (unref(screenWidth) < 1400) {
        return "60%";
    } else {
        return "800px";
    }
};
const width = ref(initWidth());
const emits = defineEmits(["close", "choose"]);
const close = () => emits("close");
const chooseIcon = (icon) => {
    activeIndex.value = icon;
    selectedIcon.value = icon;
    ElMessage({
        message: "已选择：" + icon,
        type: "success",
    });
};
const confirm = () => {
    if (!unref(selectedIcon)) {
        ElMessage({
            message: "尚未选择任何图标",
            type: "warning",
        });
        return;
    }
    emits("choose", unref(selectedIcon));
    activeName.value = "system";
    selectedIcon.value = activeIndex.value = "";
};
const isVisible = computed({
    get: () => props.dialogVisible,
    set: () => {
        close();
        activeName.value = "system";
        selectedIcon.value = activeIndex.value = "";
    },
});
onMounted(() => {
    window.onresize = () => {
        return (() => {
            width.value = initWidth();
        })();
    };
});
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
