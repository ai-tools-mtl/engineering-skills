# 设计令牌(Design Tokens)

本文件是这套「云控制台」风格的令牌权威清单。所有令牌定义在 `assets/starter/src/style.css` 的 `:root`。

新增或修改样式时,**优先用这些令牌**,而不是写死十六进制值。

---

## 颜色

| 令牌 | 值 | 何时用 |
|------|-----|--------|
| `--bg` | `#f5f7fb` | 应用整体背景(浅灰蓝) |
| `--panel` | `#fff` | 卡片/面板/表格背景 |
| `--panel2` | `#f7f9fc` | 次级面板:表头、表格 thead、空态区 |
| `--text` | `#1f2937` | 主文字(深灰,几乎黑) |
| `--muted` | `#6b7280` | 次要文字:描述、时间戳、副标题 |
| `--line` | `#e5e7eb` | 分割线、边框、卡片描边 |

### 品牌色

| 令牌 | 值 | 何时用 |
|------|-----|--------|
| `--brand` | `#1677ff` | 主按钮、选中态、链接、强调 |
| `--brand-hover` | `#0958d9` | 主色 hover |

品牌色相关衍生色(非令牌,但约定一致):
- 浅蓝底纹 `#eaf2ff` / `#e8f1ff`(nav hover/active、tab)
- 顶栏 hero 浅蓝边框 `#dbeafe`、底纹 `#f0f6ff`
- 焦点环 `0 0 0 3px rgba(59,130,246,0.15)`

### 语义色(Tone)

| 令牌 | 值 | 语义 | tag 底/字色 |
|------|-----|------|------------|
| `--green` | `#16a34a` | 成功 / 正向 / 在线 | 底 `#ecfdf5` |
| `--orange` | `#f59e0b` | 警告 / 待处理 / 待审核 | 底 `#fff7ed` |
| `--red` | `#ef4444` | 危险 / 错误 / 异常 / 离线 | 底 `#fef2f2` |
| `--purple` | `#6366f1` | 中性强调 / 信息 | 底 `#f5f3ff` |

> tag 的语义色用法:写 `<span class="tag" :class="tone">`,tone 为 `''`(默认蓝)/ `green` / `orange` / `red` / `purple`。`tag()` 工厂函数已封装。

---

## 圆角

**整套是小圆角体系,最大不超过 10px。**

| 令牌 | 值 | 何时用 |
|------|-----|--------|
| `--radius-sm` | `4px` | 按钮、输入框、tab、nav-item、tag(主用档) |
| `--radius-md` | `6px` | 模态 metric、notice、subcard |
| `--radius-lg` | `8px` | 卡片、筛选区、模态框 |
| `--radius-xl` | `10px` | 较大容器(少用) |

> 注意:按钮、tag、nav-item、tab 在 style.css 里直接写了 `4px` 而非用变量,这是有意的(它们需要紧凑方正的视觉)。卡片等用变量。

---

## 阴影

**云控制台风格:几乎无阴影,只用极轻的层次感。**

| 令牌 | 值 | 何时用 |
|------|-----|--------|
| `--shadow` | `0 1px 2px rgba(15,23,42,0.04)` | 卡片、筛选区(默认几乎看不见) |
| `--shadow-lg` | `0 8px 24px rgba(15,23,42,0.08)` | toast、浮层、模态 |

约定:
- 按钮(.primary/.ghost/.outline)**不加阴影**(与原项目一致)
- 卡片 hover **不改阴影**,只加深边框色(`--line` → `#d5dce8`)
- 大阴影只留给浮层类(toast / modal / notice)

---

## 字体

| 项 | 值 |
|----|-----|
| 字体族 `--font-sans` | `-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif` |
| body 字号 | `14px` |
| body 行高 | `1.55` |

### 字号阶梯(约定值,非变量)

| 用途 | 字号 | 字重 |
|------|------|------|
| topbar 页面标题 h2 | 18px | 600 |
| 区块标题 .section-title / card h3 | 15px | 600 |
| 指标数字 .num | 24px | 900 |
| 正文/表格 td | 13–14px | 400 |
| tag | 11px | 800 |
| 辅助文字 .muted | 12–13px | 400 |

---

## 间距(约定,非变量)

原项目未用间距变量,但有稳定惯例:
- 卡片内边距 `14px`(紧凑卡)或 `16–18px`(宽松卡)
- `.page` 内边距 `14px 20px 32px`(顶/左 20,底 32 留白)
- 表格单元格 `10px 12px`
- 栅格 gap `12px`(常规)/ `16px`(看板)
- 按钮高 `32px`、内边距 `0 12px`

新增组件时沿用这些数值,保持节奏一致。

---

## 动效

| 令牌 | 值 | 用途 |
|------|-----|------|
| `--duration` | `0.2s` | 常规过渡(hover、背景色) |
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | 标准缓动 |

约定:
- 颜色/背景过渡统一用 `transition: background var(--duration) var(--ease-out), color ...`
- 无障碍:全局 `@media (prefers-reduced-motion: reduce)` 会把所有动效压到 0.01ms,不要绕过

---

## 断点(响应式)

| 断点 | 触发的变化 |
|------|-----------|
| `max-width: 1100px` | 侧栏加宽到 252px;cols-4/cols-3 降为 2 列;看板降为 2 列 |
| `max-width: 760px` | app-shell 改为纵向堆叠;侧栏通栏顶部;所有栅格降为 1 列 |

新增栅格时复用 `.grid` + `.cols-*`,自动继承这些响应式规则。
