import { createRouter, createWebHistory } from 'vue-router'
import PortalLayout from '../layouts/PortalLayout.vue'
import { allSections, getPagePath, portalConfig } from '../data/navigation'
import { getAuthSession, isAuthenticated } from '../services/auth'

/*
 * 路由约定:
 *   - 业务页面放在 src/pages/<section.id>/index.vue,通过 import.meta.glob 自动发现
 *   - 每条业务路由的 meta:{ pageId, role, moduleId, title }
 *       · pageId   navigation 定位 section / 路由高亮用
 *       · role     'user' | 'admin',决定 PortalLayout 显示哪套导航
 *       · title    topbar 显示的页面标题
 *   - 完整路径 = getPagePath(section.id) = module.path + '/' + section.path
 *
 * 新增页面只需:① 在 navigation.ts 加 section;② 建 src/pages/<id>/index.vue。
 */

const pageModules = import.meta.glob('../pages/**/index.vue')

const childRoutes = allSections.map(({ role, section }) => {
  const pagePath = `../pages/${section.id}/index.vue`
  const component = pageModules[pagePath]

  if (!component) {
    throw new Error(
      `Page component not found: ${pagePath}\n` +
        `请在 src/pages/${section.id}/index.vue 创建该页面,或在 navigation.ts 移除该 section。`,
    )
  }

  return {
    path: getPagePath(section.id).replace(/^\//, ''),
    name: section.id,
    component,
    meta: {
      pageId: section.id,
      role: role.key,
      title: section.name,
    },
  }
})

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: () => {
        const session = getAuthSession()
        const role = session?.role || 'user'
        return getPagePath(portalConfig[role].defaultPageId)
      },
    },
    // 登录页(独立全屏页,不进 PortalLayout)。按需创建 src/pages/login/index.vue。
    {
      path: '/login',
      name: 'login',
      component: () => import('../pages/login/index.vue').catch(() => ({})),
      meta: { title: '登录' },
    },
    // 业务页面:全部挂在 PortalLayout 下,共享侧栏 + topbar + 二级 nav
    {
      path: '/',
      component: PortalLayout,
      children: childRoutes,
    },
  ],
})

// 鉴权守卫:未登录跳 /login。如不需要登录态,删除此 beforeEach。
router.beforeEach((to, _from, next) => {
  if (to.path === '/login') {
    next()
    return
  }
  if (!isAuthenticated()) {
    next('/login')
    return
  }
  next()
})

export default router
