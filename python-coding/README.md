# python-coding — Python 开发规范技能集

基于 PEP 8 与社区最佳实践整理的 Claude Code 技能集，覆盖 Python 项目从编码到架构的八大维度。目标版本：Python 3.9+。

---

## 技能一览

### python-coding-standards

| 项 | 内容 |
|----|------|
| **触发场景** | 编写 Python 代码、Code Review |
| **基础** | PEP 8 + Google Python Style Guide + 社区最佳实践 |

**核心覆盖**：
- **命名风格**：模块/包 snake_case；类名 PascalCase；函数/变量 snake_case；常量 UPPER_SNAKE_CASE；私有成员单下划线；布尔变量 `is_`/`has_`/`can_` 前缀；各层命名规约
- **代码格式**：4 空格缩进（禁止 Tab）；行宽 120；import 排序（标准库→三方→本地，isort 规范）；禁止 `import *`；Black/Ruff 自动格式化
- **Pythonic 惯用法**：`enumerate` 替代 `range(len())`；列表/字典推导；`with` 管理资源；`pathlib` 替代 `os.path`；f-string；`dataclass`；海象运算符
- **迭代器与生成器**：生成器替代大列表；`yield from` 委托；`itertools` 常用模式
- **注释与文档字符串**：Google 风格 docstring；行内注释用 `#`；禁止注释掉的代码；type hints 覆盖的类型不重复
- **现代化语法（3.9+）**：内置泛型 `list[str]`；`dict |` 合并；`str.removeprefix/removesuffix`；`match/case`（3.10+）

---

### python-type-hints

| 项 | 内容 |
|----|------|
| **触发场景** | 编写类型注解、配置 mypy、设计类型安全的 API |
| **基础** | PEP 484 / 526 / 612 / 613 + mypy + Pydantic |

**核心覆盖**：
- **类型注解基础**：公开函数必须标注参数和返回值；`-> None` / `NoReturn`；类属性标注；`Final` / `TypeAlias`
- **容器与集合类型**：容器必须包含元素类型；`Sequence` / `Mapping` 等抽象容器；固定长度 tuple 类型标注
- **可选与联合类型**：`X | None` 替代 `Optional`；`X | Y` 替代 `Union`；`@overload` 区分签名
- **泛型与 TypeVar**：`TypeVar` 关联输入输出类型；`bound` 限制范围；`Protocol` 结构化子类型
- **回调类型**：`Callable` 标注；复杂回调使用 `Protocol`
- **mypy 配置**：`strict = true`；精确 `# type: ignore[xxx]`；补充类型桩
- **Pydantic 模型**：`BaseModel` 数据验证；区分 Create/Update/Response 模型；`Field` 约束；`model_validator`

---

### python-design-standards

| 项 | 内容 |
|----|------|
| **触发场景** | 项目架构设计、模块组织、依赖管理 |
| **基础** | SOLID 原则 + Python 设计模式 + 分层架构 |

**核心覆盖**：
- **设计原则**：单一职责（SRP）；组合优于继承；依赖倒置（Protocol/ABC）；不可变数据对象（`frozen=True`）；DRY 原则
- **常用设计模式**：工厂模式（工厂函数）；策略模式（Protocol）；装饰器模式（缓存/重试/权限）；上下文管理器；观察者模式
- **项目分层架构**：领域层（实体/仓储接口）→ 应用层（用例/DTO）→ 基础设施层（实现）→ 表现层（API/CLI）；依赖方向控制
- **模块与包组织**：按功能/领域组织包（非按类型）；模块不超过 500 行；`__init__.py` 控制 public API
- **依赖管理**：`pyproject.toml` 统一配置；锁定依赖版本；区分运行时/开发/测试依赖
- **配置管理**：Pydantic `BaseSettings`；环境变量优先；启动时验证配置完整性

---

### python-exception-logging

| 项 | 内容 |
|----|------|
| **触发场景** | 异常处理、日志配置、错误码设计 |
| **基础** | Python logging + structlog + 自定义异常层次 |

**核心覆盖**：
- **异常层次设计**：项目级基础异常类；按业务领域组织异常；禁止裸 `Exception`
- **异常处理**：前置条件检查优于 try/except；指定具体异常类型；禁止空 except 块；`raise` 保留堆栈；`raise ... from e` 异常链；`contextlib.suppress`
- **错误码体系**：5 位字符串（A/B/C + 4 位编号）；一级宏观错误码；错误码不直接展示给用户
- **日志框架**：标准库 `logging` 或 `structlog`；日志级别规范；延迟格式化；敏感信息脱敏
- **日志配置**：日志文件至少 15 天；结构化日志（JSON）；请求 ID 贯穿；第三方库日志级别控制

---

### python-database

| 项 | 内容 |
|----|------|
| **触发场景** | 数据库设计、SQL 编写、ORM 配置 |
| **基础** | 通用 SQL 原则 + SQLAlchemy 2.0 + Django ORM |

