<script setup lang="ts">
import type { CardItem, TagData } from '../../types/portal'

type CardVariant = 'default' | 'feature'

const props = withDefaults(
  defineProps<{
    items: CardItem[]
    columns?: 2 | 3 | 4
    title?: string
    /** feature 变体使用带 hover 上浮效果的卡片;default 为普通卡片 */
    variant?: CardVariant
  }>(),
  {
    columns: 3,
    variant: 'default',
  },
)

function toneClass(tone?: TagData['tone']) {
  return tone || ''
}

function gridClass(columns: 2 | 3 | 4) {
  return `grid cols-${columns}`
}

function cardClass(variant: CardVariant) {
  if (variant === 'feature') return 'feature-card is-static'
  return 'card'
}
</script>

<template>
  <div>
    <h3 v-if="title" class="section-title">{{ title }}</h3>
    <div :class="gridClass(props.columns)">
      <div v-for="item in items" :key="item.title" :class="cardClass(props.variant)">
        <span v-if="item.badge" class="tag" :class="toneClass(item.badge.tone)">{{ item.badge.text }}</span>
        <h3>{{ item.title }}</h3>
        <p>{{ item.description }}</p>
        <div v-if="item.meta?.length" class="spec-list">
          <span v-for="meta in item.meta" :key="meta">{{ meta }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* feature 变体:带 hover 上浮效果。default 变体直接复用全局 .card。 */
.feature-card {
  min-height: 104px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 16px;
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  background: #fff;
  box-shadow: var(--shadow);
  text-align: left;
  transition: border-color var(--duration) var(--ease-out), box-shadow var(--duration) var(--ease-out),
    transform var(--duration) var(--ease-out);
}

.feature-card:hover {
  border-color: #93c5fd;
  box-shadow: 0 14px 32px rgba(15, 23, 42, 0.1);
  transform: translateY(-2px);
}

.feature-card.is-static {
  cursor: default;
}

.feature-card.is-static:hover {
  border-color: var(--line);
  box-shadow: var(--shadow);
  transform: none;
}

.feature-card strong {
  display: block;
  margin-bottom: 6px;
  font-size: 15px;
  font-weight: 800;
}

.feature-card h3 {
  margin: 0 0 6px;
  font-size: 15px;
  font-weight: 600;
}

.feature-card p {
  margin: 0;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.55;
}

/* spec-list:卡片底部的 meta 标签组 */
.spec-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: auto;
  padding-top: 14px;
}

.spec-list span {
  padding: 4px 7px;
  border-radius: 4px;
  background: #f3f6fb;
  color: #475569;
  font-size: 12px;
}
</style>
