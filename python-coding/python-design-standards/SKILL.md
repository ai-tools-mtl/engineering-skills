---
name: python-design-standards
description: Python 设计原则与项目结构规范，包含 SOLID 原则、设计模式、分层架构、模块组织、依赖管理。Use when designing Python project architecture, organizing modules, or making design decisions.
---

# 设计规约与项目结构

## 三、设计规约与项目结构

### (一) 设计原则

1.【强制】 遵循单一职责原则（SRP），一个模块/类/函数只做一件事。
说明：Python 的模块系统天然鼓励小文件，每个模块聚焦一个功能域。
正例：`user_repository.py` 只负责用户数据存取，不包含邮件发送逻辑。

2.【强制】 使用组合而非继承。Python 支持多继承（mixin），但优先使用组合和委托。
说明：继承是紧耦合，组合是松耦合。MixIn 在 Python 中有合理使用场景，但应限于无状态的横切关注点。
正例：
```python
# 组合
class NotificationService:
    def __init__(self, email_sender: EmailSender, sms_sender: SmsSender):
        self.email_sender = email_sender
        self.sms_sender = sms_sender
```
反例：
```python
# 过度继承
class NotificationService(EmailSender, SmsSender, LoggerMixin):
    pass
```

3.【强制】 依赖倒置：高层模块不依赖低层模块，两者都依赖抽象。
说明：Python 中使用 `Protocol` 或 `ABC` 定义抽象。
正例：
```python
from abc import ABC, abstractmethod

class UserRepository(ABC):
    @abstractmethod
    def get_by_id(self, user_id: int) -> User | None: ...

class UserService:
    def __init__(self, repo: UserRepository):
        self.repo = repo  # 依赖抽象
```

4.【推荐】 使用 `@dataclass(frozen=True)` 或 `@dataclass` 创建不可变数据对象，避免意外修改。
正例：
```python
from dataclasses import dataclass

@dataclass(frozen=True)
class Money:
    amount: int  # 最小货币单位（分）
    currency: str
```

5.【推荐】 遵循 DRY 原则（Don't Repeat Yourself），抽取公共逻辑为工具函数或基类。
说明：当同一段逻辑出现 3 次以上时，必须抽取。

6.【推荐】 避免过早抽象。两次重复可容忍，三次重复才抽取。
说明：Python 的装饰器、上下文管理器是消除重复的利器。

### (二) 常用设计模式

1.【推荐】 工厂模式：使用工厂函数替代复杂构造逻辑。
正例：
```python
def create_connection(config: dict) -> DatabaseConnection:
    if config["driver"] == "postgresql":
        return PostgresConnection(config)
    return SqliteConnection(config)
```

2.【推荐】 策略模式：使用函数或类实现可替换策略。
正例：
```python
from typing import Protocol

class PricingStrategy(Protocol):
    def calculate(self, base_price: float) -> float: ...

def apply_pricing(price: float, strategy: PricingStrategy) -> float:
    return strategy.calculate(price)
```

3.【推荐】 装饰器模式：使用 Python 装饰器实现横切关注点（缓存、重试、权限检查）。
正例：
```python
import functools
import time

def retry(max_attempts: int = 3, delay: float = 1.0):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except Exception:
                    if attempt == max_attempts - 1:
                        raise
                    time.sleep(delay)
        return wrapper
    return decorator
```

4.【推荐】 上下文管理器模式：使用 `contextlib.contextmanager` 管理资源。
正例：
```python
from contextlib import contextmanager

@contextmanager
def db_transaction(session):
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
```

5.【推荐】 观察者模式：使用事件系统或信号机制解耦组件。

6.【参考】 单例模式：Python 中使用模块级变量或 `__new__` 实现，但优先考虑依赖注入。

### (三) 项目分层架构

1.【强制】 项目必须采用分层架构，至少包含以下层次：
```
项目结构：
├── domain/           # 领域层：实体、值对象、领域服务
│   ├── models.py
│   ├── repositories.py  # 仓储接口（Protocol/ABC）
│   └── services.py      # 领域服务
├── application/      # 应用层：用例、应用服务
│   ├── use_cases.py
│   └── dto.py        # 数据传输对象
├── infrastructure/   # 基础设施层：数据库、外部服务实现
│   ├── database.py
│   ├── repositories.py  # 仓储实现
│   └── external.py
├── presentation/     # 表现层：API、CLI、UI
│   ├── api/
│   └── cli/
└── config/           # 配置层
    └── settings.py
```

2.【强制】 依赖方向：表现层 → 应用层 → 领域层 ← 基础设施层。
说明：领域层不依赖任何外部层。基础设施层实现领域层定义的接口。

3.【强制】 禁止跨层直接调用。上层通过接口（Protocol/ABC）调用下层。

4.【推荐】 使用依赖注入容器（如 `dependency-injector`）或 FastAPI 的 `Depends` 管理依赖。

### (四) 模块与包组织

1.【强制】 每个包必须有 `__init__.py`（可以为空），明确标识 Python 包。
说明：虽然 Python 3.3+ 支持隐式命名空间包，但显式 `__init__.py` 更清晰。

2.【强制】 模块文件大小不超过 500 行。超过时应拆分为多个模块。
说明：Python 的模块系统比 Java 的类文件更灵活，充分利用它。

3.【推荐】 按功能/领域组织包，而非按类型。
正例：
```
# 按功能组织
users/
├── models.py
├── service.py
├── repository.py
└── router.py
orders/
├── models.py
├── service.py
├── repository.py
└── router.py
```
反例：
```
# 按类型组织
models/
├── user.py
├── order.py
services/
├── user.py
├── order.py
```

4.【推荐】 使用 `__init__.py` 控制 public API，通过 `__all__` 列表导出。
正例：
```python
# users/__init__.py
from .models import User, UserCreate, UserResponse
from .service import UserService

__all__ = ["User", "UserCreate", "UserResponse", "UserService"]
```

5.【推荐】 工具函数放在 `utils/` 包下，按功能分文件（如 `date_utils.py`、`string_utils.py`）。

### (五) 依赖管理

1.【强制】 使用 `pyproject.toml` 作为项目配置的统一入口（PEP 517/518）。

2.【强制】 锁定依赖版本。使用 `poetry.lock` 或 `requirements.lock` / `pdm.lock`。
说明：禁止使用不带版本锁定的 `requirements.txt` 部署到生产环境。

3.【强制】 区分依赖分组：
- `[project.dependencies]`：运行时依赖
- `[project.optional-dependencies]`：可选依赖（dev / test / docs）

4.【推荐】 虚拟环境管理工具选择：
- `poetry`：功能全面，适合应用项目
- `pdm`：PEP 标准兼容，速度快
- `uv`：Rust 实现，极快，适合新项目
- `pip + venv`：最基础，适合简单场景

5.【推荐】 使用 `pip-tools` 或 `poetry` 生成确定性的生产依赖。

6.【参考】 避免在运行时动态安装包（`subprocess.run(["pip", "install", ...])`）。

### (六) 配置管理

1.【强制】 使用环境变量或 `.env` 文件管理敏感配置（数据库密码、API 密钥），禁止硬编码。

2.【强制】 使用类型化的配置类（Pydantic `BaseSettings`），启动时验证配置完整性。
正例：
```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str
    secret_key: str
    debug: bool = False

    model_config = {"env_file": ".env"}

settings = Settings()  # 启动时自动验证
```

3.【推荐】 配置优先级：环境变量 > .env 文件 > 默认值。

4.【推荐】 使用 `python-dotenv` 或 `pydantic-settings` 加载 `.env`。
