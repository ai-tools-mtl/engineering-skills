# 布局范式(admin-element)

本模板的布局由「meta.layout 动态加载」+「menuPageLayout 主布局」+「路由表驱动菜单」三部分组成。

## 布局加载机制

App.vue 根据**路由 meta.layout** 动态加载 `@/layouts/<name>/index.vue` 作为壳:
- `meta.layout = 'menuPageLayout'`(管理端页面默认)→ 套管理端布局
- `meta.layout = 'empty'` → 空布局(错误页/登录页等全屏页)
- 不指定 / `'normal'` → 不套壳,直接渲染

```ts
// 路由示例
{ path: '/demo/list', component: ...,
  meta: { title: '用户列表', layout: 'menuPageLayout', keepAlive: true } }
```

## menuPageLayout 结构

```
.home-page-layout (蓝渐变底壳, height:100vh, padding 0 40px 40px)
├── .common-layout-header
│   └── innerHeader (顶栏:logo+系统名 | 用户下拉)
└── .control (flex, gap 16)
    ├── .layout-left (240px, 浅蓝白渐变, 可折叠)
    │   ├── CustomMenu (el-menu, 多级, unique-opened)
    │   └── 折叠按钮 (Expand/Fold 图标)
    └── .layout-right (flex:1, 浅蓝白渐变)
        ├── .breadcrumb-area (el-breadcrumb, 由 route.matched 生成)
        └── .content (slot 内容, padding 0 24px 16px)
```

关键尺寸(写在 scoped scss):
- 整体 padding `0 40px 40px 40px`
- 侧栏宽 `240px`(折叠后 `64px`,由 el-menu--collapse 控制)
- 内容区 padding `0 24px 16px`,纵向滚动

## 路由 = 菜单(menuPageLayout 自动生成)

menuPageLayout 遍历路由表,挑出 `meta.layout==='menuPageLayout' && !meta.hiddenMenu && meta.title` 的项渲染到侧边栏。**所以加菜单 = 加路由**(在 `backend.ts`)。

```ts
// 一级菜单(模块)+ 二级菜单(children)
{ path: '/demo', name: 'Demo', redirect: '/demo/list',
  meta: { title: '示例模块', icon: 'common-demo', layout: 'menuPageLayout' },
  children: [
    { path: 'list', name: 'DemoList', component: () => import('@/views/demo-list/index.vue'),
      meta: { title: '用户列表', layout: 'menuPageLayout', keepAlive: true } },
  ] }
```

### meta 字段约定

| 字段 | 作用 |
|------|------|
| `layout` | 用哪个布局(管理端:`menuPageLayout`) |
| `title` | 菜单名 / 面包屑名 |
| `icon` | 一级菜单图标(svg-icon name,如 `common-demo`) |
| `hiddenMenu` | true 时不在侧栏显示(详情页用) |
| `activeMenu` | 详情页激活哪个菜单项的 name(配合 hiddenMenu,让详情页高亮列表页) |
| `keepAlive` | 是否缓存(配合 tabStore) |
| `noPadding` | 内容区不加内边距(全屏表格) |

### 详情页范式

```ts
{ path: 'detail/:id', name: 'DemoDetail', component: () => import('@/views/demo-list/detail.vue'),
  meta: { title: '用户详情', layout: 'menuPageLayout',
          hiddenMenu: true, activeMenu: 'DemoList' } }
```

详情页不出现在菜单,但进入时侧栏高亮 `DemoList`(列表页)。导航用 `router.push({ name: 'DemoDetail', query: { id } })`。

## 列表页布局(三件套)

```
<BaseLayout>
├── #search    → CommonSearch + el-form/el-row/el-col(:span=8 三列)
├── #action    → 批量操作按钮(flex-x-end)
└── #content   → BaseTable
```

可选 `#left` slot 放树/分类筛选(`show-left` 开启,280px 白底可折叠)。

## 弹窗(详情/编辑)

```vue
<el-dialog v-model="visible" title="用户详情" class="my-dialog" width="1200px">
    <InfoTitle title="基本信息" icon-name="common-info" />
    <el-descriptions :column="2" border> ... </el-descriptions>
</el-dialog>
```

`class="my-dialog"` 应用蓝渐变底 + 8px 圆角定制样式。

## 无响应式

本模板**面向桌面**,`min-width: 1440px`,无 @media 断点。整页 `overflow:hidden`,滚动发生在 `.content` 内部。不要尝试做成响应式——会破坏蓝渐变底壳的视觉效果。

## KeepAlive

App.vue 用 `<KeepAlive :include="keepAliveNames">`,白名单来自 `tabStore.tabs` 中 `keepAlive:true` 的项。页面 meta 标 `keepAlive: true` 即被缓存。需要强制刷新当前页时调 `tabStore.reload()`。

> 本模板默认**不渲染标签页 UI**(tabStore 仅控制缓存白名单)。如需 tags-view 栏,在 menuPageLayout 里基于 tabStore.tabs 自行加 UI。