**核心覆盖**：
- **通用原则**：参数化查询防注入；禁止 `SELECT *`；批量操作；分页查询；乐观锁
- **建表规约**：表名 snake_case；必备 `id`/`created_at`/`updated_at`；金额用整数（分）；逻辑删除
- **SQLAlchemy 2.0**：新风格 `select()`/`insert()`；`DeclarativeBase` + `Mapped[]`；`relationship` 避免N+1；`AsyncSession` 异步支持
- **Django ORM**：`select_related`/`prefetch_related` 优化；`values()`/`values_list()`；`Q`/`F` 表达式；`bulk_create`/`bulk_update`
- **连接池管理**：配置 `pool_size`/`max_overflow`/`pool_pre_ping`；应用关闭时释放
- **迁移管理**：Alembic/Django Migrations；迁移可回滚；数据/结构迁移分离

---

### python-web-api

| 项 | 内容 |
|----|------|
| **触发场景** | Web API 开发、RESTful 设计、框架选型 |
| **基础** | FastAPI + Django REST Framework + Flask 最佳实践 |

**核心覆盖**：
- **RESTful API 设计**：复数名词路径；标准 HTTP 方法；统一信封响应；分页元数据；空列表返回 `[]`
- **FastAPI**：`APIRouter` 分组路由；`response_model` 文档化；`Depends` 依赖注入；`lifespan` 生命周期；`BackgroundTasks` 异步任务
- **Django**：DRF `ViewSet` + `Router`；`Serializer` 验证；`django-filter`；`drf-spectacular` OpenAPI
- **Flask**：`Blueprint` 模块化；`flask-pydantic`/`marshmallow` 验证；应用工厂模式
- **数据验证**：Pydantic 模型验证；路径/查询参数类型约束；文件上传类型/大小校验；分页参数上限保护
- **中间件**：请求日志；全局异常处理；请求 ID；CORS；限流
- **异步处理**：`async def` 路由；`BackgroundTasks`；Celery/ARQ 任务队列

---

### python-security-standards

| 项 | 内容 |
|----|------|
| **触发场景** | 安全功能实现、渗透测试修复 |
| **基础** | OWASP Top 10 + Python 安全最佳实践 |

**核心覆盖**：
- **输入校验**：Pydantic 统一验证；防超限参数；排序字段白名单；防路径遍历
- **SQL 注入防护**：参数化查询或 ORM；禁止字符串拼接 SQL
- **XSS 防护**：输出转义；`Content-Security-Policy`；JSON 响应头
- **认证与授权**：`bcrypt`/`argon2` 密码哈希；JWT Token 管理；防暴力破解；RBAC/ABAC 权限
- **密钥管理**：禁止硬编码；环境变量注入；`.env` 不提交；启动时验证；定期轮换
- **文件安全**：文件类型魔数验证；UUID 重命名；专用存储目录
- **依赖安全**：`pip audit`/`safety` 检查漏洞；锁定依赖版本
- **其他**：HTTPS 强制；安全响应头；日志脱敏；`secrets` 模块生成安全随机数

---

### python-unit-testing

| 项 | 内容 |
|----|------|
| **触发场景** | 编写单元测试、测试评审、CI 配置 |
| **基础** | pytest 生态 + 测试最佳实践 |

**核心覆盖**：
- **AIR 原则**：Automatic（自动化）、Independent（独立性）、Repeatable（可重复）
- **测试框架**：pytest + 插件生态（cov/asyncio/mock/xdist）
- **测试分层**：`@pytest.mark.unit` / `@pytest.mark.integration` / `@pytest.mark.slow`；`tests/unit/` + `tests/integration/`
- **Fixtures 设计**：`conftest.py` 管理；`yield` 清理；作用域选择
- **Mock 策略**：仅 Mock 外部依赖；验证调用参数/次数；`responses`/`respx` Mock HTTP
- **参数化测试**：`@pytest.mark.parametrize`；`pytest.raises` 异常测试；边界条件
- **覆盖率**：语句覆盖率 80%；核心模块 90%+；CI 强制检查
- **BCDE 原则**：Border（边界值）、Correct（正确输入）、Design（结合设计）、Error（异常输入）
- **测试数据**：`factory_boy` 工厂；数据标识便于清理；`testcontainers-python` 集成测试

---

## 默认约定（Python 全链路共享）

| 项 | 约定 |
|----|------|
| 缩进 | 4 个空格（禁止 Tab） |
| 字符集 | UTF-8 |
| 换行符 | Unix 格式（LF） |
| 行宽 | 120 字符 |
| 模块/包名 | snake_case |
| 类名 | PascalCase |
| 函数/变量 | snake_case |
| 常量 | UPPER_SNAKE_CASE |
| Python 版本 | 3.9+ |

---

## 查询示例

> "Python 命名风格" → 返回 snake_case/PascalCase/UPPER_SNAKE_CASE 规范
>
> "类型注解 Optional" → 返回使用 `X | None` 替代 `Optional[X]` 的说明
>
> "SQLAlchemy N+1" → 返回 `relationship(lazy="selectin")` 规范
>
> "FastAPI 依赖注入" → 返回 `Depends()` 使用规范
>
> "pytest 参数化" → 返回 `@pytest.mark.parametrize` 用法
