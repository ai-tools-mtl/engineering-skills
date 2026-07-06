<script setup lang="ts">
import { computed, useSlots } from 'vue'
import type {
  ActionData,
  ColumnConfig,
  SortOrder,
  TableCell,
  TagData,
} from '../../types/portal'

const slots = useSlots()

const props = defineProps<{
  /** 表格标题(显示在表头栏) */
  title: string
  /**
   * 列标题(老用法)。传了 columns 时以 columns 为准,headers 会被忽略。
   * 二者至少传其一。
   */
  headers?: string[]
  /** 数据行:每行是一个单元格数组 */
  rows: TableCell[][]
  /** 稳定行 key(分页时建议传,如实体 id);开启 selectable 时必传 */
  rowKeys?: string[]
  /**
   * 是否锁定列宽(table-layout: fixed)。
   * 开启后列宽由 colWidths / columns.width / 默认比例决定,不随内容漂移。
   */
  fixed?: boolean
  /** 老用法:各列宽度(CSS 长度),长度需与 headers 对齐。 */
  colWidths?: string[]
  /** 新用法:列描述数组,声明对齐/宽度/排序。优先级高于 headers + colWidths */
  columns?: ColumnConfig[]
  /** 空数据时的占位文案 */
  emptyText?: string

  /* —— 视觉增强(均可选,默认不影响现有行为) —— */

  /** 表体最大高度(CSS 长度,如 '320px')。传入后开启 sticky 表头 + 表体滚动 */
  maxBodyHeight?: string
  /** 斑马纹(偶数行浅底)。默认 false,维持纯 hover 高亮 */
  striped?: boolean

  /* —— 状态态 —— */

  /** 加载中:为 true 时表体显示加载占位,表格置 aria-busy */
  loading?: boolean
  /** 错误态:非空字符串时显示错误信息行(配合 #error-action slot 放重试按钮) */
  error?: string

  /* —— 行选择(可选) —— */

  /** 开启行选择:首列出现 checkbox */
  selectable?: boolean
  /** 当前选中的行 key 列表(v-model:selectedKeys) */
  selectedKeys?: string[]
}>()

const emit = defineEmits<{
  (event: 'action-click', payload: { title: string; rowIndex: number; action: string }): void
  (event: 'sort-change', payload: { key: string; order: SortOrder }): void
  (event: 'selection-change', payload: { keys: string[] }): void
  (event: 'update:selectedKeys', payload: string[]): void
}>()

function rowKey(rowIndex: number) {
  return props.rowKeys?.[rowIndex] ?? `${props.title}-${rowIndex}`
}

function isTagCell(cell: TableCell): cell is TagData {
  return typeof cell === 'object' && cell !== null && 'kind' in cell && cell.kind === 'tag'
}

function isActionCell(cell: TableCell): cell is ActionData {
  return typeof cell === 'object' && cell !== null && 'kind' in cell && cell.kind === 'actions'
}

function toneClass(tone?: TagData['tone']) {
  return tone || ''
}

/**
 * 统一的列模型:传了 columns 用 columns,否则把 headers(+colWidths) 合成为默认列。
 * 这样模板只面对一种列结构。
 */
const resolvedColumns = computed<ColumnConfig[]>(() => {
  if (props.columns && props.columns.length > 0) {
    return props.columns.map((c) => ({
      key: c.key,
      header: c.header,
      align: c.align ?? 'left',
      width: c.width,
      sortable: c.sortable ?? false,
    })) as ColumnConfig[]
  }
  const headers = props.headers ?? []
  const widths = props.colWidths ?? []
  return headers.map((header, i) => ({
    key: String(i),
    header,
    align: 'left' as const,
    width: widths[i],
    sortable: false,
  })) as ColumnConfig[]
})

/** fixed 模式下实际使用的列宽:优先 column.width,否则按列数均分。 */
const resolvedColWidths = computed<string[]>(() => {
  const n = resolvedColumns.value.length
  if (n <= 0) return []
  const hasExplicit = resolvedColumns.value.some((c) => c.width)
  if (hasExplicit) return resolvedColumns.value.map((c) => c.width || `${(100 / n).toFixed(4)}%`)
  return Array.from({ length: n }, () => `${(100 / n).toFixed(4)}%`)
})

/* —— 排序状态(组件内部只记忆当前列与方向,实际排序交给父组件) —— */
// 当前排序方向:通过事件回调维护(非受控记忆,便于点击切换 asc→desc→null)
let internalSortKey = ''
let internalSortOrder: SortOrder = null

function onSortClick(col: ColumnConfig) {
  if (!col.sortable) return
  // 切换顺序:同列 asc→desc→null,换列重置为 asc
  let nextOrder: SortOrder
  if (internalSortKey === col.key) {
    nextOrder = internalSortOrder === 'asc' ? 'desc' : internalSortOrder === 'desc' ? null : 'asc'
  } else {
    nextOrder = 'asc'
  }
  internalSortKey = nextOrder ? col.key : ''
  internalSortOrder = nextOrder
  emit('sort-change', { key: col.key, order: nextOrder })
}

function sortIndicator(col: ColumnConfig): 'asc' | 'desc' | 'none' {
  if (!col.sortable) return 'none'
  if (internalSortKey !== col.key) return 'none'
  return internalSortOrder ?? 'none'
}

/* —— 行选择 —— */
const selectedSet = computed<Set<string>>(() => new Set(props.selectedKeys ?? []))

function isRowSelected(rowIndex: number) {
  return selectedSet.value.has(rowKey(rowIndex))
}

