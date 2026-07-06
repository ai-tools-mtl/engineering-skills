<script setup lang="ts">
const emit = defineEmits<{
  (e: 'action-click'): void
  (e: 'secondary-action-click'): void
}>()

defineProps<{
  title: string
  description: string
  actionLabel?: string
  secondaryActionLabel?: string
}>()
</script>

<template>
  <div class="workbench-hero">
    <div>
      <h3>{{ title }}</h3>
      <p>{{ description }}</p>
    </div>
    <div v-if="actionLabel || secondaryActionLabel" class="workbench-hero-actions">
      <button v-if="actionLabel" type="button" class="primary" @click="emit('action-click')">
        {{ actionLabel }}
      </button>
      <button
        v-if="secondaryActionLabel"
        type="button"
        class="ghost"
        @click="emit('secondary-action-click')"
      >
        {{ secondaryActionLabel }}
      </button>
    </div>
  </div>
</template>
