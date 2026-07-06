<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { getAccessibleSections, getPagePath, getRoleConfig, portalConfig } from '../data/navigation'
import { getAuthSession, updateAuthRole } from '../services/auth'
import type { RoleKey } from '../types/portal'

const props = withDefaults(
  defineProps<{
    /** 应用名称(显示在侧栏 logo 右侧) */
    brandName?: string
    /**
     * 是否显示「端侧切换」(普通用户 / 管理员)。
     * 单端系统设为 false 即可,侧栏只显示当前角色的导航。
     */
    showRoleSwitch?: boolean
    /**
     * 是否允许切换到管理员端。双端系统里,业务侧的权限判断(是否有 admin 权限/角色)
     * 应由调用方计算后传入,布局本身不内置任何权限码规则。
     */
    canSwitchToAdmin?: boolean
    /** 当前账号头像文字(如首字母),默认取 session 里的角色 avatar */
    avatarText?: string
  }>(),
  {
    brandName: '应用名称',
    showRoleSwitch: false,
    canSwitchToAdmin: true,
    avatarText: undefined,
  },
)

const emit = defineEmits<{
  (e: 'role-change', role: RoleKey): void
  (e: 'logout'): void
}>()

const route = useRoute()
const router = useRouter()

const currentPageId = computed(() => String(route.meta.pageId || ''))
const currentRole = computed<RoleKey>(() => (route.meta.role as RoleKey) || 'user')
const roleConfig = computed(() => getRoleConfig(currentRole.value))

// 权限过滤:业务侧把 permissionCode / requiredIamRoles 编码进 navigation 数据,
// 并把当前 session 的权限/角色集合传入。无权限/角色信息时按可见性过滤。
const permissionSet = computed(() => {
  const perms = getAuthSession()?.permissions
  return perms ? new Set(perms) : undefined
})
const roleSet = computed(() => {
  const roles = getAuthSession()?.roles
  return roles ? new Set(roles) : undefined
})

const accessibleModules = computed(() =>
  roleConfig.value.modules
    .map((module) => ({
      module,
      sections: getAccessibleSections(module, permissionSet.value, roleSet.value),
    }))
    .filter((item) => item.sections.length > 0),
)

const currentModule = computed(() => {
  const found = accessibleModules.value.find((item) =>
    item.sections.some((section) => section.id === currentPageId.value),
  )
  return found?.module ?? accessibleModules.value[0]?.module ?? roleConfig.value.modules[0]
})

const currentModuleSections = computed(() => {
  const found = accessibleModules.value.find((item) => item.module.id === currentModule.value.id)
  return found?.sections || []
})

const avatar = computed(() => props.avatarText ?? roleConfig.value.avatar)

function switchRole(role: RoleKey) {
  if (role === 'admin' && !props.canSwitchToAdmin) return
  updateAuthRole(role)
  emit('role-change', role)
  router.push(getPagePath(portalConfig[role].defaultPageId))
}

function onLogout() {
  emit('logout')
  router.push('/login')
}
</script>

<template>
  <div class="app-shell">
    <aside class="sidebar" aria-label="主导航">
      <div class="brand">
        <!-- logo:默认占位方块,业务侧用 #brand slot 注入自定义 SVG -->
        <slot name="brand-mark">
          <div class="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="23" height="23">
              <rect x="3" y="3" width="18" height="18" rx="4" :fill="props.brandName ? '#1677ff' : '#cbd5e1'" />
            </svg>
          </div>
        </slot>
        <h1>{{ brandName }}</h1>
      </div>

      <div v-if="showRoleSwitch" class="role-switch" role="group" aria-label="端侧切换">
        <button
          type="button"
          :class="{ active: currentRole === 'user' }"
          :aria-pressed="currentRole === 'user'"
          @click="switchRole('user')"
        >
          普通用户端
        </button>
        <button
          type="button"
          :class="{ active: currentRole === 'admin' }"
          :aria-pressed="currentRole === 'admin'"
          @click="switchRole('admin')"
        >
          管理员端
        </button>
      </div>

      <div class="nav-hint">系统导航</div>
      <nav class="nav" aria-label="页面菜单">
        <template v-for="item in accessibleModules" :key="item.module.id">
          <div class="nav-section-title">{{ item.module.name }}</div>
          <RouterLink
            class="nav-item"
            :class="{ active: currentModule.id === item.module.id }"
            :to="getPagePath(item.sections[0].id)"
          >
            <span class="nav-dot"></span>
            <span>{{ item.module.name }}</span>
          </RouterLink>
        </template>
      </nav>
    </aside>

    <main id="main-content" class="main" tabindex="-1">
      <header class="topbar">
        <div class="topbar-intro">
          <h2>{{ route.meta.title }}</h2>
          <p v-if="currentModule.subtitle" class="page-sub">{{ currentModule.subtitle }}</p>
        </div>
        <div class="top-actions">
          <!-- 顶栏右侧操作区:业务侧用 #top-actions slot 注入消息按钮/头像/退出等 -->
          <slot name="top-actions" :avatar="avatar" :on-logout="onLogout">
            <div class="avatar" role="img" aria-label="当前用户头像">{{ avatar }}</div>
            <button type="button" class="ghost" @click="onLogout" title="退出登录">退出</button>
          </slot>
        </div>
      </header>

      <section class="page" aria-live="polite">
        <!-- 二级 tab(当前模块下的 sections)。单 section 时不渲染 -->
        <div v-if="currentModuleSections.length > 1" class="secondary-nav">
          <RouterLink
            v-for="section in currentModuleSections"
            :key="section.id"
            class="secondary-tab"
            :class="{ active: currentPageId === section.id }"
            :to="getPagePath(section.id)"
          >
            {{ section.name }}
          </RouterLink>
        </div>
        <RouterView />
      </section>
    </main>
  </div>
</template>
