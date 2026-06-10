---
name: python-exception-logging
description: Python 异常处理与日志规范，包含异常层次设计、日志配置、结构化日志、错误码体系。Use when handling exceptions, configuring logging, or designing error handling strategies.
---

# 异常与日志

## 四、异常与日志

### (一) 异常层次设计

1.【强制】 定义项目级基础异常类，所有自定义异常继承自该基类。
正例：
```python
class AppError(Exception):
    """应用基础异常。"""
    def __init__(self, message: str, code: str = "INTERNAL_ERROR", status_code: int = 500):
        self.message = message
        self.code = code
        self.status_code = status_code
        super().__init__(message)

class NotFoundError(AppError):
    def __init__(self, resource: str, resource_id: str):
        super().__init__(
            message=f"{resource} with id '{resource_id}' not found",
            code="NOT_FOUND",
            status_code=404,
        )

class ValidationError(AppError):
    def __init__(self, message: str):
        super().__init__(message=message, code="VALIDATION_ERROR", status_code=400)
```

2.【强制】 禁止直接抛出裸 `Exception` 或 `raise Exception("something")`，必须使用有业务含义的自定义异常。
反例：`raise Exception("用户不存在")`
正例：`raise NotFoundError("User", user_id)`

3.【强制】 异常类名以 `Error` 或 `Exception` 结尾，语义清晰。

4.【推荐】 按业务领域组织异常层次：
```python
# 领域异常
class DomainError(AppError): ...
class InsufficientBalanceError(DomainError): ...

# 基础设施异常
class InfrastructureError(AppError): ...
class DatabaseConnectionError(InfrastructureError): ...
class ExternalServiceError(InfrastructureError): ...
```

### (二) 异常处理

1.【强制】 能通过前置条件检查规避的异常，必须用 `if` 判断，而非 `try/except`。
正例：
```python
if user is not None:
    process(user)
```
反例：
```python
try:
    process(user)
except AttributeError:
    pass
```

2.【强制】 `except` 必须指定具体的异常类型，禁止使用裸 `except:` 或 `except Exception:`（除非在最外层兜底）。
正例：`except ValueError:`
反例：`except:` / `except Exception:`

3.【强制】 捕获异常后必须处理，禁止空 `except` 块。如不处理则向上抛出。
反例：
```python
try:
    result = do_something()
except ValueError:
    pass  # 吞掉异常
```

4.【强制】 在 `except` 中重新抛出异常时使用 `raise` 而非 `raise e`，保留完整堆栈。
正例：
```python
try:
    result = risky_operation()
except ValueError:
    log_error("Value error occurred")
    raise  # 保留原始堆栈
```
反例：
```python
try:
    result = risky_operation()
except ValueError as e:
    raise e  # 丢失堆栈
```

5.【强制】 使用 `try/except/else/finally` 完整结构。`else` 放置无异常时的逻辑，`finally` 确保资源释放。
正例：
```python
try:
    result = risky_operation()
except ValueError as e:
    handle_error(e)
else:
    process_result(result)
finally:
    cleanup()
```

6.【推荐】 异常链：捕获低级异常后抛出高级异常时，使用 `raise ... from e` 保留因果链。
正例：
```python
try:
    data = json.loads(raw_text)
except json.JSONDecodeError as e:
    raise ValidationError(f"Invalid JSON: {e}") from e
```

7.【推荐】 使用上下文管理器或 `contextlib.suppress` 处理预期中可忽略的异常。
正例：
```python
from contextlib import suppress

with suppress(FileNotFoundError):
    os.remove(temp_file)
```

### (三) 错误码体系

1.【推荐】 采用 5 位字符串错误码：来源（1 位）+ 编号（4 位）。
- A：用户端错误（参数错误、权限不足等）
- B：系统端错误（业务逻辑错误、程序错误等）
- C：第三方服务错误（外部 API、中间件等）

2.【推荐】 定义一级宏观错误码：
- `A0001`：用户端错误
- `B0001`：系统执行出错
- `C0001`：调用第三方服务出错

3.【推荐】 错误码不直接展示给用户，通过错误码映射用户友好提示。
正例：
```python
ERROR_MESSAGES = {
    "A0101": "用户名已存在",
    "A0210": "密码错误",
    "B0001": "系统繁忙，请稍后重试",
}
```

4.【参考】 正常返回使用 `00000`。

### (四) 日志框架

1.【强制】 使用 Python 标准库 `logging` 模块，或基于它的封装（如 `structlog`）。禁止直接使用 `print()` 输出日志信息。

2.【强制】 日志级别使用规范：
| 级别 | 使用场景 |
|------|----------|
| DEBUG | 开发调试信息，生产环境关闭 |
| INFO | 关键业务流程节点（用户登录、订单创建等） |
| WARNING | 可恢复的异常情况（重试成功、降级处理等） |
| ERROR | 需要关注的错误（业务异常、外部调用失败等） |
| CRITICAL | 系统级故障（数据库不可用、磁盘满等） |

3.【强制】 生产环境禁止使用 `print()` 输出调试信息。

4.【强制】 日志必须包含上下文信息：时间戳、级别、模块名、请求 ID（Web 应用）。
正例：
```python
import logging

logger = logging.getLogger(__name__)

logger.info("User logged in", extra={"user_id": user.id, "ip": request.client_ip})
```

5.【强制】 字符串拼接使用延迟格式化（`%s` 或 f-string 参数），不使用提前拼接。
正例：`logger.info("Processing order %s", order_id)`
反例：`logger.info("Processing order " + str(order_id))`

6.【强制】 敏感信息必须脱敏：密码、身份证号、银行卡号、Token 等。
正例：`logger.info("User authenticated: phone=%s", mask_phone(phone))`

### (五) 日志配置

1.【强制】 日志文件至少保存 15 天。关键业务日志（交易、安全事件）保存不少于 6 个月。

2.【强制】 使用 `dictConfig` 或 `fileConfig` 统一配置日志，禁止在每个模块中单独配置。
正例（`pyproject.toml` 或 `logging.conf`）：
```python
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "json": {
            "format": '{"time":"%(asctime)s","level":"%(levelname)s","module":"%(name)s","message":"%(message)s"}',
        },
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "json",
        },
        "file": {
            "class": "logging.handlers.RotatingFileHandler",
            "filename": "app.log",
            "maxBytes": 10485760,  # 10MB
            "backupCount": 15,
            "formatter": "json",
        },
    },
    "root": {
        "level": "INFO",
        "handlers": ["console", "file"],
    },
}
```

3.【推荐】 生产环境使用结构化日志（JSON 格式），便于 ELK/Loki 等日志系统采集和分析。

4.【推荐】 Web 应用每个请求生成唯一 `request_id`，贯穿所有日志。
正例：
```python
import uuid
import contextvars

request_id_var: contextvars.ContextVar[str] = contextvars.ContextVar("request_id", default="")

# 中间件中设置
request_id_var.set(str(uuid.uuid4()))
```

5.【推荐】 使用 `structlog` 实现结构化日志，配合标准库 `logging` 输出。
正例：
```python
import structlog

logger = structlog.get_logger()
logger.info("order_created", order_id="12345", amount=99.9, currency="CNY")
```

6.【参考】 第三方库的日志级别应在配置中单独设置，避免过多无意义输出。
正例：
```python
LOGGING["loggers"] = {
    "urllib3": {"level": "WARNING"},
    "sqlalchemy.engine": {"level": "WARNING"},
}
```
