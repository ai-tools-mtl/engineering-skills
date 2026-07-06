# 公共组件清单

`components/portal/` 下的 7 个组件。**新建页面前先查这里:能复用就复用,不要手写表格/卡片/指标。**

类型定义在 `types/portal.ts`,数据工厂 `tag()` / `actions()` 在 `data/ui.ts`。

---

## PageHero — 页面顶部标题区

页面组装公式的**第一块**。浅蓝渐变背景,左侧标题+描述,右侧主/次按钮。

```vue
<PageHero
  title="节点控制"
  description="负责审核、证书和心跳状态管理。"
  action-label="新建"
  secondary-action-label="刷新"
  @action-click="onCreate"
/>
```

| prop | 类型 | 说明 |
|------|------|------|
| `title` | string | 标题(必填) |
| `description` | string | 描述(必填) |
| `actionLabel` | string? | 主按钮文字,不传则不显示按钮区 |
| `secondaryActionLabel` | string? | 次按钮文字 |

事件:`action-click`、`secondary-action-click`

依赖全局 class:`.workbench-hero`、`.workbench-hero-actions`、`.primary`、`.ghost`

---

## MetricCards — 指标卡(四宫格)

组装公式的**第二块**。一行四个指标卡,每个含标签 tag、大数字、描述。

```ts
const metrics = [
  { label: '在线节点', value: '94', desc: '总计 96', tone: 'green' },
  { label: '离线节点', value: '2', desc: '心跳超时', tone: 'red' },
]
```
```vue
<MetricCards :items="metrics" />
```

| prop | 类型 | 说明 |
|------|------|------|
| `items` | `MetricItem[]` | `{ label, value, desc, tone? }`,tone 为 `green/orange/red/purple` |

依赖:`.grid`、`.cols-4`、`.card`、`.stat`、`.tag`(tone)、`.num`

---

## DataTable — 数据表

组装公式的**最后一块**(也是最常用)。封装了 tag/actions 单元格、列对齐、列宽锁定、sticky 表头、斑马纹、加载/空/错误三态、排序指示、行选择、工具栏/分页 slot。

### 最简用法(向后兼容)

```ts
import { actions, tag } from '../data/ui'

const rows = [
  ['dev-001', '开发环境', tag('运行中', 'green'), '2026-07-04', actions('查看', '日志')],
]
```
```vue
<DataTable
  title="环境列表"
  :headers="['ID', '名称', '状态', '时间', '操作']"
  :rows="rows"
  :fixed="true"
  :col-widths="['120px', '1fr', '100px', '160px', '120px']"
  @action-click="onAction"
/>
```

### 规范用法:声明式 columns(推荐)

用 `columns` 声明每列的对齐、宽度、排序能力,比 `headers`+`colWidths` 更清晰。**数字列用 `align: 'right'`**(自动启用等宽数字),状态/分类列用 `align: 'center'`,文本列默认左对齐。

```ts
import type { ColumnConfig } from '../types/portal'

const columns: ColumnConfig[] = [
  { key: 'id', header: 'ID', align: 'left', width: '120px', sortable: true },
  { key: 'name', header: '名称' },                          // 默认左对齐
  { key: 'status', header: '状态', align: 'center', width: '100px' },
  { key: 'count', header: '实例数', align: 'right', sortable: true },  // 数字右对齐
  { key: 'time', header: '更新时间', width: '160px' },
  { key: 'actions', header: '操作', align: 'center', width: '120px' },
]
```
```vue
<DataTable
  title="环境列表"
  :columns="columns"
  :rows="rows"
  :row-keys="rowKeys"
  :fixed="true"
  :striped="true"
  max-body-height="320px"
  @action-click="onAction"
  @sort-change="onSort"
>
  <template #toolbar>…</template>
  <template #footer>…</template>
</DataTable>
```

### Props

