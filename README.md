# Skill Collection

> 面向 Claude Code（及兼容 Agent 框架）的编码技能集合，将业界成熟的技术规范转化为 AI 可执行的决策指导。

## 项目简介

本仓库收录了一系列**可复用的 Agent Skill**，核心来源包括：

- **阿里巴巴前端编码规范（f2e-spec）** —— 前端工程、JavaScript/TypeScript、React、Node.js、HTML/CSS 等全链路规约
- **阿里巴巴 Java 开发手册** —— Java 编程、设计、异常日志、MySQL、工程结构、安全、单元测试等七大专章
- **高能动性 Agent 激励协议（PUA）** —— 通过方法论路由、压力升级和闭环约束，提升 Agent 的问题解决韧性

所有技能均遵循 **S-P-O（Scope-Process-Output）** 结构，确保 Agent 在编写代码时能够自动应用强制规则，在被询问时提供可追溯的规范依据。

---

## 仓库结构

```
skill-collection/
├── f2e-skills/                          # 阿里巴巴前端编码规范技能集
│   ├── AGENTS.md                        # 前端技能总览与核心原则
│   ├── package.json
│   └── skills/
│       ├── f2e-engineering/SKILL.md     # 工程规约（Git / API / 文档 / Changelog）
│       ├── f2e-javascript/SKILL.md      # JavaScript & TypeScript 编码规约
│       ├── f2e-markup/SKILL.md          # HTML & CSS 编码规约
│       ├── f2e-node/SKILL.md            # Node.js 服务端开发规约
│       └── f2e-react/SKILL.md           # React 组件与 Hooks 编码规约
│
├── java-coding/                         # 阿里巴巴 Java 开发手册技能集
│   ├── java-coding-standards/SKILL.md   # 编程规约（命名 / OOP / 集合 / 并发 / 控制语句 / 注释）
│   ├── java-design-standards/SKILL.md   # 设计规约（架构设计 / UML / 设计原则）
│   ├── java-exception-logging/SKILL.md  # 异常日志规约（错误码 / 异常处理 / 日志）
│   ├── java-mysql-database/SKILL.md     # MySQL 数据库规约（建表 / 索引 / SQL / ORM）
│   ├── java-project-structure/SKILL.md  # 工程结构规约（分层 / 二方库 / 服务器）
│   ├── java-security-standards/SKILL.md # 安全规约（XSS / CSRF / SQL 注入 / 脱敏）
│   └── java-unit-testing/SKILL.md       # 单元测试规约（AIR 原则 / BCDE 原则）
│
└── pua/
    └── SKILL.md                         # 高能动性 Agent 激励协议
```

---

## 技能详解

### 一、f2e-skills（前端编码规范）

基于阿里巴巴前端编码规范（f2e-spec）整理，覆盖从代码编写到工程交付的完整前端链路。

| 技能 | 触发场景 | 核心内容 |
|------|---------|---------|
| **f2e-markup** | 编写 `.html`、`.css`、`.scss`、`.less` 文件 | HTML5 语义化标签、DOCTYPE 规范；CSS 格式化、选择器优先级、`!important` 禁用；Sass/Less 嵌套深度与属性排序 |
| **f2e-javascript** | 编写 `.js`、`.ts`、`.jsx`、`.tsx` 文件 | ES6+ 语法规范（`const`/`let`、箭头函数、解构）；TypeScript 类型断言与接口规范；代码格式化（2 空格缩进、分号、单引号） |
| **f2e-react** | 编写 React 组件、Hooks、JSX | JSX 格式化规则（双引号属性、多行括号包裹）；Hooks 调用规范（顶层调用、`use` 前缀）；组件结构（单文件单组件、Props/State 规范）；无障碍（a11y）推荐规则 |
| **f2e-node** | 编写 Node.js 服务端代码、Express/Koa 路由 | 安全强制规则（错误详情隐藏、SQL 参数化、CSRF 校验）；异步模式（优先 `async/await`、原生 Promise）；工程实践（状态外置、CDN 托管静态资源） |
| **f2e-engineering** | Git 提交、API 设计、文档编写、维护 Changelog | Conventional Commits 规范；HTTP JSON API 信封格式（success/data/error）；中文文档排版规约（中英文空格、全角标点）；SemVer 与 Changelog 格式 |

#### 默认约定（全链路共享）

- 缩进：2 个空格
- 字符集：UTF-8
- 行宽：100 字符（推荐）
- JS 字符串：单引号；JSX 属性：双引号

---

### 二、java-coding（Java 开发手册）

基于《阿里巴巴 Java 开发手册》整理，覆盖 Java 项目从编码到架构的七大维度。

