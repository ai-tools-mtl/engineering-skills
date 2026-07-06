import type { RoleKey } from '../types/portal'

const AUTH_STORAGE_KEY = 'app-auth-session'

export interface AuthSession {
  username: string
  displayName: string
  role: RoleKey
  /** 权限码集合,如 ['SCOPE_workbench:resources:read', ...]。用于 navigation 的权限过滤 */
  permissions?: string[]
  /** IAM 角色集合,如 ['TENANT_ADMIN']。用于 navigation 的 requiredIamRoles 过滤 */
  roles?: string[]
  lastLoginAt: string
}

export function getAuthSession(): AuthSession | null {
  if (typeof window === 'undefined') return null

  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY)
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw) as AuthSession
    if (!parsed.username || !parsed.role) return null
    return parsed
  } catch {
    return null
  }
}

export function setAuthSession(session: AuthSession) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
}

export function clearAuthSession() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(AUTH_STORAGE_KEY)
}

export function isAuthenticated() {
  return getAuthSession() !== null
}

export function updateAuthRole(role: RoleKey) {
  const session = getAuthSession()
  if (!session) return

  setAuthSession({
    ...session,
    role,
  })
}
