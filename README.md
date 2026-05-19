# Skill Collection

面向 Claude Code（及兼容 Agent 框架）的编码技能集合，将业界成熟的技术规范转化为 AI 可执行的决策指导。

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

## 技能总览

| 分类 | 路径 | 技能数 | 简介 |
|------|------|--------|------|
| 前端规范 | [`f2e-skills/`](./f2e-skills) | 5 | HTML/CSS/JS/TS/React/Node.js 编码与工程规约，覆盖从代码编写到工程交付的完整前端链路 |
| Java 规范 | [`java-coding/`](./java-coding) | 7 | Java 编程/设计/异常日志/MySQL/工程结构/安全/单元测试，覆盖 Java 项目从编码到架构的七大维度 |
| 高能动性协议 | [`pua/`](./pua) | 1 | Agent 激励与方法论路由，通过压力升级和闭环约束提升问题解决韧性，支持 12 种企业文化风格 |

---

## 快速使用

### 安装为 Claude Code Skill

将所需 `SKILL.md` 复制到 Claude Code 的技能目录：

```bash
# macOS/Linux
~/.claude/skills/

# Windows
%USERPROFILE%\.claude\skills\
```

### 作为项目级 Agent 指南

在特定项目的根目录放置所需的 `SKILL.md` 或 `AGENTS.md`，Claude Code 会自动识别并遵循其中的规则。

### 查询具体规则

当需要确认某条规则时，直接询问 Claude：

> "JS 1.1.1 是什么规则？" → 返回规则编号 + 强制/推荐级别 + 解释 + 示例 + ESLint 规则名
>
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
