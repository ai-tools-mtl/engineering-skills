---
name: python-type-hints
description: Python 类型系统规范，包含类型注解、mypy 配置、Pydantic 模型、泛型、Protocol、TypeVar 等。Use when writing type hints, configuring mypy, designing typed APIs, or building Pydantic models.
---

# 类型系统

## 二、类型系统

### (一) 类型注解基础

1.【强制】 所有公开函数和方法必须添加类型注解（参数 + 返回值）。
正例：
```python
def get_user(user_id: int) -> User | None:
    ...
```
反例：
```python
def get_user(user_id):
    ...
```

2.【强制】 使用 `-> None` 显式标注无返回值的函数。
正例：`def save(data: dict) -> None:`

3.【强制】 使用 `-> Never`（Python 3.11+）或 `NoReturn` 标注不会正常返回的函数（如抛异常或死循环）。
正例：
```python
from typing import NoReturn

def raise_error(msg: str) -> NoReturn:
    raise ValueError(msg)
```

4.【强制】 类属性必须标注类型。
正例：
```python
class User:
    name: str
    age: int
    email: str | None = None
```

5.【推荐】 使用 `Final` 标注不应重新赋值的变量。
正例：
```python
from typing import Final

MAX_SIZE: Final[int] = 100
API_BASE_URL: Final[str] = "https://api.example.com"
```

6.【推荐】 使用 `TypeAlias` 定义类型别名，提升可读性。
正例：
```python
from typing import TypeAlias

UserId: TypeAlias = int
JsonDict: TypeAlias = dict[str, Any]
```

### (二) 容器与集合类型

1.【强制】 容器类型注解必须包含元素类型。
正例：`names: list[str]` / `scores: dict[str, int]` / `unique_ids: set[int]`
反例：`names: list` / `scores: dict` / `unique_ids: set`

2.【推荐】 不可变容器使用 `tuple` / `frozenset` 类型注解，与可变容器区分。
正例：
```python
def get_coordinates() -> tuple[float, float]:
    return (latitude, longitude)

IMMUTABLE_TAGS: frozenset[str] = frozenset({"python", "typing"})
```

3.【推荐】 使用 `Sequence` / `Mapping` / `Iterable` 等抽象容器类型作为函数参数，提高灵活性。
正例：
```python
from collections.abc import Sequence

def get_first(items: Sequence[str]) -> str | None:
    return items[0] if items else None
```

4.【推荐】 固定长度的 tuple 使用 `tuple[int, str, float]` 标注每个位置的类型。
说明：`tuple[int, ...]` 表示可变长度的同质元组。

### (三) 可选类型与联合类型

1.【强制】 表示可能为 `None` 的值使用 `X | None`（Python 3.10+），不使用 `Optional[X]`。
正例：`def find_user(name: str) -> User | None:`
反例：`def find_user(name: str) -> Optional[User]:`

2.【强制】 多种可能类型使用 `X | Y | Z`（Python 3.10+），不使用 `Union[X, Y, Z]`。
正例：`def parse(value: str) -> int | float:`
反例：`def parse(value: str) -> Union[int, float]:`

3.【推荐】 使用 `@overload` 区分不同参数类型对应不同返回值的场景。
正例：
```python
from typing import overload

@overload
def process(data: str) -> str: ...
@overload
def process(data: bytes) -> str: ...

def process(data: str | bytes) -> str:
    if isinstance(data, bytes):
        return data.decode("utf-8")
    return data
```

### (四) 泛型与 TypeVar

1.【推荐】 使用 `TypeVar` 定义泛型类型变量，保持函数的输入输出类型关联。
正例：
```python
from typing import TypeVar

T = TypeVar("T")

def first(items: list[T]) -> T:
    return items[0]
```

2.【推荐】 使用 `bound` 限制 TypeVar 的范围。
正例：
```python
from typing import TypeVar

T = TypeVar("T", bound="BaseModel")

def serialize(model: T) -> dict:
    return model.model_dump()
```

3.【推荐】 使用 `Protocol` 定义结构化子类型（鸭子类型的类型安全版本）。
正例：
```python
from typing import Protocol

class Closeable(Protocol):
    def close(self) -> None: ...

def cleanup(resource: Closeable) -> None:
    resource.close()
```

4.【推荐】 Python 3.12+ 使用 `type` 语句定义类型别名，使用新语法定义泛型。
正例（Python 3.12+）：
```python
type Vector = list[float]

def first[T](items: list[T]) -> T:
    return items[0]
```

### (五) 回调与可调用类型

1.【推荐】 使用 `Callable` 或 `Protocol` 标注回调函数类型。
正例：
```python
from collections.abc import Callable

def retry(fn: Callable[[], str], max_attempts: int = 3) -> str:
    ...
```

2.【推荐】 复杂回调使用 `Protocol` 定义签名，提高可读性。
正例：
```python
from typing import Protocol

class EventHandler(Protocol):
    def __call__(self, event: dict) -> None: ...
```

### (六) mypy 配置与使用

1.【强制】 项目必须配置 mypy（或 pyright），推荐在 `pyproject.toml` 中配置。
正例：
```toml
[tool.mypy]
python_version = "3.9"
strict = true
warn_return_any = true
warn_unused_configs = true
disallow_untyped_defs = true
```

2.【强制】 CI 流水线中必须包含 mypy 类型检查步骤。

3.【推荐】 使用 `# type: ignore[xxx]` 精确忽略特定错误，不使用裸 `# type: ignore`。
正例：`result = json.loads(data)  # type: ignore[arg-type]`
反例：`result = json.loads(data)  # type: ignore`

4.【推荐】 第三方库缺少类型桩时，在项目 `stubs/` 目录中补充，或使用 `types-xxx` 包。

### (七) Pydantic 模型

1.【强制】 使用 Pydantic `BaseModel` 定义数据验证模型，替代手写 `__init__` + 验证逻辑。
正例：
```python
from pydantic import BaseModel, EmailStr, Field

class UserCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    age: int = Field(..., ge=0, le=150)
```

2.【强制】 API 请求/响应模型使用 Pydantic，禁止使用裸 `dict` 接收请求体。

3.【推荐】 使用 `model_config` 配置模型行为。
正例：
```python
from pydantic import BaseModel, ConfigDict

class User(BaseModel):
    model_config = ConfigDict(from_attributes=True)  # 支持 ORM 对象转换

    id: int
    name: str
```

4.【推荐】 使用 `Field` 添加字段约束和描述。
正例：
```python
price: float = Field(..., gt=0, description="商品单价，单位：元")
```

5.【推荐】 区分输入模型（`Create` / `Update`）和输出模型（`Response`），避免使用同一个模型。
正例：
```python
class UserCreate(BaseModel):
    name: str
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    # 不包含 password

class UserUpdate(BaseModel):
    name: str | None = None
```

6.【参考】 使用 `model_validator` 和 `field_validator` 实现跨字段和单字段的复杂验证。
