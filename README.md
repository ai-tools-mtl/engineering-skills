# Engineering Skills

面向 Claude Code（及兼容 Agent 框架）的编码技能集合，将业界成熟的技术规范转化为 AI 可执行的决策指导。

## 安装

```bash
# 克隆仓库
git clone https://github.com/ai-tools-mtl/engineering-skills.git

# 安装单个 skill
cp -R skills/f2e-engineering ~/.claude/skills/

# 安装全部 skill
cp -R skills/* ~/.claude/skills/
```

Codex 用户：
```bash
cp -R skills/* ~/.codex/skills/
```

---

## Skill 索引

### 前端规范（阿里巴巴 f2e-spec）

| Skill | 说明 | 触发关键词 |
|-------|------|-----------|
| [`f2e-engineering`](skills/f2e-engineering/SKILL.md) | Git / API / 文档 / Changelog 工程规约 | commit, API design, changelog |
| [`f2e-javascript`](skills/f2e-javascript/SKILL.md) | JavaScript & TypeScript 编码规约 | .js, .ts, .jsx, .tsx |
| [`f2e-markup`](skills/f2e-markup/SKILL.md) | HTML & CSS 编码规约 | .html, .css, .scss |
| [`f2e-node`](skills/f2e-node/SKILL.md) | Node.js 服务端开发规约 | express, koa, server |
| [`f2e-react`](skills/f2e-react/SKILL.md) | React 组件与 Hooks 编码规约 | React, JSX, hooks |

### Java 规范（阿里巴巴 Java 开发手册）

| Skill | 说明 | 触发关键词 |
|-------|------|-----------|
| [`java-coding-standards`](skills/java-coding-standards/SKILL.md) | 命名 / OOP / 集合 / 并发 / 控制语句 / 注释 | Java coding, code review |
| [`java-design-standards`](skills/java-design-standards/SKILL.md) | 架构设计 / UML / 设计原则 | architecture, UML, design |
| [`java-exception-logging`](skills/java-exception-logging/SKILL.md) | 错误码 / 异常处理 / 日志 | exception, logging, error code |
| [`java-mysql-database`](skills/java-mysql-database/SKILL.md) | 建表 / 索引 / SQL / ORM | MySQL, SQL, database |
| [`java-project-structure`](skills/java-project-structure/SKILL.md) | 分层 / 二方库 / 服务器 | project structure, layers |
| [`java-security-standards`](skills/java-security-standards/SKILL.md) | XSS / CSRF / SQL 注入 / 脱敏 | security, XSS, CSRF |
| [`java-unit-testing`](skills/java-unit-testing/SKILL.md) | AIR 原则 / BCDE 原则 | unit test, JUnit |

### Python 规范（PEP 8 + 社区最佳实践）

| Skill | 说明 | 触发关键词 |
|-------|------|-----------|
| [`python-coding-standards`](skills/python-coding-standards/SKILL.md) | 命名 / 格式 / Pythonic / 迭代器 / 文档 | Python coding, PEP 8 |
| [`python-type-hints`](skills/python-type-hints/SKILL.md) | 类型注解 / mypy / Pydantic | type hints, mypy, typing |
| [`python-design-standards`](skills/python-design-standards/SKILL.md) | SOLID / 设计模式 / 分层架构 | architecture, design pattern |
| [`python-exception-logging`](skills/python-exception-logging/SKILL.md) | 异常层次 / 错误码 / structlog | exception, logging, structlog |
| [`python-database`](skills/python-database/SKILL.md) | SQLAlchemy / Django ORM / SQL 规范 | database, SQLAlchemy, ORM |
| [`python-web-api`](skills/python-web-api/SKILL.md) | FastAPI / DRF / Flask RESTful | API, FastAPI, Django REST |
| [`python-security-standards`](skills/python-security-standards/SKILL.md) | OWASP / 输入校验 / 认证授权 | security, OWASP, auth |
| [`python-unit-testing`](skills/python-unit-testing/SKILL.md) | pytest / fixtures / mock / 覆盖率 | pytest, unit test, coverage |

### Agent 协议

| Skill | 说明 | 触发关键词 |
|-------|------|-----------|
| [`pua`](skills/pua/SKILL.md) | 高能动性 Agent 激励协议（12 种企业文化风格） | agent motivation, PUA |

---

## 仓库结构

```
engineering-skills/
├── skills/                              # 所有 skill 的统一目录
│   ├── f2e-engineering/SKILL.md         # 前端工程规约
│   ├── f2e-javascript/SKILL.md          # JS/TS 编码规约
│   ├── f2e-markup/SKILL.md              # HTML/CSS 编码规约
│   ├── f2e-node/SKILL.md                # Node.js 规约
│   ├── f2e-react/SKILL.md               # React 规约
│   ├── java-coding-standards/SKILL.md   # Java 编程规约
│   ├── java-design-standards/SKILL.md   # Java 设计规约
│   ├── java-exception-logging/SKILL.md  # Java 异常日志规约
│   ├── java-mysql-database/SKILL.md     # Java MySQL 规约
│   ├── java-project-structure/SKILL.md  # Java 工程结构规约
│   ├── java-security-standards/SKILL.md # Java 安全规约
│   ├── java-unit-testing/SKILL.md       # Java 单元测试规约
│   ├── python-coding-standards/SKILL.md # Python 编码规约
│   ├── python-type-hints/SKILL.md       # Python 类型注解规约
│   ├── python-design-standards/SKILL.md # Python 设计规约
│   ├── python-exception-logging/SKILL.md# Python 异常日志规约
│   ├── python-database/SKILL.md         # Python 数据库规约
│   ├── python-web-api/SKILL.md          # Python Web API 规约
│   ├── python-security-standards/SKILL.md# Python 安全规约
│   ├── python-unit-testing/SKILL.md     # Python 单元测试规约
│   └── pua/SKILL.md                     # 高能动性 Agent 激励协议
├── package.json
└── README.md
```

---

## 设计原则

1. **可追溯**：所有规则保留原始规范编号，便于对照原文
2. **分级明确**：每条规则标注「强制」「推荐」「参考」三级
3. **自动应用**：编写代码时静默合规，无需额外提示
4. **最小侵入**：以决策指导形式存在，不替代 linter/formatter

## License

MIT