| prop | 类型 | 说明 |
|------|------|------|
| `title` | string | 表头标题 |
| `headers` | string[]? | 列标题(老用法;传 `columns` 时忽略) |
| `columns` | `ColumnConfig[]?` | 列描述(新用法,推荐):`{ key, header, align?, width?, sortable? }` |
| `rows` | `TableCell[][]` | 行数据。单元格可以是 string/number,或 `tag()`/`actions()` |
| `rowKeys` | string[]? | 稳定行 key;开启 `selectable` 时必传 |
| `fixed` | boolean? | 锁定列宽(table-layout: fixed),配合 colWidths/columns.width |
| `colWidths` | string[]? | 各列宽度(老用法),长度需与 headers 对齐 |
| `emptyText` | string? | 空数据占位文案,默认"暂无数据" |
| `maxBodyHeight` | string? | 表体最大高度(如 `'320px'`)。传入后开启 **sticky 表头** + 表体滚动 |
| `striped` | boolean? | 斑马纹(偶数行浅底),默认 false |
| `loading` | boolean? | 加载态:显示加载占位 + `aria-busy` |
| `error` | string? | 错误态:非空时显示错误信息行,配合 `#error-action` slot 放重试按钮 |
| `selectable` | boolean? | 开启行选择:首列出现 checkbox |
| `selectedKeys` | string[]? | 选中的行 key(v-model:selectedKeys) |

`ColumnConfig`:`{ key: string; header: string; align?: 'left'|'center'|'right'; width?: string; sortable?: boolean }`

### Slots

| slot | 说明 |
|------|------|
| `toolbar` | 工具栏(搜索框、筛选下拉等) |
| `footer` | 分页区(总条数、分页器) |
| `empty` | 自定义空态内容(不传则用 emptyText) |
| `error-action` | 错误态的重试按钮等操作 |

### 事件

| 事件 | payload | 说明 |
|------|---------|------|
| `action-click` | `{ title, rowIndex, action }` | 点击操作列按钮 |
| `sort-change` | `{ key, order }` | order 为 `'asc'\|'desc'\|null`。**排序逻辑由父组件执行**(因分页/服务端排序在父层),组件只负责 UI 与点击切换(同列 asc→desc→null) |
| `selection-change` | `{ keys }` | 选中行变化(含全选/单选) |

### 排序怎么接

DataTable 不内置排序——它只发事件、显示 ▲▼ 指示,你监听后重新请求/排序数据:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { SortOrder } from '../types/portal'

const sortKey = ref('')
const sortOrder = ref<SortOrder>(null)

async function onSort({ key, order }: { key: string; order: SortOrder }) {
  sortKey.value = order ? key : ''
  sortOrder.value = order
  // 带上排序参数重新拉取: await loadData({ sortKey: key, sortOrder: order })
}
</script>
```

### 分页 footer 标准范式

DataTable 不内置分页逻辑(分页请求契约由业务定),但 `#footer` slot 有标准范式。**推荐包含:总条数 + 每页条数切换 + 上下页/页码**,这样每个列表交互一致。直接抄:

```vue
<template #footer>
  <div class="footer-left">
    <span>共 {{ total }} 条</span>
    <label class="page-size">
      每页
      <select class="input" :value="query.size" @change="onSize(($event.target as HTMLSelectElement).value)">
        <option v-for="s in [10, 20, 50, 100]" :key="s" :value="s">{{ s }}</option>
      </select>
      条
    </label>
  </div>
  <div class="pager">
    <button class="ghost" :disabled="query.page <= 1" @click="goPage(query.page - 1)">上一页</button>
    <span>{{ query.page }} / {{ totalPages }}</span>
    <button class="ghost" :disabled="query.page >= totalPages" @click="goPage(query.page + 1)">下一页</button>
  </div>
</template>
```

配套样式(放页面 `<style scoped>`):

```css
.footer-left { display: flex; align-items: center; gap: 16px; }
.page-size { display: inline-flex; align-items: center; gap: 6px; color: var(--muted); font-size: 13px; }
.page-size .input { width: 64px; min-width: 64px; padding: 4px 6px; }
.pager { display: flex; align-items: center; gap: 8px; }
```

