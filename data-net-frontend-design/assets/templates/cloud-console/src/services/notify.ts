export type NotifyType = 'error' | 'success' | 'warning' | 'info'

export interface NotifyPayload {
  type: NotifyType
  message: string
  description?: string
  durationMs?: number
}

const EVENT_NAME = 'app:notify'

export function notify(payload: NotifyPayload) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: payload }))
}

export function notifyError(message: string, description?: string) {
  notify({ type: 'error', message, description, durationMs: 4500 })
}

export function notifySuccess(message: string, description?: string) {
  notify({ type: 'success', message, description, durationMs: 2400 })
}

export function notifyWarning(message: string, description?: string) {
  notify({ type: 'warning', message, description, durationMs: 3200 })
}

export function getNotifyEventName() {
  return EVENT_NAME
}
