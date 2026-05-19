# Skill Collection

面向 Claude Code（及兼容 Agent 框架）的编码技能集合，将业界成熟的技术规范转化为 AI 可执行的决策指导。

## 简介

本仓库核心来源：

- **阿里巴巴前端编码规范（f2e-spec）** → `f2e-skills/`
- **阿里巴巴 Java 开发手册** → `java-coding/`
- **高能动性 Agent 激励协议（PUA）** → `pua/`

所有技能遵循 **S-P-O（Scope-Process-Output）** 结构，Agent 编写代码时自动应用强制规则，被询问时提供可追溯的规范依据。

---

## 技能总览

| 分类 | 路径 | 技能数 | 简介 |
|------|------|--------|------|
| 前端规范 | [`f2e-skills/`](./f2e-skills) | 5 | HTML/CSS/JS/TS/React/Node.js 编码与工程规约 |
| Java 规范 | [`java-coding/`](./java-coding) | 7 | Java 编程/设计/异常日志/MySQL/工程结构/安全/单元测试 |
| 高能动性协议 | [`pua/`](./pua) | 1 | Agent 激励与方法论路由，提升问题解决韧性 |

---

## 快速使用

将所需 `SKILL.md` 复制到 Claude Code 技能目录：

```bash
# macOS/Linux
~/.claude/skills/

# Windows
%USERPROFILE%\.claude\skills\
```

或在项目根目录直接放置 `AGENTS.md` / `SKILL.md`，Agent 自动识别。

---

## License

MIT
