---
name: git-atomic-commit-spec
description: Enforces a strict atomic-commit convention whenever the user wants to commit, stage, or push code. Use whenever the user mentions committing, 提交代码, git commit, 帮我提交, 怎么提交, git add, git push, 提交规范, commit message, 拆分提交, 写个提交, 暂存, or asks how to organize their staged changes — even if they don't explicitly say "commit". Splits work into independent, reviewable commits and writes Conventional Commits messages with body/footer.
---

# Git 提交规范

本 skill 在用户准备提交代码时自动生效。目标：把一次性的"全部提交"拆成若干个**原子、可独立回滚、可独立编译测试**的提交，并写出规范的提交信息。

## 核心原则（按优先级）

1. **永不一次性提交全部变更。** 禁止 `git add .`、`git add -A`、`git add *`、`git commit -am`。理由：一次提交混入多个逻辑变更会让回滚、二分定位、代码评审、changelog 生成全部失效。

2. **每个提交是一个完整的逻辑单元。** 判定标准：单独 checkout 这个提交，项目能编译通过、相关测试能跑过、功能自洽。禁止"半成品提交"（例如提交 A 调用一个函数，但该函数在提交 B 才定义）。

3. **按模块/功能边界拆分**，不按文件类型拆分。同一个功能的 controller + service + mapper 是一个提交；同一个文件里两件不相干的事是两个提交。

4. **使用 Conventional Commits 格式**：`type(scope): subject`，外加可选 body 和 footer。

5. **暂存命令必须指定具体路径**：输出 `git add path/to/file`，绝不输出 `git add .`。

6. **跨模块改动按依赖顺序提交**：数据层（migration/entity）→ 服务层 → 接口层 → 展示层 → 文档。

## 完整提交格式

```
<type>(<scope>): <subject>
                          ← 空行
<body>                     ← 可选
                          ← 空行
<footer>                   ← 可选
```

### Header

- **subject**：祈使句、一般现在时、首字母小写、末尾无句号。中文用动宾短语，不加句号。
  - 好：`feat(order): add coupon validation`
  - 好：`fix(iam): 修复并发登录会话覆盖`
  - 坏：`feat: Added login feature.`（时态错 + 大写 + 句号）
- **长度**：header 建议 ≤ 50 字符（中文 ≤ 25 字）。超长说明 scope 没切对，应拆分。
- **scope**：见下方"如何确定 scope"。

### Body（可选，但推荐）

解释 **what 和 why**，不解释 how（diff 已经说明 how）。每行 ≤ 72 字符，空行分段。这是大型项目追溯决策依据的关键。

```
fix(order): 防止并发下单库存超扣

引入基于 Redis 的分布式锁。原因：原乐观锁方案在压测中
失败率超过 30%，且大量重试打满数据库连接池。
```

### Footer（可选）

用于关联单据、标记破坏性变更、署名、回溯来源：

```
Refs: PROJ-1234
Closes #567
```

业务类提交（feat/fix）建议带上单据号；chore/格式化类可豁免。

## Type 清单

| type | 用途 |
|------|------|
| `feat` | 新增功能 |
| `fix` | 修复 bug |
| `refactor` | 重构，不改外部行为 |
| `perf` | 性能优化 |
| `style` | 格式化，不改逻辑（空格、分号、缩进等） |
| `test` | 新增/修改测试 |
| `docs` | 文档 |
| `build` | 构建系统、依赖（pom.xml、package.json、lock 文件） |
| `ci` | CI 配置（pipeline、workflow） |
| `chore` | 其它工程杂项，不影响逻辑 |
| `revert` | 撤销之前的提交 |

## 如何确定 scope

**通用方法：先看改了什么，再归纳边界。**

1. 跑 `git status --porcelain` 拿到所有变更路径。
2. 按顶层业务目录/包名分组（前端常见：`pages/components/services/router`；后端常见业务包名；多模块项目取模块名）。
3. scope 取**最贴近本次改动的那个模块名**，小写、连字符分隔，不加路径分隔符。
   - 例：改了 `services/order/*` → `scope=order`
   - 例：跨了 `pages/order` 和 `pages/payment` 同属订单域 → `scope=order`
4. 纯工程类（改 `pom.xml`、`.eslintrc`、`vite.config.ts`）scope 用 `deps` / `build` / `config` 等中性词。
5. 拿不准时用最贴近业务的目录名，不要用文件名。

