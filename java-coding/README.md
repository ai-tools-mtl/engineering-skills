# java-coding — 阿里巴巴 Java 开发手册

基于《阿里巴巴 Java 开发手册》整理的 Claude Code 技能集，覆盖 Java 项目从编码到架构的七大维度。

---

## 技能一览

| 技能 | 触发场景 | 核心覆盖 |
|------|---------|---------|
| **[java-coding-standards](./java-coding-standards)** | 编写 Java 代码、Code Review | 命名风格（UpperCamelCase/lowerCamelCase/常量全大写）；OOP 规约（`equals`/`hashCode`、包装类型、BigDecimal）；集合处理（`isEmpty`、diamond、toArray(T[0])）；并发处理（线程池、ThreadLocal、锁粒度）；控制语句（卫语句、三目 NPE）；注释规约（Javadoc、TODO/FIXME） |
| **[java-design-standards](./java-design-standards)** | 架构设计、技术评审、画 UML | 设计图规范（状态图 >3 状态、时序图 >3 对象、类图 >5 类）；SOLID 原则；DRY 与可扩展性；错误码体系（A/B/C 三级） |
| **[java-exception-logging](./java-exception-logging)** | 异常处理、日志配置、错误码设计 | 错误码规范（5 位字符串、A/B/C 来源分级）；异常处理（禁止空 catch、finally 禁止 return、事务回滚）；日志规约（SLF4J、占位符、15 天保留、敏感信息脱敏） |
| **[java-mysql-database](./java-mysql-database)** | 数据库设计、SQL 编写、ORM 配置 | 建表规约（`is_xxx` 布尔字段、逻辑删除、三字段必备）；索引规约（唯一索引、覆盖索引、延迟关联）；SQL 规范（`count(*)`、`ISNULL()`、禁止外键级联）；ORM 映射（`#{}` 防注入、`resultMap`） |
| **[java-project-structure](./java-project-structure)** | 项目分层、依赖管理、服务器配置 | 应用分层（API / Web / Service / Manager / DAO）；领域模型（DO/DTO/BO/VO/Query）；二方库规范（GAV、SNAPSHOT 禁用、版本统一变量）；服务器调优（TCP time_wait、fd 限制、JVM dump） |
| **[java-security-standards](./java-security-standards)** | 安全功能实现、渗透测试修复 | 权限控制、参数校验、SQL 注入防护；敏感信息脱敏、配置文件密码加密；XSS 过滤、CSRF 验证、防重放、文件上传管控 |
| **[java-unit-testing](./java-unit-testing)** | 编写单元测试、测试评审 | AIR 原则（Automatic / Independent / Repeatable）；BCDE 原则（Border / Correct / Design / Error）；核心模块 100% 语句+分支覆盖；数据库测试回滚 |

---

## 默认约定（Java 全链路共享）

| 项 | 约定 |
|----|------|
| 缩进 | 4 个空格（禁止 Tab） |
| 字符集 | UTF-8 |
| 换行符 | Unix 格式（LF） |
| 行宽 | 120 字符 |
| 类名 | UpperCamelCase |
| 方法/变量 | lowerCamelCase |
| 常量 | 全大写，下划线分隔 |

---

## 查询示例

> "Java 集合第 9 条" → 返回 `toArray(T[0])` 的详细说明与性能分析
>
> "并发处理线程池强制规则" → 返回 `ThreadPoolExecutor` 规范与 `Executors` 禁用原因
