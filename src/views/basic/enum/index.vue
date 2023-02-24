<template>
    <div class="basic-enum-page">
        <el-row :gutter="10">
            <el-col :xs="24" :sm="14">
                <div class="app-container">
                    <div class="filter-container">
                        <el-input v-model="searchForm.roleName" placeholder="枚举类型名称" class="filter-item search-item" />
                        <el-button class="filter-item" type="primary" plain @click="search">搜索</el-button>
                        <el-button class="filter-item" type="warning" plain @click="reset">重置</el-button>
                        <el-dropdown v-has-any-permission="['enumType:create', 'enumType:delete']" trigger="click" class="filter-item">
                            <el-button>
                                更多操作
                                <el-icon class="el-icon--right"><arrow-down /></el-icon>
                            </el-button>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <div v-has-permission="['enumType:create']">
                                        <el-dropdown-item @click="add">新增</el-dropdown-item>
                                    </div>
                                    <div v-has-permission="['enumType:delete']">
                                        <el-dropdown-item @click="batchDelete">删除</el-dropdown-item>
                                    </div>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </div>
                    <div class="center-container">
                        <el-table
                            ref="tableRef"
                            v-loading="tableLoading"
                            :data="tableData"
                            :max-height="tableHeight"
                            border
                            fit
                            style="width: 100%"
                            :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
                            @selection-change="onSelectChange"
                            highlight-current-row
                            @row-click="onRowClick"
                        >
                            <el-table-column type="selection" align="center" width="40px" />
                            <el-table-column label="类型编码" prop="typeCode" :show-overflow-tooltip="true" align="center"> </el-table-column>
                            <el-table-column label="类型名称" prop="typeName" :show-overflow-tooltip="true" align="center"> </el-table-column>
                            <el-table-column label="类型描述" prop="remark" :show-overflow-tooltip="true" align="center" min-width="120"> </el-table-column>
                            <el-table-column label="创建时间" prop="createTime" :show-overflow-tooltip="true" align="center" min-width="160"> </el-table-column>
                            <el-table-column label="操作" align="center" width="100" class-name="small-padding fixed-width" fixed="right">
                                <template #default="{ row }">
                                    <el-icon v-has-permission="['enumType:update']" class="table-operation" style="color: #2db7f5" @click="edit(row)"><Setting /></el-icon>
                                    <el-icon v-has-permission="['enumType:delete']" class="table-operation" style="color: #f50" @click="singleDelete(row)"><Delete /></el-icon>
                                    <el-link v-has-no-permission="['enumType:update', 'enumType:delete']" class="no-perm">无权限</el-link>
                                </template>
                            </el-table-column>
                        </el-table>
                        <pagination
                            v-show="pagination.total > 0"
                            :total="pagination.total"
                            v-model:page="pagination.pageNum"
                            v-model:limit="pagination.pageSize"
                            @pagination="paginationChange"
                        />
                    </div>
                </div>
            </el-col>
            <el-col :xs="24" :sm="10">
                <el-card shadow="never" class="box-card">
                    <template #header>
                        <div class="card-header flex items-center justify-between">
                            <span class="font-semibold">枚举字典</span>
                            <el-button v-has-permission="['enum:create']" v-if="currentEnumType" class="filter-item" type="primary" plain @click="onEnumDictAdd"
                                >新增字典</el-button
                            >
                        </div>
                    </template>
                    <el-table
                        ref="enumDictTableRef"
                        v-loading="enumDictTableLoading"
                        :data="enumDictTableData"
                        :max-height="tableHeight"
                        border
                        fit
                        style="width: 100%"
                        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
                        @selection-change="onEnumDictSelectChange"
                    >
                        <el-table-column type="selection" align="center" width="40px" />
                        <el-table-column label="枚举编码" prop="enumCode" :show-overflow-tooltip="true" align="center"> </el-table-column>
                        <el-table-column label="枚举名称" prop="enumName" :show-overflow-tooltip="true" align="center"> </el-table-column>
                        <el-table-column label="速记码" prop="shorthandCode" :show-overflow-tooltip="true" align="center" min-width="120"> </el-table-column>
                        <el-table-column label="操作" align="center" width="100" class-name="small-padding fixed-width" fixed="right">
                            <template #default="{ row }">
                                <el-icon v-has-permission="['enum:update']" class="table-operation" style="color: #2db7f5" @click="onEnumDictEdit(row)"><Setting /></el-icon>
                                <el-icon v-has-permission="['enum:delete']" class="table-operation" style="color: #f50" @click="enumDictSingleDelete(row)"><Delete /></el-icon>
                                <el-link v-has-no-permission="['enum:update', 'enum:delete']" class="no-perm">无权限</el-link>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
        </el-row>
        <enum-type-edit ref="editRef" :dialog-visible="editDialog.isVisible" :title="editDialog.title" @success="editSuccess" @close="editClose" />
        <enum-dict-edit
            ref="enumDictEditRef"
            :dialog-visible="enumDictEditDialog.isVisible"
            :title="enumDictEditDialog.title"
            @success="enumDictEditSuccess"
            @close="enumDictEditDialog.isVisible = false"
        />
    </div>
