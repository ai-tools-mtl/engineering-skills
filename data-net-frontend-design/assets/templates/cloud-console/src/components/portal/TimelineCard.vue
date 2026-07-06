<script setup lang="ts">
import type { TimelineItem } from '../../types/portal'

defineProps<{
  title: string
  items: TimelineItem[]
}>()
</script>

<template>
  <div>
    <h3 class="section-title">{{ title }}</h3>
    <div class="card">
      <div class="timeline">
        <div v-for="item in items" :key="item.title" class="step">
          <strong>{{ item.title }}</strong>
          <p>{{ item.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
