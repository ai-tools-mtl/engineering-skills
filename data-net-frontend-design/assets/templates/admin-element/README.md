# admin-element 蓝渐变管理端模板

一套 Vue 3 + Element Plus + UnoCSS 的中后台管理端启动包。特色是**蓝色纵向渐变底壳** + 封装的**列表页三件套**(BaseLayout / CommonSearch / BaseTable)。拷进新项目即可获得完整的管理后台骨架。

## 技术栈

- Vue 3(`<script setup lang="ts">`)+ Vite 6
- **Element Plus**(按需自动导入,无需手动 import 组件)
- **UnoCSS**(原子类,presetRemToPx:1rem=4px)
- SCSS(全局注入 theme.scss 令牌)
- Pinia + vue-router
- 无 Tailwind(用 UnoCSS 替代)

## 目录结构

```
admin-element/
├── TEMPLATE.yaml               # 模板元信息
├── .env.development            # 环境变量(api地址/应用名)
├── package.json
├── config/
│   ├── vite.config.ts          # ★ EP按需导入 + SCSS注入 + UnoCSS + SVG雪碧图 + @别名
│   ├── uno.config.ts           # ★ UnoCSS 预设 + shortcuts
│   └── tsconfig.{json,app.json}
├── src/
│   ├── main.ts                 # 入口:注册三件套 + SvgIcon + Pinia + 路由
│   ├── App.vue                 # 根:el-config-provider + meta.layout 动态布局 + KeepAlive
│   ├── assets/
│   │   ├── styles/             # ★ 样式核心
│   │   │   ├── theme.scss      #   令牌(CSS变量+SCSS变量,全局注入)
│   │   │   ├── element-ui.scss #   EP 变量覆盖 + 组件定制
│   │   │   ├── common.scss     #   通用工具类 + EP 微调
│   │   │   ├── scrollbar.css
│   │   │   └── index.css       #   样式总入口
│   │   └── svg-icon/common/    #   本地 svg 图标(菜单/详情用)
│   ├── layouts/
│   │   ├── menuPageLayout/     # ★ 管理端主布局(蓝渐变 + 侧栏 + 面包屑)
│   │   ├── components/
│   │   │   ├── innerHeader.vue #   顶栏(logo+系统名+用户下拉)
│   │   │   └── customMenu.vue  #   侧栏菜单(el-menu 多级)
│   │   └── empty/              #   空布局(错误页/登录页)
│   ├── router/
│   │   ├── index.ts            # 路由 + 守卫骨架
│   │   └── routes/
│   │       ├── index.ts        # 根布局 + errPage + 业务路由装配
│   │       └── backend.ts      # ★ 业务路由(=侧栏菜单来源)
│   ├── components/
│   │   ├── BaseLayout/         # ★ 三段式容器(slots: left/search/action/content)
│   │   ├── BaseTable/          # ★ 表格+分页(columnsList 配置列)
│   │   ├── commonSearch/       # ★ 可展开搜索区(查询/重置/导出)
│   │   ├── InfoTitle/          #   详情页小节标题
│   │   └── SvgIcon/            #   图标(本地svg / EP图标)
│   ├── store/                  # Pinia(tab store)
│   ├── utils/request/          # axios 封装骨架
│   ├── typings/env.d.ts        # 环境变量类型
│   └── views/
│       ├── errPage.vue
│       └── demo-list/          # ★ 示例列表页(三件套完整用法)
└── references/
    ├── design-tokens.md        # 令牌清单
    ├── components.md           # 三件套 + EP 组件用法
    └── layout.md               # 布局/路由/菜单机制
```

## 接入步骤

### 1. 建项目并装依赖

```bash
npm create vite@latest my-admin -- --template vue-ts
cd my-admin
# 用本模板的 package.json 覆盖,然后
npm install
```

### 2. 拷入模板文件

把 `src/`、`config/`、`.env.development` 拷进新项目对应位置。根目录的 `vite.config.ts` / `uno.config.ts` / `tsconfig.*` 用 `config/` 里的覆盖。

> ⚠️ 关键:`vite.config.ts` 里配了 SCSS 全局注入 theme.scss、EP 按需导入、UnoCSS、@ 别名、SVG 雪碧图——这些是模板能跑的前提,必须正确放置。

### 3. 配置环境变量

编辑 `.env.development`:
- `VITE_API_PROXY`:你的后端地址
- `VITE_APP_NAME`:应用名(显示在顶栏)

### 4. 加你的菜单/页面

**加菜单 = 加路由**。编辑 `src/router/routes/backend.ts`,按范式加模块:

```ts
{
    path: '/audit',
    name: 'Audit',
    redirect: '/audit/dataSource',
    meta: { title: '审核中心', icon: 'common-audit', layout: 'menuPageLayout' },
    children: [
        {
            path: 'dataSource',
            name: 'AuditDataSource',
            component: () => import('@/views/audit/dataSource.vue'),
            meta: { title: '数据资源审核', layout: 'menuPageLayout', keepAlive: true },
        },
    ],
}
```

然后建 `src/views/audit/dataSource.vue`,照 `demo-list/index.vue` 的三件套范式写。菜单会自动出现在侧边栏。

### 5. 加菜单图标

把 svg 放到 `src/assets/svg-icon/common/xxx.svg`,路由 meta.icon 写 `common-xxx`(对应 symbolId `icon-common-xxx`)。

### 6. 启动

```bash
npm run dev
```

应能看到蓝渐变背景 + 侧边栏(示例模块) + demo-list 列表页。

## 列表页三件套范式(核心)

每个列表页按这个结构组装(完整示例见 `src/views/demo-list/index.vue`):

```vue
<BaseLayout>
    <template #search>
        <CommonSearch @search="..." @reset="...">
            <el-form> <el-row :gutter="20"> <el-col :span="8"> el-form-item... </el-col> </el-row>
        </CommonSearch>
    </template>
    <template #action>
        <el-button type="primary">新增</el-button>  <!-- 批量操作 -->
    </template>
    <template #content>
        <BaseTable v-model:page-num v-model:page-size :columns-list :table-data :total @handle-search>
            <template #状态列slotName="{ row }"> ... </template>
            <template #action="{ row }"> el-button link... </template>
        </BaseTable>
    </template>
</BaseLayout>
```

详情页用 `el-dialog` + `InfoTitle` + `common-info-title`(区块标题)。三件套的完整 props/slots 见 `references/components.md`。

## 设计令牌

改主题色:改 `src/assets/styles/theme.scss` 的 `--primary-color` 和 `element-ui.scss` 的 `--el-color-primary`。完整令牌说明见 `references/design-tokens.md`。

## 自定义品牌

`menuPageLayout/index.vue` 里:
- `appName`:系统名(读自 `VITE_APP_NAME`,或从 store 取)
- 顶栏 logo:用 innerHeader 的 `#logo` slot 覆盖占位方块
- `userName` / 退出逻辑:接你的用户 store
