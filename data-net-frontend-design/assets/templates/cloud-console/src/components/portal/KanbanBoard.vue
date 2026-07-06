<script setup lang="ts">
import type { KanbanLane } from '../../types/portal'

defineProps<{
  title?: string
  lanes: KanbanLane[]
}>()
</script>

<template>
  <div>
    <h3 v-if="title" class="section-title">{{ title }}</h3>
    <div class="kanban">
      <div v-for="lane in lanes" :key="lane.title" class="lane">
        <h3>{{ lane.title }}</h3>
        <div v-for="item in lane.items" :key="item.title" class="mini-card">
          {{ item.title }}
          <div v-if="typeof item.progress === 'number'" class="progress">
            <span :style="{ width: `${item.progress}%` }"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
