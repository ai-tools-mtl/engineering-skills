import type { ActionData, TagData } from '../types/portal'

/** 构造一个 tag 单元格(用于 DataTable / CardGrid 的状态标签) */
export function tag(text: string, tone?: TagData['tone']): TagData {
  return { kind: 'tag', text, tone }
}

/** 构造一个操作按钮单元格(用于 DataTable 的「操作」列) */
export function actions(...items: string[]): ActionData {
  return { kind: 'actions', items }
}

/**
 * 规范化时间为 'YYYY-MM-DD HH:mm:ss'。
 * 兼容后端常见的 ISO 形如 '2026-07-06T15:16:13.580'、'2026-07-06 15:16:13' 等;
 * 入参为空时返回 fallback(默认 '—'),适合直接喂给 DataTable 的时间列。
 */
export function formatTime(raw: string | null | undefined, fallback = '—'): string {
  if (!raw) return fallback
  const m = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}:\d{2}:\d{2})/.exec(raw)
  return m ? `${m[1]}-${m[2]}-${m[3]} ${m[4]}` : raw
}