## 必须独立拆分的变更

以下几类即使和功能改动在同一批文件里，也要单独成提交——它们污染功能 diff、干扰评审和回滚：

| 变更 | 建议提交 |
|------|---------|
| 代码格式化 / lint 自动修复 | `style: apply prettier/eslint formatting` |
| 依赖版本升级（package.json/pom.xml + lock） | `build(deps): bump xxx to 1.2.3` |
| 配置文件变更（非业务配置） | `chore(config): xxx` |
| 测试用例（与实现不在同一逻辑单元） | `test(scope): xxx` |
| 数据库 migration | 单独提交，且 up/down 都要有（保证灰度可回滚） |
| i18n 文案 | 单独提交（便于翻译流程，不污染功能 diff） |
| API 契约变更（proto/swagger/openapi） | 先于实现提交（契约先行） |
| release 发布点 | `chore(release): v1.2.0`（CHANGELOG 自动生成的锚点） |

## 特殊提交

### Revert

- header 复刻被撤销提交：`revert: feat(order): add coupon logic`
- body 注明撤销原因 + 原 commit hash：
  ```
  This reverts commit abc1234.
  原因：券逻辑在金额计算上有 bug，灰度发现问题，先回退。
  ```

### 破坏性变更（Breaking Change）

二选一：

- footer：`BREAKING CHANGE: order API 的 price 字段单位从分改为元`
- header 后缀 `!`：`feat(api)!: 重构订单返回结构`

### Backport / Cherry-pick

回溯到维护分支的提交，footer 注明来源：`(cherry picked from commit abc1234)`。

## 可编译 / 可测试红线

拆分时，每个提交都应满足：

- **可独立编译**（build 不红）。
- **可独立通过相关单测**——不允许"提交 A 引入失败，提交 B 修复"。
- 若一个完整改动确实无法拆成"每步都绿"，说明耦合度过高，应整体作为一个提交，并在 body 说明。

## 敏感信息红线

**禁止提交**以下内容，没有例外：

- 密钥、token、密码、连接串里的凭据。
- `.env`、`.env.local`、证书、私钥文件。
- 客户数据、生产数据快照。
- 构建产物（`dist/`、`target/`、`*.class`、`node_modules/`）。
- 大二进制文件（模型、视频）——应走 Git LFS。

**误提交处理流程**（发现已提交敏感信息时）：
1. 立即轮换（rotate）泄露的凭证，**这比删历史更重要**。
2. 用 `git filter-repo` 或 BFG 清理历史。
3. 强推前确认无人在共享分支上工作（用 `--force-with-lease`）。

发现疑似敏感信息时，先停下来告知用户，不要默默把它提交。

## 工作流

当用户说"帮我提交"时，按以下步骤：

1. **勘查变更**：运行 `git status --porcelain` 和 `git diff --stat`，弄清有多少类改动。
2. **分组**：按上述"核心原则"和"必须独立拆分"把文件归入若干提交计划。
3. **排序**：跨模块时按"数据 → 服务 → 接口 → 展示 → 文档"排序。
4. **给出分步执行方案**：对每个提交列出
   - 暂存命令（具体路径，如 `git add src/main/java/.../OrderService.java src/main/resources/mapper/OrderMapper.xml`）
   - 对应的完整 commit message（含 body/footer）
5. **敏感信息预检**：在方案前快速扫一眼暂存内容，发现密钥/token/产物立即提醒。
6. **等待用户确认后再执行**，或直接把命令列出来让用户自行执行——视用户意图而定。

## 输出约定

输出一份**分步提交计划**，结构如下：

```
本次变更建议拆为 N 个提交：

提交 1/3 — 数据层
  git add <具体路径>
  git commit -m "type(scope): subject" -m "body" -m "footer"

提交 2/3 — 服务层
  ...

提交 3/3 — 接口层
  ...
```

要点：
- 每个 `git add` 都列具体文件路径，不用 `.` 或 `-A`。
- commit message 用多个 `-m` 分别承载 header / body / footer，方便用户直接复制执行。
- 如果变更已经足够原子（单个逻辑单元），就只给一个提交，不必强行拆分。
- 执行前点明敏感信息预检结果（"已检查，无敏感信息"或具体告警）。
