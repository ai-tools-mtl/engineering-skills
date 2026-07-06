<template>
    <!-- 列表页范式:BaseLayout(#search + #content) → CommonSearch + BaseTable -->
    <BaseLayout>
        <template #search>
            <CommonSearch @search="handleSearch" @reset="handleReset">
                <el-form :model="form" label-width="80px">
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="姓名">
                                <el-input v-model="form.name" placeholder="请输入姓名" clearable />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="状态">
                                <el-select v-model="form.status" placeholder="全部" clearable>
                                    <el-option label="启用" value="active" />
                                    <el-option label="停用" value="inactive" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="创建时间">
                                <el-date-picker
                                    v-model="form.dateRange"
                                    type="daterange"
                                    value-format="YYYY-MM-DD"
                                    start-placeholder="开始"
                                    end-placeholder="结束"
                                    style="width: 100%"
                                />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </CommonSearch>
        </template>

        <template #action>
            <div class="flex-x-end">
                <el-button type="primary" @click="handleAdd">新增</el-button>
            </div>
        </template>

        <template #content>
            <BaseTable
                v-model:page-num="pageNum"
                v-model:page-size="pageSize"
                :table-data="tableData"
                :columns-list="columns"
                :total="total"
                @handle-search="fetchData"
            >
                <!-- 状态列:用 tag 展示 -->
                <template #status="{ row }">
                    <el-tag :type="row.status === 'active' ? 'success' : 'info'">
                        {{ row.status === 'active' ? '启用' : '停用' }}
                    </el-tag>
                </template>
                <!-- 操作列:链接按钮 -->
                <template #action="{ row }">
                    <el-button type="primary" link @click="handleView(row)">查看</el-button>
                    <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
                    <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
                </template>
            </BaseTable>
        </template>
    </BaseLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';

/**
 * 标准列表页示例:展示 BaseLayout + CommonSearch + BaseTable 三件套的组装范式。
 * 真实项目里把 fetchData 换成接口调用(http.get),columns 配置按业务列调整。
 */
const form = reactive({ name: '', status: '', dateRange: [] });
const pageNum = ref(1);
const pageSize = ref(10);
const total = ref(0);
const tableData = ref<any[]>([]);

const columns = [
    { label: '姓名', prop: 'name', minWidth: '120' },
    { label: '账号', prop: 'account', minWidth: '140' },
    { label: '角色', prop: 'role', minWidth: '120' },
    { label: '状态', prop: 'status', slotName: 'status', width: '100', align: 'center' },
    { label: '创建时间', prop: 'createdAt', minWidth: '160' },
    { label: '操作', slotName: 'action', width: '180', align: 'center', fixed: 'right' },
];

// 模拟数据(真实项目换成 http.get)
const fetchData = () => {
    const mock = Array.from({ length: pageSize.value }, (_, i) => ({
        name: `用户${(pageNum.value - 1) * pageSize.value + i + 1}`,
        account: `user${(pageNum.value - 1) * pageSize.value + i + 1}`,
        role: i % 2 === 0 ? '管理员' : '运营',
        status: i % 3 === 0 ? 'inactive' : 'active',
        createdAt: '2026-07-04 10:24',
    }));
    tableData.value = mock;
    total.value = 86;
};

const handleSearch = () => {
    pageNum.value = 1;
    fetchData();
    ElMessage.success('查询成功');
};
const handleReset = () => {
    form.name = '';
    form.status = '';
    form.dateRange = [];
    handleSearch();
};
const handleAdd = () => ElMessage.info('新增(示例)');
const handleView = (row: any) => ElMessage.info(`查看:${row.name}`);
const handleEdit = (row: any) => ElMessage.info(`编辑:${row.name}`);
const handleDelete = (row: any) => ElMessage.warning(`删除:${row.name}(示例)`);

onMounted(fetchData);
</script>
