# 组件清单(admin-element)

本模板的核心是**列表页三件套**(全局注册,直接用)+ Element Plus 组件库。新页面优先用三件套 + EP 组件拼装。

## 三件套(全局注册,无需 import)

### BaseLayout — 列表页三段式容器

```vue
<BaseLayout :show-left="false">
    <template #left>左侧树/筛选(可选)</template>
    <template #search><CommonSearch>...</CommonSearch></template>
    <template #action><el-button>批量操作</el-button></template>
    <template #content><BaseTable>...</BaseTable></template>
</BaseLayout>
```

| prop | 类型 | 说明 |
|------|------|------|
| `showLeft` | boolean | 是否显示左栏(默认 false)。左栏可折叠 |

slots:`left`(可选,280px 白底)/ `search`(搜索区)/ `action`(批量操作)/ `content`(主体)

### BaseTable — 表格 + 分页

```vue
<BaseTable
    v-model:page-num="pageNum"
    v-model:page-size="pageSize"
    :table-data="tableData"
    :columns-list="columns"
    :total="total"
    @handle-search="fetchData"
>
    <template #status="{ row }"><el-tag>{{ row.status }}</el-tag></template>
    <template #action="{ row }"><el-button link>编辑</el-button></template>
</BaseTable>
```

| prop | 类型 | 说明 |
|------|------|------|
| `tableData` | any[] | 行数据 |
| `columnsList` | ITableCol[] | 列配置(见下) |
| `total` | number | 总条数(分页用) |
| `showPagination` | boolean | 显示分页(默认 true) |
| `showSelection` | boolean | 多选列(默认 false) |
| `showIndex` | boolean | 序号列(默认 true) |
| `rowKey` | string | 行 key(reserve-selection 时需传) |
| `showColumnSetting` | boolean | 列配置弹层(默认 false) |

v-model:`page-num`、`page-size`(双向绑定)。事件:`handle-search`(翻页/改 pageSize 时触发,重新拉数据)。

**列配置(ITableCol)**:
```ts
{ label: '姓名', prop: 'name', minWidth: '120', align: 'center',
  slotName: 'name',      // 自定义单元格 slot 名(不传则显示 prop 值,空值显示 '-')
  headSlotName: 'nameHead', // 自定义表头 slot
  fixed: 'right', itemAttr: {...} } // itemAttr 透传给 el-table-column 的属性
```

默认空值显示 `-`;空数据显示"暂无数据"(可 #empty 覆盖)。表头/行样式由全局 `.custom-header-class`/`.custom-row-class` 控制。

### CommonSearch — 可展开搜索区

```vue
<CommonSearch @search="..." @reset="..." :show-export="true" @export-table="...">
    <el-form :model="form" label-width="80px">
        <el-row :gutter="20">
            <el-col :span="8"><el-form-item label="名称"><el-input v-model="form.name"/></el-form-item></el-col>
        </el-row>
    </el-form>
</CommonSearch>
```

| prop | 类型 | 说明 |
|------|------|------|
| `isWarp` | boolean | 换行布局(默认 false) |
| `showExport` | boolean | 显示导出按钮(默认 false) |
| `defaultExpanded` | boolean | 默认展开(默认 false,只显示一行) |

事件:`search`、`reset`、`exportTable`。slot 内放 el-form,超出 50px 自动出现"展开/收起"。按钮自带 loading 防抖。

## 其他封装组件

### InfoTitle — 详情页小节标题

```vue
<InfoTitle title="基本信息" icon-name="common-info" :size="20" />
```

| prop | 类型 | 说明 |
|------|------|------|
| `title` | string | 标题文字 |
| `iconName` | string | svg 图标名(对应 src/assets/svg-icon/) |
| `size` | number | 图标尺寸(默认 20) |

### SvgIcon — 图标(全局注册)

```vue
<svg-icon name="common-demo" :size="18" />           <!-- 本地 svg -->
<svg-icon name="ArrowDown" :local-icon="false" />    <!-- EP 图标 -->
```

| prop | 类型 | 说明 |
|------|------|------|
| `name` | string | 图标名。localIcon=true 时对应 src/assets/svg-icon/ 文件;false 时对应 @element-plus/icons-vue 组件名 |
| `localIcon` | boolean | true=本地 svg(默认),false=EP 图标 |
| `size` | number | 尺寸(默认 18) |

## Element Plus 组件

按需自动导入(vite.config.ts 配 ElementPlusResolver),**直接用,无需 import**。常用:

- `el-table` / `el-table-column`(但列表页用 BaseTable 封装,别手写)
- `el-form` / `el-form-item` / `el-input` / `el-select` / `el-date-picker`
- `el-button`(`type="primary" link` 是表格操作列惯例)
- `el-dialog`(详情/编辑弹窗,加 `class="my-dialog"` 用蓝渐变底)
- `el-tag` / `el-radio` / `el-checkbox` / `el-switch`
- `el-pagination`(BaseTable 已封装,别手写)
- `el-menu` / `el-sub-menu` / `el-menu-item`(customMenu 已封装)
- `el-breadcrumb`(menuPageLayout 已封装)
- `el-dropdown`(innerHeader 已封装)
- `el-message` / `el-message-box` / `el-notification`(需手动 import,非组件)
- `el-result`(errPage 用)

## 全局通用 class(common.scss)

| class | 用途 |
|-------|------|
| `.common-info-title` | 区块标题(左 2px 主色竖条 + 16px/600) |
| `.custom-header-class` / `.custom-row-class` | 表头/行样式(BaseTable 内部已用) |
| `.mt0` ~ `.mt40` | 上边距 0/4/8...40 |
| `.ellipsis` | 单行省略 |
| `.flex-btn-box` / `.btn-center` / `.btn-end` | 按钮容器 |
| `.border-normal` | 4px 圆角 |
| `.single-column-form` | 表单控件限宽 480 |
| `.card-title` | 蓝渐变大标题文字 |

## UnoCSS shortcuts(原子类)

`flex-center`、`flex-y-center`、`flex-x-between`、`flex-x-end`、`wh-full`、`ellipse-text`、`absolute-lt/rt/center`、`fixed-lt`。其余按 Tailwind 语法(`w-100px`、`text-14px`、`bg-#fff`、`flex`、`items-center` ...)。

> 注意:业务列表页正文**少用原子类**,靠三件套 + scoped scss;原子类主要用在布局壳和零散工具场景。