function onRowCheck(rowIndex: number, checked: boolean) {
  const key = rowKey(rowIndex)
  const next = new Set(selectedSet.value)
  if (checked) next.add(key)
  else next.delete(key)
  const arr = Array.from(next)
  emit('update:selectedKeys', arr)
  emit('selection-change', { keys: arr })
}

const allChecked = computed(() => {
  if (props.rows.length === 0) return false
  return props.rows.every((_, i) => selectedSet.value.has(rowKey(i)))
})
const someChecked = computed(
  () => !allChecked.value && props.rows.some((_, i) => selectedSet.value.has(rowKey(i))),
)

function onCheckAll(checked: boolean) {
  const arr = checked ? props.rows.map((_, i) => rowKey(i)) : []
  emit('update:selectedKeys', arr)
  emit('selection-change', { keys: arr })
}

const hasToolbar = computed(() => !!slots.toolbar)
const hasFooter = computed(() => !!slots.footer)
const bodyWrapStyle = computed(() =>
  props.maxBodyHeight ? { maxHeight: props.maxBodyHeight } : {},
)
</script>

<template>
  <div class="card table-card">
    <div class="table-head">
      <strong>{{ title }}</strong>
      <div v-if="selectable && selectedSet.size > 0" class="table-batch-hint">
        已选 <b>{{ selectedSet.size }}</b> 项
      </div>
    </div>
    <div v-if="hasToolbar" class="table-tools">
      <slot name="toolbar" />
    </div>
    <div class="table-wrap" :style="bodyWrapStyle" :class="{ 'has-sticky': !!maxBodyHeight }">
      <table
        class="table"
        :class="{ 'table--fixed': fixed, 'table--striped': striped }"
        :aria-busy="loading ? 'true' : undefined"
      >
        <colgroup v-if="fixed">
          <col v-if="selectable" key="__sel" style="width: 40px" />
          <col v-for="(w, idx) in resolvedColWidths" :key="idx" :style="{ width: w }" />
        </colgroup>
        <thead>
          <tr>
            <th v-if="selectable" scope="col" class="col-check">
              <input
                type="checkbox"
                class="row-check"
                :checked="allChecked"
                :indeterminate.prop="someChecked"
                :aria-label="'全选当前页'"
                @change="onCheckAll(($event.target as HTMLInputElement).checked)"
              />
            </th>
            <th
              v-for="col in resolvedColumns"
              :key="col.key"
              scope="col"
              :class="['align-' + (col.align ?? 'left'), { 'col-sortable': col.sortable }]"
              :aria-sort="
                sortIndicator(col) === 'asc'
                  ? 'ascending'
                  : sortIndicator(col) === 'desc'
                    ? 'descending'
                    : 'none'
              "
              @click="onSortClick(col)"
            >
              <span class="th-inner">
                <span>{{ col.header }}</span>
                <span
                  v-if="col.sortable"
                  class="sort-ind"
                  :class="'ind-' + sortIndicator(col)"
                  aria-hidden="true"
                ></span>
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <!-- 加载态 -->
          <tr v-if="loading">
            <td :colspan="resolvedColumns.length + (selectable ? 1 : 0)" class="table-state table-loading">
              <span class="dots"><i></i><i></i><i></i></span>
              <span>加载中…</span>
            </td>
          </tr>
          <!-- 错误态 -->
          <tr v-else-if="error">
            <td :colspan="resolvedColumns.length + (selectable ? 1 : 0)" class="table-state table-error">
              <div class="state-text">
                <span class="state-emoji" aria-hidden="true">⚠</span>
                <span>{{ error }}</span>
              </div>
              <div v-if="slots['error-action']" class="state-action">
                <slot name="error-action" />
              </div>
            </td>
          </tr>
          <!-- 空态 -->
          <tr v-else-if="rows.length === 0">
            <td :colspan="resolvedColumns.length + (selectable ? 1 : 0)" class="table-state">
              <slot v-if="slots.empty" name="empty" />
              <template v-else>
                <span class="state-emoji" aria-hidden="true">∅</span>
                <span>{{ emptyText || '暂无数据' }}</span>
              </template>
            </td>
          </tr>
          <!-- 数据行 -->
          <template v-else>
            <tr
              v-for="(row, rowIndex) in rows"
              :key="rowKey(rowIndex)"
              :class="{ 'row-selected': selectable && isRowSelected(rowIndex) }"
            >
              <td v-if="selectable" class="col-check">
                <input
                  type="checkbox"
                  class="row-check"
                  :checked="isRowSelected(rowIndex)"
                  :aria-label="'选择第 ' + (rowIndex + 1) + ' 行'"
                  @change="onRowCheck(rowIndex, ($event.target as HTMLInputElement).checked)"
                />
              </td>
              <td
                v-for="(cell, cellIndex) in row"
                :key="`${rowKey(rowIndex)}-${cellIndex}`"
                :class="['align-' + (resolvedColumns[cellIndex]?.align ?? 'left')]"
              >
                <template v-if="isTagCell(cell)">
                  <span class="tag" :class="toneClass(cell.tone)">{{ cell.text }}</span>
                </template>
                <template v-else-if="isActionCell(cell)">
                  <div class="action-btns">
                    <button
                      v-for="action in cell.items"
                      :key="action"
                      type="button"
                      class="link-btn"
                      @click="emit('action-click', { title: props.title, rowIndex, action })"
                    >
                      {{ action }}
                    </button>
                  </div>
                </template>
                <template v-else>
                  {{ cell }}
                </template>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <div v-if="hasFooter" class="table-footer">
      <slot name="footer" />
    </div>
  </div>
</template>
