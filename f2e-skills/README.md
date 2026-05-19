# f2e-skills — 阿里巴巴前端编码规范

基于阿里巴巴前端编码规范（f2e-spec）整理的 Claude Code 技能集，覆盖从代码编写到工程交付的完整前端链路。

## 核心原则

- 代码默认遵循**强制**规则，推荐规则在有明确理由时可例外
- 被询问时提供原始 f2e-spec 规则编号，保证可追溯
- 全链路共享默认假设：2 空格缩进、UTF-8、JS 单引号、JSX 双引号

---

## 技能一览

### f2e-markup

| 项 | 内容 |
|----|------|
| **触发文件** | `.html` `.css` `.scss` `.less` `.sass` |
| **基础** | HTML5 + CSS3，含 Sass/Less 预处理器 |

**核心覆盖**：
- **HTML 结构**：文件以 `<!doctype html>` 开头（小写）；必须包含 `lang` 属性、`charset="utf-8"`、`viewport`；优先使用语义化标签（`<header>`、`<nav>`、`<main>`、`<article>`、`<section>`、`<footer>`）
- **HTML 属性**：属性名小写，值用双引号；Boolean 属性不赋值（`<input disabled />`）
- **CSS 格式化**：所有声明以分号结尾；选择器和 `{` 之间一个空格；`:` 后一个空格；右大括号单独成行
- **CSS 值**：十六进制尽量短且小写（`#fff`）；长度值为 0 省略单位（`margin: 0`）；禁用 `!important`
- **Sass/Less**：四则运算符两侧空格；嵌套深度不超过 3 层；属性顺序：定位 → 盒模型 → 排版 → 视觉 → 动画 → 其他

---

### f2e-javascript

| 项 | 内容 |
|----|------|
| **触发文件** | `.js` `.ts` `.jsx` `.tsx` |
| **基础** | ECMAScript 6+ / TypeScript，遵循 f2e-javascript 作为 f2e-react 和 f2e-node 的基线 |

**核心覆盖**：
- **变量**：使用 `const` 或 `let`，禁止 `var`；优先 `const`，只在需要重新赋值时用 `let`；一条声明一个变量
- **类型与值**：禁止 `new Number/String/Boolean`；字符串优先单引号；数组/对象使用字面量；使用对象简写语法；优先用 `.` 访问属性
- **函数**：使用箭头函数代替匿名函数；不要用 `arguments`，用 rest 参数；IIFE 用小括号包裹
- **模块**：`import` 放模块最上方；禁止循环引用、自引用、重复引入同一模块
- **运算符与控制流**：禁止一元自增自减（`++`/`--`）；避免嵌套三元表达式；`switch` 的 `case` 必须以 `break` 结尾
- **TypeScript 强制**：类型断言用 `as Type`（禁用尖括号）；interface/type 成员分隔符用 `;`；禁止 `namespace` 和 `module` 定义命名空间；字符串字面量单引号
- **TypeScript 推荐**：简单数组用 `T[]`，复杂类型用 `Array<T>`；优先使用 `interface` 定义类型

---

### f2e-react

| 项 | 内容 |
|----|------|
| **触发文件** | React 组件、Hooks、JSX |
| **基础** | React 16+ with Hooks；以 f2e-javascript 为基线 |

**核心覆盖**：
- **JSX 格式化**：2 空格缩进；自闭合标签斜线前只有一个空格（`<Foo />`）；属性大括号内部两侧无空格（`bar={baz}`）；JSX 属性双引号；多行 JSX 用小括号包裹
- **标签与属性**：属性多于一个时第一个属性换行；禁止在有子节点的组件中使用 `dangerouslySetInnerHTML`；文本节点中不要放注释字符串
- **组件**：每个文件只包含一个 React 组件；不要在函数组件中使用 `this`；使用 ES6 class 而非 `createReactClass`
- **Props**：prop 命名使用小驼峰；声明的 prop 必须被使用；prop 值为 `true` 时省略值（`<Foo visible />`）；`style` 的属性值必须是对象
- **State**：不要在 `setState` 中使用 `this.state`；声明的 state 必须被使用；不要使用已废弃的生命周期方法
- **Refs**：使用 ref 回调函数或 `React.createRef()`，禁用字符串 ref
- **Hooks（强制）**：只在最顶层调用 Hooks；Hooks 命名必须以 `use` 开头；只在 React 函数组件和自定义 Hooks 中调用 Hooks
- **无障碍（推荐）**：`img` 必须包含 `alt` 属性；`<a>` 元素必须含有内容；`<iframe>` 必须有唯一的 `title` 属性

---

### f2e-node

| 项 | 内容 |
|----|------|
| **触发文件** | Node.js 代码、Express/Koa 路由、server 文件 |
| **基础** | Node.js LTS；以 f2e-javascript 为基线 |

**核心覆盖**：
- **安全（强制）**：在客户端隐藏错误详情（不暴露堆栈、路径、数据库信息）；隐藏技术栈标识（`X-Powered-By`）；JSONP 接口严格校验来源；禁止从参数或明文 cookie 取用户标识查敏感信息；防止 SQL 注入（参数化查询）
- **编码风格**：使用 Node.js 内置 `Promise` 而非第三方库；模块引用顺序：核心模块 → 第三方 → 本地；抛出异常使用原生 `Error` 对象
- **最佳实践**：应用无状态（外部存储管理状态）；不要用 Node.js 托管前端静态文件（交 Nginx/CDN）；CPU 密集型任务委托反向代理；优先 `async/await`；用户上传文件上传到 OSS；对接口入参严格校验；服务端 URL 重定向设置白名单

---

### f2e-engineering

| 项 | 内容 |
|----|------|
| **触发场景** | Git 提交、API 设计、markdown 文档、CHANGELOG 文件 |
| **基础** | Alibaba f2e-spec engineering standards |

**核心覆盖**：
- **Git 规约**：Conventional Commits 格式（`feat`/`fix`/`docs`/`style`/`test`/`refactor`/`chore`/`revert`）；描述用祈使句、首字母不大写、末尾不加句号；body 解释 what 和 why；分支命名（`feature/*`、`hotfix/*`、`release/*`）；Tag 遵循 SemVer
- **HTTP JSON API**：Success 响应必须包含 `success: true` + `data`；Error 响应必须包含 `success: false` + `code` + `message`；分页 `currentPage` 从 1 开始；RESTful 风格资源用名词复数
- **文档通用规约**：中英文之间加空格；中文与数字之间加空格；全角标点与其他字符间不加空格；半角标点与其他字符间加空格；中文标点全角；英文和数字半角
- **Changelog**：文件必须名为 `CHANGELOG.md`，放项目根目录；标题固定为「更新日志」；按版本号降序排列；版本号遵循 SemVer；日期格式 `yyyy-MM-dd`

---

## 默认约定（全链路共享）

| 项 | 约定 |
|----|------|
| 缩进 | 2 个空格 |
| 字符集 | UTF-8 |
| 行宽 | 100 字符（推荐） |
| JS 字符串 | 单引号 |
| JSX 属性 | 双引号 |
| 分号 | 必须 |

---

## 查询示例

> "JS 1.1.1 是什么规则？" → 返回规则编号 + 强制/推荐 + 解释 + 示例 + ESLint 规则名
>
> "React Hooks 强制规则有哪些？" → 返回顶层调用、命名规范、调用位置约束