```ts
// 切每页条数:重置到第 1 页再拉数据
function onSize(val: string) {
  query.size = Number(val) || 10
  query.page = 1
  load()
}
```

**智能滚动(可选)**:不传 `max-body-height` 则表体不滚动;若希望「行少不滚、行多才滚」,绑定一个计算属性——行数超阈值才给高度,否则 `undefined`:

```ts
const bodyMaxHeight = computed(() => (tableRows.value.length > 12 ? '520px' : undefined))
```

**何时用 fixed**:操作列内容宽度不一致会导致其余列宽漂移,此时开 `fixed` + columns.width/colWidths。

**何时用 sticky 表头**:行数多、需要滚动浏览时,传 `max-body-height` 让表头固定。

---

## CardGrid — 卡片网格

内容区用。支持 2/3/4 列,`default`(普通卡)/ `feature`(hover 上浮)两种变体。

```ts
const cards = [
  { title: '快速入口', description: '...', badge: tag('推荐', 'green'), meta: ['常用'] },
]
```
```vue
<CardGrid :items="cards" :columns="3" title="常用功能" />
<!-- 或强调可点击的入口卡: -->
<CardGrid :items="entries" :columns="4" variant="feature" />
```

| prop | 类型 | 说明 |
|------|------|------|
| `items` | `CardItem[]` | `{ title, description, badge?, meta?[] }` |
| `columns` | 2\|3\|4 | 列数,默认 3 |
| `title` | string? | 区块标题 |
| `variant` | `'default'\|'feature'` | feature 有 hover 上浮效果 |

---

## TimelineCard — 时间线/步骤

纵向时间线,适合「活动记录」「处理流程」。

```vue
<TimelineCard
  title="近期活动"
  :items="[
    { title: '系统启动', description: '服务就绪' },
    { title: '同步完成', description: '1284 条' },
  ]"
/>
```

| prop | 类型 | 说明 |
|------|------|------|
| `title` | string | 区块标题 |
| `items` | `TimelineItem[]` | `{ title, description }` |

---

## KanbanBoard — 看板

四列泳道,每个 item 可带进度条。

```vue
<KanbanBoard
  title="任务看板"
  :lanes="[
    { title: '待处理', items: [{ title: '任务A', progress: 30 }] },
    { title: '进行中', items: [{ title: '任务B', progress: 70 }] },
  ]"
/>
```

| prop | 类型 | 说明 |
|------|------|------|
| `title` | string? | 区块标题 |
| `lanes` | `KanbanLane[]` | `{ title, items: [{ title, progress? }] }` |

---

## TopNotice — 全局通知(toast)

**不需要直接用组件**(已挂在 `App.vue`)。在业务代码里调用 service:

```ts
import { notifySuccess, notifyError, notifyWarning } from '../services/notify'
notifySuccess('保存成功')
notifyError('提交失败', '网络超时,请重试')
notifyWarning('余额不足', '请先充值')
```

最多同时显示 3 条,自动消失(success 2.4s / warning 3.2s / error 4.5s)。

---

## 单元格工厂(data/ui.ts)

`DataTable` 的 `rows` 里,状态列用 `tag()`,操作列用 `actions()`,时间列用 `formatTime()`:

```ts
import { tag, actions, formatTime } from '../data/ui'

tag('运行中', 'green')      // → { kind:'tag', text:'运行中', tone:'green' }
tag('待审核')               // → 不传 tone,渲染为无色标签
actions('查看', '编辑', '删除')  // → { kind:'actions', items:[...] }
formatTime('2026-07-06T15:16:13.580')  // → '2026-07-06 15:16:13'
formatTime(null)                        // → '—'(默认兜底,可传第二参自定义)
```

DataTable 内部会识别 `kind` 字段,把 tag 渲染成彩色标签,把 actions 渲染成链接按钮组并抛出 `action-click`。`formatTime` 是纯工具函数,返回字符串,用于把后端 ISO 时间规范化为 `YYYY-MM-DD HH:mm:ss` 后塞进时间列。
