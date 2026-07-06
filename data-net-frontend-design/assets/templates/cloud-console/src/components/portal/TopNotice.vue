<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive } from 'vue'
import { getNotifyEventName, type NotifyPayload, type NotifyType } from '../../services/notify'

interface NoticeItem extends NotifyPayload {
  id: string
  createdAt: number
}

const state = reactive({
  items: [] as NoticeItem[],
})

function tone(type: NotifyType) {
  if (type === 'success') return 'success'
  if (type === 'warning') return 'warning'
  if (type === 'info') return 'info'
  return 'error'
}

function add(payload: NotifyPayload) {
  const now = Date.now()
  const id = `${now}-${Math.random().toString(16).slice(2)}`
  // 保留完整 message 与 description,避免关键错误细节丢失;
  // 超长内容由 CSS 限制最大高度 + 内部滚动处理。
  const message = String(payload.message || '').replace(/\s+/g, ' ').trim()
  const description = payload.description
    ? String(payload.description).replace(/\s+/g, ' ').trim()
    : undefined
  const item: NoticeItem = { ...payload, message, description, id, createdAt: now }
  state.items.unshift(item)
  if (state.items.length > 3) state.items.splice(3)
  const duration = typeof payload.durationMs === 'number' ? payload.durationMs : 3000
  window.setTimeout(() => remove(id), duration)
}

function remove(id: string) {
  const idx = state.items.findIndex((n) => n.id === id)
  if (idx >= 0) state.items.splice(idx, 1)
}

function onNotify(event: Event) {
  const detail = (event as CustomEvent).detail as NotifyPayload | undefined
  if (!detail || !detail.message) return
  add(detail)
}

onMounted(() => {
  window.addEventListener(getNotifyEventName(), onNotify as EventListener)
})

onBeforeUnmount(() => {
  window.removeEventListener(getNotifyEventName(), onNotify as EventListener)
})
</script>

<template>
  <div class="notice-host" aria-live="polite" aria-relevant="additions removals">
    <TransitionGroup name="slide" tag="div" class="notice-stack">
      <div
        v-for="item in state.items"
        :key="item.id"
        class="notice"
        :class="tone(item.type)"
        role="status"
      >
        <div class="notice-main">
          <strong class="notice-title">{{ item.message }}</strong>
          <p v-if="item.description" class="notice-desc">{{ item.description }}</p>
        </div>
        <button type="button" class="notice-close" @click="remove(item.id)">关闭</button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.notice-host {
  position: fixed;
  top: 14px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 120;
  pointer-events: none;
  width: min(560px, calc(100% - 24px));
}

.notice-stack {
  display: grid;
  gap: 10px;
}

.notice {
  pointer-events: auto;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border-radius: var(--radius-md);
  backdrop-filter: blur(8px);
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.18);
  border: 1px solid rgba(148, 163, 184, 0.3);
  background: rgba(255, 255, 255, 0.92);
  max-height: min(60vh, 420px);
}

.notice-main {
  min-width: 0;
  flex: 1 1 auto;
  overflow: auto;
}

.notice.error {
  border-color: rgba(248, 113, 113, 0.4);
}

.notice.success {
  border-color: rgba(16, 185, 129, 0.35);
}

.notice.warning {
  border-color: rgba(251, 191, 36, 0.45);
}

.notice.info {
  border-color: rgba(59, 130, 246, 0.35);
}

.notice-title {
  display: block;
  font-size: 14px;
  font-weight: 700;
  color: rgba(15, 23, 42, 0.95);
  word-break: break-word;
}

.notice-desc {
  margin: 4px 0 0;
  font-size: 12px;
  line-height: 1.5;
  color: rgba(51, 65, 85, 0.85);
  word-break: break-word;
  white-space: pre-wrap;
}

.notice-close {
  flex: 0 0 auto;
  white-space: nowrap;
  padding: 8px 10px;
  border-radius: var(--radius-md);
  border: 1px solid rgba(148, 163, 184, 0.35);
  background: rgba(241, 245, 249, 0.6);
  color: rgba(15, 23, 42, 0.85);
}

.slide-enter-active,
.slide-leave-active {
  transition: all 180ms ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
