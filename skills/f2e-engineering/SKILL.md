---
name: f2e-engineering
description: >
  Use when working with Git commits, API design, documentation, or changelogs —
  enforces Alibaba front-end engineering standards. Triggers on commit messages,
  API endpoint design, markdown docs, CHANGELOG files, or when the user asks
  about engineering conventions.
---

# 工程规约

## S - Scope

- Target: Git workflow, HTTP JSON API design, documentation writing, changelog format.
- Source: Alibaba f2e-spec engineering standards.
- Focus: decision guidance; Claude must follow these when writing commits, designing APIs, writing docs, or maintaining changelogs.

### Default assumptions

- Conventional Commits format for commit messages.
- JSON API follows success/error envelope pattern.
- Chinese documentation follows typography rules.

---

## 1 Git 规约

### Commit Message format

```
<类型>[可选范围]: <描述>

[可选正文]

[可选脚注]
```

#### Type (类型)

| Type | Meaning |
|------|---------|
| `feat` | 新增功能 |
| `fix` | 修复 bug |
| `docs` | 文档改动 |
| `style` | 格式化改动，不影响逻辑 |
| `test` | 新增或修改测试用例 |
| `refactor` | 重构代码 |
| `chore` | 工程方面改动，不影响逻辑 |
| `revert` | 恢复之前的提交 |

#### Rules

- **描述使用祈使句、一般现在时**：`add feature` 而非 `added feature`。
- **描述首字母不大写**：`feat: add login page` 而非 `feat: Add login page`。
- **描述末尾不加句号**。
- **body 解释 what 和 why**，不要解释 how（看代码就知道 how）。
- **breaking changes** 放在 footer：`BREAKING CHANGE: description`。
- 国际化/开源项目推荐英文，其他项目用团队最常用语言。
- 不要使用拼音或不常见缩写。

### Branch naming

| Branch type | Pattern | Example |
|-------------|---------|---------|
| 主分支 | `main` | main |
| 特性分支 | `feature/<name>` | feature/user-auth |
| 修复分支 | `hotfix/<name>` | hotfix/login-crash |
| 发版分支 | `release/<version>` | release/1.2.0 |

### Tag naming

- 遵循 SemVer：`v<major>.<minor>.<patch>`（如 `v1.2.3`）。
- 预发布：`v1.0.0-alpha.1`, `v1.0.0-beta.2`, `v1.0.0-rc.1`。

---

## 2 HTTP JSON API 规范

### Success response

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe"
  }
}
```

必须包含：`success: true` + `data` 对象。

### Error response

```json
{
  "success": false,
  "code": 10001,
  "message": "Parameter error",
  "errors": [
    { "message": "Name is required", "field": "name" }
  ]
}
```

必须包含：`success: false` + `code` + `message`。可选 `errors` 数组。

### Pagination

请求参数：
```json
{ "currentPage": 1, "pageSize": 10 }
```

- `currentPage` 从 1 开始。
- `pageSize` 必须 > 0。

响应格式：
```json
{
  "success": true,
  "data": [...],
  "paginator": {
    "page": 1,
    "pageSize": 10,
    "total": 100
  }
}
```

### API endpoint conventions

- 使用专属子域名或子路径：`api.example.com/users` 或 `example.com/api/users`。
- 不需要 `.json` 后缀。
- RESTful 风格：资源用名词复数，动作用 HTTP 方法。

---

## 3 文档通用规约

### 强制 rules

- 中英文之间需要增加空格：`使用 Vue 框架` 而非 `使用Vue框架`。
- 中文与数字之间增加空格：`版本 3.0` 而非 `版本3.0`。
- 全角标点与其他字符之间不加空格。
- 半角标点与其他字符之间需要增加空格。
- 中文标点使用全角。
- 英文和数字使用半角。
- 正确拼写英文专有词汇：`JavaScript`、`GitHub`、`macOS`。

```markdown
// bad
欢迎使用Vue3.0框架,请参考GitHub文档。

// good
欢迎使用 Vue 3.0 框架，请参考 GitHub 文档。
```

### 推荐 rules

- 链接文字前后不需要增加空格。
- 正确使用引号（中文用「」，英文用 ""）。
- 正确使用省略号（中文用 `……`，英文用 `...`）。

---

## 4 Changelog 规约

### Mandatory

- 文件必须取名为 `CHANGELOG.md`。
- 必须使用标准 Markdown 语法。
- 必须存放在项目根目录。
- 标题使用固定文案「更新日志」（国际化用 "Change Log"）。
- 按版本号降序排列，最新版本在最前面。
- 版本号遵循 SemVer 规范。
- 更新日期使用 `yyyy-MM-dd` 格式。

### Format

```markdown
# 更新日志

## [1.2.0](compare-url) (2026-05-19)

### 新增
- 新增用户权限管理功能。

### 修复
- 修复登录页面样式问题。

### 优化
- 优化列表加载性能。
```

### Type categories

| Type | Description |
|------|-------------|
| 新增 / Added | 新功能 |
| 修复 / Fixed | Bug 修复 |
| 优化 / Improved | 性能或体验优化 |
| 废弃 / Deprecated | 即将移除的功能 |
| 移除 / Removed | 已移除的功能 |
| 破坏性变更 / Breaking Changes | 不兼容的变更 |

## P - Process

### Auto-apply
- When writing commits: follow conventional commits format.
- When designing APIs: follow JSON envelope pattern.
- When writing docs: follow typography rules.
- When maintaining changelogs: follow the format above.

### Query
When user asks about a specific rule:
1. State the section (Git / API / 文档 / Changelog).
2. State the level: 强制 / 推荐.
3. Provide explanation and examples.

## O - Output

- **Auto-apply**: Output is compliant, no extra commentary.
- **Query**: Section + level + explanation + examples.

## References

| Source | Content |
|--------|---------|
| f2e-spec/docs/engineering/git.zh.md | Git 规约完整版 |
| f2e-spec/docs/engineering/http-json-api.zh.md | HTTP JSON API 规范完整版 |
| f2e-spec/docs/engineering/writing.zh.md | 文档通用规约完整版 |
| f2e-spec/docs/engineering/changelog.zh.md | 更新日志规约完整版 |
