<script setup lang="ts">
import type { MetricItem, TagData } from '../../types/portal'

defineProps<{
  items: MetricItem[]
}>()

function toneClass(tone?: TagData['tone']) {
  return tone || ''
}
</script>

<template>
  <div class="grid cols-4">
    <div v-for="item in items" :key="item.label" class="card stat">
      <span class="tag" :class="toneClass(item.tone)">{{ item.label }}</span>
      <div class="num">{{ item.value }}</div>
      <p>{{ item.desc }}</p>
    </div>
  </div>
</template>