| 技能 | 触发场景 | 核心内容 |
|------|---------|---------|
| **java-coding-standards** | 编写 Java 代码、Code Review | 命名风格（UpperCamelCase/lowerCamelCase/常量全大写）；OOP 规约（`equals`/`hashCode`、包装类型、BigDecimal 精度）；集合处理（`isEmpty`、 diamond 语法、toArray(T[0])）；并发处理（线程池规范、ThreadLocal 回收、锁粒度）；控制语句（卫语句、三目运算 NPE 防范）；注释规约（Javadoc 强制、TODO/FIXME 标记） |
| **java-design-standards** | 架构设计、技术评审、画 UML | 设计图规范（状态图 >3 状态、时序图 >3 对象、类图 >5 类）；SOLID 原则实践（单一职责、依赖倒置、开闭原则）；DRY 与可扩展性设计；错误码体系（A/B/C 三级分类） |
| **java-exception-logging** | 异常处理、日志配置、错误码设计 | 错误码规范（5 位字符串、A/B/C 来源分级）；异常处理（禁止空 catch、finally 禁止 return、事务手动回滚）；日志规约（SLF4J 门面、占位符拼接、15 天保留、敏感信息脱敏） |
| **java-mysql-database** | 数据库设计、SQL 编写、ORM 配置 | 建表规约（`is_xxx` 布尔字段、逻辑删除、三字段必备 `id/create_time/update_time`）；索引规约（唯一索引防脏数据、覆盖索引、延迟关联优化分页）；SQL 规范（`count(*)`、`ISNULL()`、禁止外键级联）；ORM 映射（`#{}` 防注入、`resultMap` 必填） |
| **java-project-structure** | 项目分层、依赖管理、服务器配置 | 应用分层（开放 API / Web / Service / Manager / DAO）；领域模型（DO/DTO/BO/VO/Query）；二方库规范（GAV 命名、SNAPSHOT 禁用、版本统一变量）；服务器调优（TCP time_wait、fd 限制、JVM OOM dump） |
| **java-security-standards** | 安全功能实现、渗透测试修复 | 强制校验（权限控制、参数有效性、SQL 注入防护）；数据安全（敏感信息脱敏、配置文件密码加密）；攻击防护（XSS 过滤、CSRF 验证、防重放机制、上传文件管控） |
| **java-unit-testing** | 编写单元测试、测试评审 | AIR 原则（Automatic / Independent / Repeatable）；BCDE 原则（Border / Correct / Design / Error）；覆盖率目标（核心模块 100% 语句+分支）；数据库测试回滚与数据标识 |

#### 默认约定（Java 全链路共享）

- 缩进：4 个空格（禁止 Tab）
- 字符集：UTF-8
- 换行符：Unix 格式（LF）
- 行宽：120 字符
- 类命名：UpperCamelCase；方法/变量：lowerCamelCase；常量：全大写下划线分隔

---

### 三、pua（高能动性 Agent 激励协议）

> 不养闲 Agent。当任务失败、用户表达不满或 Agent 表现出被动行为时自动触发，通过企业文化风格的方法论路由和压力升级机制，强制 Agent 穷尽一切方案后再放弃。

| 特性 | 说明 |
|------|------|
| **方法论智能路由** | 根据任务类型自动选择最优企业文化方法论（Debug→华为 RCA、新功能→Musk Algorithm、Code Review→Jobs 减法、性能优化→字节 A/B Test） |
| **三条红线** | ① 闭环意识（无验证证据不算完成）；② 事实驱动（未验证归因视为甩锅）；③ 穷尽一切（通用 5 步法走完前禁止放弃） |
| **压力升级机制** | 失败次数驱动 L1→L4 压力等级，自动切换本质不同的方法论，完成 7 项检查清单后才允许体面退出 |
| **Owner 意识** | 主动识别问题边界、上下游影响、同类隐患，追求「一个问题进来，一类问题出去」 |
| **多味道支持** | 阿里（闭环/抓手/颗粒度）、字节（ROI/数据驱动）、华为（RCA/蓝军/自我批判）、Musk（质疑→删除→简化→加速→自动化）等 12 种企业文化风格 |

---

## 使用方式

### 作为 Claude Code Skill 安装

将本仓库中的 `SKILL.md` 文件复制到 Claude Code 的技能目录：

```bash
# macOS/Linux
~/.claude/skills/

# Windows
%USERPROFILE%\.claude\skills\
```

按子目录组织即可，例如：

```
~/.claude/skills/
├── f2e-engineering/SKILL.md
├── f2e-javascript/SKILL.md
├── java-coding-standards/SKILL.md
└── pua/SKILL.md
```

### 作为项目级 Agent 指南

在特定项目的根目录放置所需的 `SKILL.md` 或 `AGENTS.md`，Claude Code 会自动识别并遵循其中的规则。

### 查询具体规则

当需要确认某条规则时，直接询问 Claude：

> "JS 1.1.1 是什么规则？" → 返回规则编号 + 强制/推荐级别 + 解释 + 示例 + ESLint 规则名
> "Java 集合第 9 条" → 返回 toArray(T[0]) 的详细说明与性能分析

---

## 设计原则

1. **可追溯**：所有规则保留原始规范编号（如 JS 1.1.1、Java 并发 3.2），便于对照原文
2. **分级明确**：每条规则标注「强制」「推荐」「参考」三级，Agent 默认遵循强制规则
3. **自动应用**：编写代码时静默合规，无需额外提示；被询问时提供结构化解答
4. **最小侵入**：以决策指导形式存在，不替代 linter/formatter，而是补充上下文决策

---

## License

MIT
