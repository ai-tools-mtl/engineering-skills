# f2e-skills — 阿里巴巴前端编码规范

基于阿里巴巴前端编码规范（f2e-spec）整理的 Claude Code 技能集，覆盖从代码编写到工程交付的完整前端链路。

## 核心原则

- 代码默认遵循**强制（强制）**规则，推荐规则在有明确理由时可例外
- 被询问时提供原始 f2e-spec 规则编号，保证可追溯
- 全链路共享默认假设：2 空格缩进、UTF-8、JS 单引号、JSX 双引号

---

## 技能一览

| 技能 | 触发文件/场景 | 核心覆盖 |
|------|-------------|---------|
| **[f2e-markup](./skills/f2e-markup)** | `.html` `.css` `.scss` `.less` `.sass` | HTML5 语义化、DOCTYPE 规范；CSS 格式化、选择器、`!important` 禁用；Sass/Less 嵌套深度与属性排序 |
| **[f2e-javascript](./skills/f2e-javascript)** | `.js` `.ts` `.jsx` `.tsx` | ES6+ 语法（`const`/`let`、箭头函数、解构）；TypeScript 类型断言与接口；代码格式化（分号、行宽 100） |
| **[f2e-react](./skills/f2e-react)** | React 组件、Hooks、JSX | JSX 格式化（双引号属性、多行括号）；Hooks 调用规范（顶层调用、`use` 前缀）；Props/State 规则；无障碍（a11y）推荐 |
| **[f2e-node](./skills/f2e-node)** | Node.js 代码、Express/Koa 路由 | 安全强制（错误隐藏、SQL 参数化、CSRF）；异步模式（`async/await`、原生 Promise）；工程实践（状态外置、CDN 托管） |
| **[f2e-engineering](./skills/f2e-engineering)** | Git 提交、API 设计、文档、Changelog | Conventional Commits；HTTP JSON API 信封格式；中文文档排版；SemVer 与 Changelog 格式 |

---

## 默认约定（全链路共享）

| 项 | 约定 |
|----|------|
| 缩进 | 2 个空格 |
| 字符集 | UTF-8 |
| 行宽 | 100 字符（推荐） |
| JS 字符串 | 单引号 |
| JSX 属性 | 双引号 |

---

## 查询示例

> "JS 1.1.1 是什么规则？" → 返回规则编号 + 强制/推荐 + 解释 + 示例 + ESLint 规则名
>
> "React Hooks 强制规则有哪些？" → 返回顶层调用、命名规范、调用位置约束
