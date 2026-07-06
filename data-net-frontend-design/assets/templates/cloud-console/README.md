# Starter 启动包

这是一套「云控制台」风格的 Vue 3 + Vite + TypeScript 前端启动包。把它拷进一个新项目的 `src/` 下,即可获得统一的设计系统(配色、圆角、阴影、布局、公共组件),无需 Tailwind 或任何 UI 库。

## 技术栈

- Vue 3(`<script setup lang="ts">`)+ Vite + TypeScript
- vue-router
- 纯手写 CSS,设计令牌集中在 `src/style.css` 的 `:root`
- 无 UI 库、无 Tailwind

## 目录结构(拷入新项目后)

```
src/
├── main.ts                      # 入口:引入 style.css、挂载 router
├── App.vue                      # 根组件:skip-link + TopNotice + RouterView
├── style.css                    # 【核心】全局设计系统(令牌 + 通用组件类)
├── layouts/
│   └── PortalLayout.vue         # 布局骨架:侧栏 + topbar + 二级 nav(已参数化)
├── router/
│   └── index.ts                 # 路由:import.meta.glob 自动发现 + 鉴权守卫
├── data/
│   ├── navigation.ts            # 导航配置(替换为你自己的菜单/权限)
│   └── ui.ts                    # tag() / actions() 单元格工厂
├── services/
│   ├── auth.ts                  # session(localStorage)
│   └── notify.ts                # toast 通知
├── types/
│   └── portal.ts                # 组件 + 导航类型
├── components/portal/           # 7 个公共组件
│   ├── PageHero.vue
│   ├── MetricCards.vue
│   ├── DataTable.vue
│   ├── CardGrid.vue
│   ├── KanbanBoard.vue
│   ├── TimelineCard.vue
│   └── TopNotice.vue
└── pages/
    └── demo-overview/index.vue  # 示例页(展示组装公式)
```

## 接入步骤(新项目从 0 到能跑)

### 1. 建项目

```bash
npm create vite@latest my-app -- --template vue-ts
cd my-app
npm install
npm install vue-router@4
```

### 2. 拷入模板

把本目录下的 `src/` 整个覆盖到新项目的 `src/`。`index.html` 保留 Vite 默认即可(确保有 `<div id="app">`)。

### 3. 配置 vite(如需路径别名)

`tsconfig.app.json` 和 `vite.config.ts` 用默认即可。组件间用相对路径引用。

### 4. 配置导航

编辑 `src/data/navigation.ts`:
- 替换 `userModules` 为你的菜单结构
- 每个 `section.id` 必须对应 `src/pages/<id>/index.vue` 的目录名
- 路由 = `module.path + '/' + section.path`(如 `/demo/overview`)

### 5. 按需创建页面

新建页面的标准做法:

```
src/pages/your-page/index.vue   ← 在 navigation.ts 加一条 section,id = 'your-page'
```

页面内部遵循**组装公式**(顺序):

```
PageHero    (标题 + 描述 + 主按钮)
  → MetricCards  (2~4 个指标卡)
  → card / CardGrid / TimelineCard  (内容区)
  → DataTable    (数据表,带 toolbar/footer slot)
```

详见 `src/pages/demo-overview/index.vue` 这份完整示例。

### 6. (可选)登录态

`router/index.ts` 默认带鉴权守卫,未登录跳 `/login`。
- 不需要登录:删除 `router.beforeEach(...)` 那段,或在 `services/auth.ts` 的 `isAuthenticated` 里直接 `return true`
- 需要登录:创建 `src/pages/login/index.vue`,登录成功后 `setAuthSession({...})` 再 `router.push('/')`

### 7. 启动

```bash
npm run dev
```

打开后应能看到侧栏 + topbar + demo-overview 示例页。

## 自定义品牌

`PortalLayout` 已参数化:

| prop / slot | 作用 |
|-------------|------|
| `brand-name` | 侧栏 logo 右侧的应用名 |
| `#brand-mark` slot | 注入自定义 logo(替换默认占位方块) |
| `show-role-switch` | 是否显示「普通用户/管理员」切换(单端系统设 false) |
| `can-switch-to-admin` | 是否允许切到管理员端(业务侧算权限后传入) |
| `#top-actions` slot | 顶栏右侧操作区(消息按钮、头像、退出等) |

示例:

```vue
<PortalLayout brand-name="我的系统" :show-role-switch="true">
  <template #brand-mark>
    <div class="brand-mark"><MyLogo /></div>
  </template>
</PortalLayout>
```

## 设计令牌

所有颜色/圆角/阴影/字体都在 `src/style.css` 顶部的 `:root`。改主题色只需改 `--brand` / `--brand-hover`。完整令牌说明见本模板的 `references/design-tokens.md`。

## 通知(toast)

```ts
import { notifySuccess, notifyError } from './services/notify'
notifySuccess('保存成功')
notifyError('提交失败', '网络超时,请重试')
```

`TopNotice` 组件已挂在 `App.vue`,会自动监听并显示。
