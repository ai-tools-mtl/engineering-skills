<script setup lang="ts">
/**
 * 示例页:展示这套设计系统的「页面组装公式」。
 *
 * 公式 = PageHero(标题区) → MetricCards(指标卡) → card / grid(内容区) → DataTable(数据表)
 * 新建页面时照此顺序组装,优先复用 components/portal 下的公共组件,而非手写结构和样式。
 */
import PageHero from '../../components/portal/PageHero.vue'
import MetricCards from '../../components/portal/MetricCards.vue'
import DataTable from '../../components/portal/DataTable.vue'
import CardGrid from '../../components/portal/CardGrid.vue'
import TimelineCard from '../../components/portal/TimelineCard.vue'
import { actions, tag } from '../../data/ui'
import { notifySuccess } from '../../services/notify'
import type { ColumnConfig } from '../../types/portal'
import { ref } from 'vue'

const metrics = [
  { label: '今日访问', value: '1,284', desc: '较昨日 +12%', tone: 'green' as const },
  { label: '活跃用户', value: '326', desc: '在线中', tone: 'green' as const },
  { label: '待处理', value: '8', desc: '需要关注', tone: 'orange' as const },
  { label: '异常', value: '2', desc: '过去 24 小时', tone: 'red' as const },
]

const cards = [
  {
    title: '快速入口',
    description: '常用的操作和导航,帮助你快速开始。',
    badge: tag('推荐', 'green'),
    meta: ['常用', '置顶'],
  },
  {
    title: '使用文档',
    description: '了解这套设计系统的组件、令牌和布局规则。',
    badge: tag('文档', 'purple'),
    meta: ['指南', '参考'],
  },
  {
    title: '变更日志',
    description: '查看最近的更新和已修复的问题。',
    meta: ['v1.0'],
  },
]

const rows = [
  ['dev-001', '开发环境', tag('运行中', 'green'), 12, '2026-07-04 10:24', actions('查看', '日志')],
  ['staging-002', '预发环境', tag('待审核', 'orange'), 3, '2026-07-04 09:10', actions('查看', '审批')],
  ['prod-003', '生产环境', tag('异常', 'red'), 28, '2026-07-03 22:41', actions('查看', '重启')],
  ['test-004', '测试环境', tag('已停止', 'orange'), 0, '2026-07-03 18:00', actions('查看', '启动')],
]

const rowKeys = rows.map((r) => r[0] as string)

// 声明式列配置:对齐、宽度、排序能力
const columns: ColumnConfig[] = [
  { key: 'id', header: 'ID', align: 'left', width: '120px', sortable: true },
  { key: 'name', header: '名称', align: 'left' },
  { key: 'status', header: '状态', align: 'center', width: '100px' },
  { key: 'count', header: '实例数', align: 'right', width: '90px', sortable: true },
  { key: 'time', header: '更新时间', align: 'left', width: '160px' },
  { key: 'actions', header: '操作', align: 'center', width: '120px' },
]

// 行选择(v-model)
const selectedKeys = ref<string[]>([])

function onAction(e: { action: string }) {
  notifySuccess('操作', `已触发「${e.action}」`)
}

const timeline = [
  { title: '系统启动', description: '所有服务就绪,健康检查通过。' },
  { title: '数据同步完成', description: '本次同步 1,284 条记录,耗时 3.2s。' },
  { title: '检测到异常', description: 'prod-003 节点 CPU 超过 90%,已触发告警。' },
]

function onCreate() {
  notifySuccess('已创建', '新任务已提交,可在列表中查看。')
}
</script>

<template>
  <PageHero
    title="总览"
    description="这是一个示例页面,展示如何用 PageHero + MetricCards + 卡片 + DataTable 组装一个标准页面。"
    action-label="新建任务"
    secondary-action-label="刷新"
    @action-click="onCreate"
  />

  <MetricCards :items="metrics" />

  <CardGrid :items="cards" :columns="3" title="常用功能" />

  <div class="grid cols-2">
    <TimelineCard title="近期活动" :items="timeline" />
    <div class="card">
      <h3>说明</h3>
      <p>
        新页面应遵循「组装公式」:顶部用 PageHero,指标用 MetricCards,
        内容区用 card / CardGrid,列表用 DataTable。样式优先复用全局 class,
        仅在页面私有结构时才写 &lt;style scoped&gt;。
      </p>
    </div>
  </div>

  <DataTable
    title="环境列表"
    :columns="columns"
    :rows="rows"
    :row-keys="rowKeys"
    :fixed="true"
    :striped="true"
    :selectable="true"
    v-model:selectedKeys="selectedKeys"
    max-body-height="280px"
    @action-click="onAction"
  >
    <template #toolbar>
      <input class="input" placeholder="搜索 ID 或名称" />
      <select>
        <option value="">全部状态</option>
        <option value="running">运行中</option>
        <option value="error">异常</option>
      </select>
      <button type="button" class="primary">查询</button>
    </template>
    <template #footer>
      <span>共 {{ rows.length }} 条</span>
      <div class="pager">
        <button class="pager-num">上一页</button>
        <button class="pager-num active">1</button>
        <button class="pager-num">下一页</button>
      </div>
    </template>
  </DataTable>
</template>
