# 设计令牌(admin-element)

本模板的令牌定义在 `src/assets/styles/theme.scss`(CSS 变量 + SCSS 变量)和 `element-ui.scss`(EP 变量覆盖)。SCSS 变量经 vite 全局注入,所有 .scss 可直接用 `$primary-color` 等。

## 颜色

### 品牌与文字(theme.scss)

| 令牌 | 值 | 何时用 |
|------|-----|--------|
| `--primary-color` / `$primary-color` | `#1677ff` | 品牌主色(链接、主按钮、强调) |
| `--text-color` | `#333` | 主文字 |
| `--text-color-secondary` | `#666` | 次要文字 |
| `--text-color-tertiary` | `#999` | 占位符、最弱文字 |
| `--white` / `--black` | `#fff` / `#000` | — |

### 菜单 / 蓝色系(写死在各组件,约定值)

| 用途 | 值 |
|------|-----|
| 菜单激活文字 | `#055DD9` |
| 菜单激活/hover 背景 | `#dbe8ff` / `#f3f8ff` |
| 侧栏/内容区渐变底 | `linear-gradient(180deg, #f0f6ff, #f6f9ff)` |
| 整体底壳渐变 | `linear-gradient(359deg, #e6f3ff, #e8f1ff, #eaefff, #a7c3ff, #0852e5)` |
| 弹窗渐变底 | `linear-gradient(179deg, #cedbf8, #f4f7ff, #fff)` |
| 描述列表 label 背景 | `#f2f7ff` |
| 面包屑非激活色 | `#7f8ecd` / `#9aa5b7` |

### Element Plus 变量覆盖(element-ui.scss)

| 令牌 | 值 |
|------|-----|
| `--el-color-primary` | `#1677ff` |
| `--el-color-primary-light-3/9` | `#4196ff` / `#eaf4ff` |
| `--el-color-success` | `#00b42a`(Arco 配色) |
| `--el-color-warning` | `#ff7d00` |
| `--el-color-error` | `#f53f3f` |
| `--el-font-size-base` | `14px` |
| `--el-menu-item-font-size` | `16px` |

## 字号阶梯(theme.scss)

| 令牌 | 值 | 用途 |
|------|-----|------|
| `--font-size-main-title` | 48px | 门户大标题 |
| `--font-size-sub-title` | 40px | 区块大标题 |
| `--font-size-primary-title` | 24px | 页面标题 |
| `--font-size-large` | 20px | 大字 |
| `--font-size-middle` | 18px | 详情小节标题(InfoTitle) |
| `--font-size-small` | 16px | 菜单/标签/描述列表 |
| `--font-size-smaller` | 14px | 正文(默认) |

## 圆角与阴影

- **圆角**:卡片/按钮/分页 `4px`(`.border-normal`);弹窗 `8px`。整体偏小圆角。
- **阴影**:很少用。`.fixed-content`(悬浮工具栏)`0 0 6.6px rgba(192,200,216,.25)`;popover `drop-shadow(0 4px 8px #b3ceff)`。
- 表格行高 `44px`,表头背景 `#f5f7fa` / `#dce6f3`(深色变体)。

## 通用约定

- 页面 `min-width: 1440px`(`--page-min-width`),面向桌面,无响应式
- body `font-size:14px`、`overflow:hidden`(整页不滚,内容区内部滚)
- 滚动条:5px 宽,圆角,浅灰

## UnoCSS 配置速记

- `presetRemToPx(baseFontSize:4)`:`p-4` = 16px,无需换算
- shortcuts:`flex-center` / `flex-y-center` / `flex-x-between` / `flex-x-end` / `wh-full` / `ellipse-text` 等
- 支持 `@apply`(transformerDirectives),可在 scoped scss 里用原子类

## 动效

- 路由切换:`.fade-transform-*`(translateX 30px,0.2s)
- 菜单折叠:`transition: all 0.8s`
- 搜索区展开/收起:`transition: height 0.3s`
