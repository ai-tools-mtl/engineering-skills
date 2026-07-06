<script setup lang="ts">
/**
 * 管理员端示例页。结构与 demo-overview 一致,仅数据不同。
 * 真实项目里替换为你自己的管理后台首页。
 */
import PageHero from '../../components/portal/PageHero.vue'
import MetricCards from '../../components/portal/MetricCards.vue'
import { tag } from '../../data/ui'

const metrics = [
  { label: '总用户', value: '12,408', desc: '本月 +326', tone: 'green' as const },
  { label: '活跃租户', value: '48', desc: '在线 32', tone: 'green' as const },
  { label: '待审批', value: '15', desc: '需处理', tone: 'orange' as const },
  { label: '系统告警', value: '3', desc: '严重 1', tone: 'red' as const },
]
</script>

<template>
  <PageHero
    title="管理总览"
    description="这是管理员端示例页。单端系统可在 navigation.ts 里删掉 adminModules,并设 show-role-switch=false。"
  />
  <MetricCards :items="metrics" />
  <div class="card">
    <h3>开始</h3>
    <p>
      替换 <code>src/data/navigation.ts</code> 的 modules,并在 <code>src/pages/&lt;id&gt;/index.vue</code>
      创建对应页面。每个 section.id 必须有对应的页面文件,否则 router 启动会报错。
    </p>
  </div>
</template>