</template>
<script setup>
import Pagination from "@/components/Pagination/index.vue";
import usePage from "@/composables/usePage";
import EnumTypeEdit from "./EnumTypeEdit.vue";
import EnumDictEdit from "./EnumDictEdit.vue";
import api from "@/api";
import { unref } from "vue";

//table高度
const tableHeight = inject("tableHeight");
const searchForm = reactive({});

//删除前置数据处理，用户校验
const deleteFrontFn = () => {
    return new Promise((resolve) => {
        const roleIds = unref(selection).map((v) => v.typeId);
        resolve(roleIds);
    });
};

// 接收 查询参数、获取列表的接口 返回 列表所需要的数据、分页参数、分页函数等
const {
    tableRef,
    tableData,
    tableLoading,
    search,
    reset,
    pagination,
    paginationChange,
    fetchData,
    selection,
    onSelectChange,
    singleDelete,
    batchDelete,
    editRef,
    editDialog,
    add,
    edit,
    editClose,
    editSuccess,
} = usePage({
    searchForm,
    searchFunc: () => resetEnumDict(),
    resetFunc: () => resetEnumDict(),
    getListApi: api.basic_enumType_list,
    deleteApi: api.basic_enumType_delete,
    deleteFrontFn,
});

//重置枚举字典数据
const resetEnumDict = () => {
    currentEnumType.value = null;
    enumDictTableData.value = [];
};

//点击某行枚举类型
const onRowClick = (row) => {
    currentEnumType.value = row;
    getEnumDictData();
};

const currentEnumType = ref(null); //当前选中枚举类型
const enumDictTableData = ref([]);
const enumDictTableLoading = ref(false);
const enumSelection = ref([]); //字典列表选中项
const enumDictEditRef = ref(null);
const enumDictTableRef = ref(null);
//新增/修改弹窗
const enumDictEditDialog = reactive({
    isVisible: false,
    title: "",
});
//获取字典列表
const getEnumDictData = () => {
    enumDictTableLoading.value = true;
    api.basic_enum_allByType({ typeId: unref(currentEnumType).typeId })
        .then(({ code, data }) => {
            if (code == 200) {
                enumDictTableData.value = data || [];
            }
            enumDictTableLoading.value = false;
        })
        .catch((error) => {
            console.log(error);
            enumDictTableLoading.value = false;
        });
};
const onEnumDictAdd = () => {
    unref(enumDictEditRef).setFormData({
        typeId: unref(currentEnumType).typeId,
        typeName: unref(currentEnumType).typeName,
        typeCode: unref(currentEnumType).typCoded,
    });
    enumDictEditDialog.title = "新增";
    enumDictEditDialog.isVisible = true;
};
const onEnumDictEdit = (row) => {
    unref(enumDictEditRef).setFormData(row);
    enumDictEditDialog.title = "修改";
    enumDictEditDialog.isVisible = true;
};
const enumDictEditSuccess = () => getEnumDictData();

const onEnumDictSelectChange = (selects) => {
    enumSelection.value = selects;
};
const clearEnumDictSelections = () => {
    unref(enumDictTableRef).clearSelection();
};

const enumDictSingleDelete = (row) => {
    unref(enumDictTableRef).clearSelection();
    unref(enumDictTableRef).toggleRowSelection(row, true);
    enumDictBatchDelete();
};
const enumDictBatchDelete = async () => {
    if (!unref(enumSelection).length) {
        ElMessage({
            message: "请先选择需要操作的数据",
            type: "warning",
        });
        return;
    }
    ElMessageBox.confirm("选中数据将被永久删除, 是否继续？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
    })
        .then(() => {
            const deleteIds = unref(enumSelection).map((v) => v.enumId);
            enumDictDeleteSubmit(deleteIds);
        })
        .catch(() => {
            clearEnumDictSelections();
        });
};
const enumDictDeleteSubmit = (deleteIds) => {
    api.basic_enum_delete(deleteIds).then(({ code }) => {
        if (code == 200) {
            ElMessage({
                message: "删除成功",
                type: "success",
            });
            getEnumDictData();
        }
    });
};
</script>
<style lang="scss" scoped>
.basic-enum-page {
    margin: 10px;
    .app-container {
        margin: 0 0 10px 0 !important;
    }
}
.box-card {
    border-radius: 0;
    border: none;
    .card-header {
        height: 32px;
    }
}
</style>
