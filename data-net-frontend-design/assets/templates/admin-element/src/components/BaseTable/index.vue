<template>
    <div class="base-table">
        <el-popover v-if="showColumnSetting" placement="bottom" :width="400" trigger="click">
            <template #reference>
                <el-button style="margin-bottom: 12px">列配置</el-button>
            </template>
            <template #default>
                <div class="columns-setting">
                    <el-checkbox
                        v-for="item in props.columnsList"
                        :key="item.label"
                        :checked="item.hidden !== 0"
                        :label="item.label"
                        :false-value="0"
                        @change="(val) => (item.hidden = val)"
                    />
                </div>
            </template>
        </el-popover>

        <el-table
            v-bind="attrs"
            ref="tableRef"
            tooltip-effect="light"
            :data="props.tableData"
            :row-key="props.rowKey"
            row-class-name="custom-row-class"
            header-row-class-name="custom-header-class"
            :header-row-style="{ fontWeight: 400 }"
            @selection-change="handleSelectionChange"
        >
            <template #empty>
                <slot name="empty">
                    <div class="empty-data">暂无数据</div>
                </slot>
            </template>
            <el-table-column
                v-if="showSelection"
                type="selection"
                :selectable="selectable"
                :reserve-selection="reserveSelection"
                width="40"
            ></el-table-column>
            <el-table-column
                v-if="showIndex"
                type="index"
                label="序号"
                align="center"
                width="80"
            ></el-table-column>
            <template v-for="(column, index) in props.columnsList" :key="column.prop || index">
                <template v-if="column.hidden !== 0">
                    <el-table-column
                        v-bind="Object.assign(column, { ...defaultConfig, ...column.itemAttr })"
                    >
                        <template #header>
                            <slot :name="column.headSlotName">{{ column.label }}</slot>
                        </template>
                        <template #default="scope">
                            <slot :name="column.slotName" :row="scope.row" :index="scope.$index">
                                {{
                                    column.prop &&
                                    scope.row[column.prop] !== undefined &&
                                    scope.row[column.prop] !== null &&
                                    scope.row[column.prop] !== ''
                                        ? scope.row[column.prop]
                                        : '-'
                                }}
                            </slot>
                        </template>
                    </el-table-column>
                </template>
            </template>
        </el-table>

        <div v-if="props.showPagination" class="base-table-pagination">
            <el-pagination
                v-model:current-page="pageNum"
                v-model:page-size="pageSize"
                style="width: 100%"
                :page-sizes="[10, 20, 50, 100]"
                :layout="pageLayout"
                :total="total"
                @change="handlePageChange"
            >
                <template #default>
                    <span style="color: #606266; margin-right: auto">
                        共{{ total }}条记录 第{{ total ? pageNum : 0 }}/{{
                            Math.ceil(total / pageSize)
                        }}页
                    </span>
                </template>
            </el-pagination>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAttrs, ref, computed } from 'vue';

/**
 * 表格 + 分页封装(全局注册,直接用 <BaseTable>)。
 * 列用 columnsList 配置(label/prop/minWidth/align/slotName/headSlotName/fixed);
 * 自定义单元格用 #<slotName>="{ row }"。
 * 分页用 v-model:page-num / v-model:page-size 双向绑定,翻页抛 @handleSearch。
 */
interface Props {
    tableData: any[] | undefined;
    columnsList: any[];
    total?: number | string;
    showPagination?: boolean;
    pageLayout?: string;
    showColumnSetting?: boolean;
    showSelection?: boolean;
    showIndex?: boolean;
    selectOne?: boolean;
    selectable?: (row: any, index: number) => boolean;
    rowKey?: string;
    reserveSelection?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    showPagination: true,
    pageLayout: 'slot, sizes, prev, pager, next, jumper',
    showColumnSetting: false,
    showSelection: false,
    showIndex: true,
    selectOne: false,
});

const total = computed(() => Number(props.total) || 0);
const defaultConfig = { 'show-overflow-tooltip': true };
const attrs = useAttrs();

const tableRef = ref(null);
const handleSelectionChange = (val) => {
    if (props.selectOne && val.length > 1) {
        tableRef.value.clearSelection();
        tableRef.value.toggleRowSelection(val.pop());
    }
};
defineExpose({ tableRef });

const emits = defineEmits<{ handleSearch: [init?: boolean] }>();
const handlePageChange = () => {
    emits('handleSearch');
};

const pageNum = defineModel('pageNum', { type: Number, default: 1 });
const pageSize = defineModel('pageSize', { type: Number, default: 10 });
</script>

<style lang="scss">
.el-table thead th {
    font-weight: 400 !important;
}
</style>

<style lang="scss" scoped>
.base-table {
    overflow: auto;
    display: flex;
    flex-direction: column;
}
.base-table-pagination {
    padding: 16px 0;
    display: flex;
    justify-content: flex-end;
}
.columns-setting {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
}
</style>
