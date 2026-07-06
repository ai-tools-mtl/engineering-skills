import type {
  NavigationModule,
  NavigationSection,
  RoleConfig,
  RoleKey,
} from '../types/portal'

/*
 * 导航配置:这是「导航 + 权限」的单一事实源。
 *
 * 替换下面 userModules / adminModules 的内容即可定义你自己的菜单结构。
 * 约定:
 *   - section.id  必须与 src/pages/<id>/index.vue 的目录名一致(router 靠它找组件)
 *   - 完整路由 = module.path + '/' + section.path,如 /demo/overview
 *   - section.permissionCode  命中 session.permissions 时才在导航/权限过滤中可见
 *   - section.requiredIamRoles session.roles 需全部包含才可见
 *   - section.visible === false 时显式从导航隐藏(仍可 url 访问)
 */

const userModules: NavigationModule[] = [
  {
    id: 'demo',
    name: '示例模块',
    path: '/demo',
    subtitle: '替换为你自己的模块描述。',
    sections: [
      {
        id: 'demo-overview',
        name: '总览',
        path: 'overview',
        abilities: ['指标概览', '近期活动'],
        // permissionCode: 'SCOPE_demo:overview:read',
      },
      // 继续添加 section,例如:
      // {
      //   id: 'demo-list',          // 对应 src/pages/demo-list/index.vue
      //   name: '列表',
      //   path: 'list',
      //   abilities: ['查询', '筛选'],
      //   permissionCode: 'SCOPE_demo:list:read',
      // },
    ],
  },
]

// 单端系统可只保留 user 角色;双端系统按需补充 adminModules。
const adminModules: NavigationModule[] = [
  {
    id: 'admin-demo',
    name: '管理示例',
    path: '/admin/demo',
    subtitle: '管理员端示例模块。',
    sections: [
      {
        id: 'admin-demo-overview',
        name: '管理总览',
        path: 'overview',
        abilities: ['平台指标'],
      },
    ],
  },
]

export const portalConfig: Record<RoleKey, RoleConfig> = {
  user: {
    key: 'user',
    label: '普通用户端',
    avatar: 'U',
    defaultPageId: 'demo-overview',
    modules: userModules,
  },
  admin: {
    key: 'admin',
    label: '管理员端',
    avatar: 'A',
    defaultPageId: 'admin-demo-overview',
    modules: adminModules,
  },
}

/** 扁平化所有 section,供 router 构造路由 */
export const allSections = Object.values(portalConfig).flatMap((role) =>
  role.modules.flatMap((module) =>
    module.sections.map((section) => ({
      role,
      module,
      section,
    })),
  ),
)

export function getRoleConfig(role: RoleKey): RoleConfig {
  return portalConfig[role]
}

/** 模块中未被显式隐藏(visible !== false)的 section */
export function getVisibleSections(module: NavigationModule): NavigationSection[] {
  return module.sections.filter((section) => section.visible !== false)
}

/**
 * 按权限过滤 section:先按 requiredIamRoles 过滤,再按 permissionCode 过滤。
 * 无 permissions/roles 信息时,退化为仅可见性过滤。
 */
export function getAccessibleSections(
  module: NavigationModule,
  permissions?: Set<string>,
  roles?: Set<string>,
): NavigationSection[] {
  const visible = getVisibleSections(module)
  const roleFiltered = visible.filter((section) => {
    if (!section.requiredIamRoles || section.requiredIamRoles.length === 0) return true
    if (!roles || roles.size === 0) return false
    return section.requiredIamRoles.every((r) => roles.has(r))
  })

  if (!permissions || permissions.size === 0) {
    return roleFiltered
  }
  const hasScopePermission = Array.from(permissions).some((p) => String(p).startsWith('SCOPE_'))
  if (!hasScopePermission) {
    return roleFiltered
  }
  return roleFiltered.filter((section) => {
    if (!section.permissionCode) return true
    return permissions.has(section.permissionCode)
  })
}

export function findSectionByPageId(pageId: string) {
  return allSections.find((item) => item.section.id === pageId)
}

/** 由 pageId 拼出完整路由路径 */
export function getPagePath(pageId: string): string {
  const found = findSectionByPageId(pageId)
  if (!found) {
    return '/'
  }

  return `${found.module.path}/${found.section.path}`
}
