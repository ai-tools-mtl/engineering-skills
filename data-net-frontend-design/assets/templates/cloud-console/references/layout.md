# 布局范式

这套设计系统的布局由 `PortalLayout.vue` + 全局 class 共同定义。新项目几乎不需要改布局,只需往 `<RouterView />` 里填页面。

---

## 整体结构

```
.app-shell  (flex, 横向, min-height: 100vh)
├── .sidebar   (228px 固定, 浅色 #f3f6fb, sticky 通栏)
│   ├── .brand       (logo + 应用名)
│   ├── .role-switch (可选: 用户/管理员切换)
│   └── nav
│       ├── .nav-section-title  (分组标题)
│       └── .nav-item           (菜单项, active 时左侧 3px 蓝条)
└── .main      (flex:1, 白底)
    ├── .topbar      (48px, sticky, 左:页面标题  右:操作区)
    └── .page        (内边距 14px 20px 32px)
        ├── .secondary-nav   (二级 tab, 下划线式, sticky 在 topbar 下)
        └── <RouterView />   (实际页面内容)
```

关键尺寸(都写在 `style.css`,无需重写):
- 侧栏宽 `228px`,中宽屏(`≤1100px`)加宽到 `252px`,窄屏(`≤760px`)通栏顶部
- topbar 高 `48px`,sticky
- secondary-nav 高 `42px`,sticky(top:48px),单 section 时由 PortalLayout 自动隐藏

---

## 导航数据驱动

导航完全由 `data/navigation.ts` 决定,布局组件不写死任何菜单项。结构:

```
RoleConfig (user / admin)
  └── modules[]              ← 侧栏的「分组」
      ├── id / name / path / subtitle
      └── sections[]         ← 二级 tab
          ├── id            ← 必须对应 src/pages/<id>/index.vue
          ├── name          ← tab 文字
          ├── path          ← 拼到 module.path 后面
          ├── permissionCode?   ← 权限过滤
          └── requiredIamRoles? ← 角色过滤
```

`getAccessibleSections()` 负责按当前 session 的 permissions/roles 过滤,Layout 自动只显示有权限的模块和 section。

**新增页面 = 两步**:
1. `navigation.ts` 加一个 section(id = `your-page`)
2. 建 `src/pages/your-page/index.vue`

路由会自动注册(router 用 `import.meta.glob` 发现页面),二级 tab 自动出现。

---

## 栅格

页面内部布局用 `.grid` + 列数修饰类:

```html
<div class="grid cols-4">...</div>   <!-- 指标卡:四列 -->
<div class="grid cols-3">...</div>   <!-- 卡片网格 -->
<div class="grid cols-2">...</div>   <!-- 左右分栏 -->
```

- 默认 gap `12px`
- `≤1100px`:cols-4/cols-3 降为 2 列
- `≤760px`:全部降为 1 列

左主右辅的看板式布局(dashboard),用 grid 自定义列:

```html
<div style="display:grid; grid-template-columns: minmax(0,1.5fr) minmax(320px,0.8fr); gap:12px;">
  <div class="card">主区</div>
  <div class="card">侧栏</div>
</div>
```

---

## 页面内边距与节奏

`.page` 内边距 `14px 20px 32px`(上 14、左右 20、下 32)。区块之间的纵向间距约定:
- PageHero → MetricCards:PageHero 自带 `margin-bottom: 14px`
- 区块标题 `.section-title`:`margin: 18px 0 10px`
- 卡片之间靠 `.grid` 的 gap(12px)

不要在页面里手动加 `<br>` 或大 `margin` 破坏节奏;用 `.grid` 包裹同层卡片。

---

## 表单布局

两列表单用 `.form`(grid 2 列,gap 14),跨列字段加 `.span-2`:

```html
<div class="form">
  <div class="field">
    <label>名称</label>
    <input class="input" />
  </div>
  <div class="field">
    <label>类型</label>
    <select>...</select>
  </div>
  <div class="field span-2">
    <label>描述</label>
    <textarea></textarea>
  </div>
</div>
<div class="btns">
  <button class="primary">提交</button>
  <button class="ghost">取消</button>
</div>
```

筛选区(表格上方)用 `.page-filters` 或 `DataTable` 的 `#toolbar` slot。

---

## 全屏独立页(不进 PortalLayout)

如登录页、调试工作台等需要全屏的页面,在 `router/index.ts` 注册成**顶层路由**(不放进 PortalLayout 的 children):

```ts
{
  path: '/login',
  component: () => import('../pages/login/index.vue'),
  meta: { title: '登录' },
}
```

这类页面自己负责完整布局,不复用侧栏/topbar。

---

## 响应式约定

| 断点 | 布局变化 |
|------|---------|
| `≤1100px` | 侧栏 252px;多列栅格降为 2 列;section-head 改纵向 |
| `≤760px` | app-shell 纵向堆叠;侧栏通栏顶部;所有栅格 1 列;topbar/表单转纵向 |

新增栅格/分栏时,默认就会继承 `.cols-*` 的响应式规则;自定义 grid 列需自己加 `@media`。
