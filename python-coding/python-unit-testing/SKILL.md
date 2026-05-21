---
name: python-unit-testing
description: Python 单元测试规范，包含 pytest 最佳实践、mock 策略、覆盖率要求、测试分层、 fixtures 设计。Use when writing tests, setting up test infrastructure, or reviewing test quality.
---

# 单元测试

## 八、单元测试

### (一) 基本原则

1.【强制】 测试必须遵守 AIR 原则：
- **A**utomatic（自动化）：测试全自动执行，非交互式
- **I**ndependent（独立性）：测试用例之间互不依赖
- **R**epeatable（可重复）：任何环境、任何时间执行结果一致

2.【强制】 测试必须使用 `assert` 语句验证结果，禁止使用 `print()` + 人眼检查。

3.【强制】 测试用例之间禁止互相调用或依赖执行顺序。

4.【强制】 测试不能依赖外部环境（网络、数据库、文件系统）。依赖外部资源时使用 Mock 或测试容器。

### (二) 测试框架与工具

1.【强制】 使用 `pytest` 作为测试框架，不使用 `unittest`（除非有历史兼容需求）。
正例：
```python
def test_user_creation():
    user = User(name="Alice", age=30)
    assert user.name == "Alice"
    assert user.age == 30
```

2.【强制】 测试文件命名以 `test_` 开头，测试函数命名以 `test_` 开头。测试类以 `Test` 开头。

3.【推荐】 使用 `pytest` 插件生态：
- `pytest-cov`：覆盖率
- `pytest-asyncio`：异步测试
- `pytest-mock`：Mock 封装
- `pytest-xdist`：并行执行
- `pytest-parametrize`：参数化测试（内置）

4.【推荐】 使用 `factory_boy` 或 `model_mommy` 创建测试数据，不手动构造。

### (三) 测试分层

1.【强制】 区分测试层级，使用 `pytest.mark` 标记：
```python
import pytest

@pytest.mark.unit
def test_calculate_price():
    assert calculate_price(100, 0.8) == 80

@pytest.mark.integration
def test_save_user(db_session):
    user = User(name="Alice")
    db_session.add(user)
    db_session.commit()
    assert db_session.query(User).count() == 1

@pytest.mark.slow
def test_external_api_call():
    ...
```

2.【强制】 配置 `pytest.ini` 或 `pyproject.toml` 中的 markers：
```toml
[tool.pytest.ini_options]
markers = [
    "unit: 单元测试",
    "integration: 集成测试",
    "slow: 慢速测试",
]
```

3.【推荐** 测试目录结构：
```
tests/
├── unit/                  # 单元测试（无外部依赖）
│   ├── test_models.py
│   ├── test_services.py
│   └── test_utils.py
├── integration/           # 集成测试（数据库、外部服务）
│   ├── test_repositories.py
│   └── test_api.py
├── conftest.py            # 共享 fixtures
└── factories.py           # 测试数据工厂
```

### (四) Fixtures 设计

1.【强制** 使用 `conftest.py` 管理共享 fixtures，按层级组织。
正例：
```python
# tests/conftest.py
import pytest

@pytest.fixture
def app():
    app = create_app(config="testing")
    yield app

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def db_session(app):
    with app.app_context():
        session = create_session()
        yield session
        session.rollback()
        session.close()
```

2.【强制** fixtures 必须有清理逻辑（使用 `yield` + 清理代码）。

3.【推荐** fixture 作用域合理选择：
- `function`（默认）：每个测试函数独立实例
- `class`：测试类共享
- `module`：模块共享
- `session`：整个测试会话共享

4.【推荐** 使用 `autouse=True` 的 fixture 处理全局设置（如数据库回滚、环境变量重置）。

### (五) Mock 策略

1.【强制** 仅 Mock 外部依赖（网络请求、数据库、文件系统、时间），不 Mock 被测模块的内部方法。

2.【强制** Mock 必须验证调用参数和次数。
正例：
```python
from unittest.mock import patch, call

def test_send_notification(mocker):
    mock_email = mocker.patch("app.services.email_sender.send")

    service.notify_user(user_id=1, message="Hello")

    mock_email.assert_called_once_with(
        to="user@example.com",
        subject="Notification",
        body="Hello",
    )
```

3.【推荐** 使用 `pytest-mock` 的 `mocker` fixture，比 `unittest.mock.patch` 更简洁。

4.【推荐** 使用 `responses` 或 `respx` Mock HTTP 请求，不 Mock `requests` 库本身。
正例：
```python
import responses

@responses.activate
def test_get_user():
    responses.add(
        responses.GET,
        "https://api.example.com/users/1",
        json={"id": 1, "name": "Alice"},
        status=200,
    )
    user = fetch_user(1)
    assert user.name == "Alice"
```

5.【推荐** 数据库测试使用事务回滚或测试数据库，不使用生产数据库。

### (六) 参数化测试

1.【推荐** 使用 `@pytest.mark.parametrize` 覆盖多组输入输出，避免重复测试逻辑。
正例：
```python
@pytest.mark.parametrize("input_val,expected", [
    ("hello", "HELLO"),
    ("World", "WORLD"),
    ("", ""),
    ("123", "123"),
])
def test_to_upper(input_val, expected):
    assert to_upper(input_val) == expected
```

2.【推荐** 异常测试使用 `pytest.raises`。
正例：
```python
def test_divide_by_zero():
    with pytest.raises(ZeroDivisionError):
        divide(10, 0)
```

3.【推荐** 测试边界条件：空输入、最大值、最小值、None、特殊字符。

### (七) 覆盖率要求

1.【强制** 语句覆盖率目标 80%。核心模块语句覆盖率和分支覆盖率都应达到 90%+。

2.【强制** CI 流水线中必须运行测试并检查覆盖率。
正例（`pyproject.toml`）：
```toml
[tool.pytest.ini_options]
addopts = "--cov=src --cov-report=term-missing --cov-fail-under=80"
```

3.【推荐** 使用 `--cov-report=html` 生成覆盖率报告，定位未覆盖代码。

4.【推荐** 覆盖率报告中的 `# pragma: no cover` 标记应极少使用，每处标记需注释原因。

### (八) 测试编写原则（BCDE）

1.【推荐** 遵循 BCDE 原则：
- **B**order：边界值测试（空列表、最大值、None、空字符串）
- **C**orrect：正确输入得到预期结果
- **D**esign：结合设计文档编写测试
- **E**rror：异常输入得到预期错误

2.【推荐** 测试函数命名应清晰描述测试场景：`test_{方法名}_{场景}_{预期结果}`。
正例：
```python
def test_create_user_duplicate_email_raises_error():
    ...

def test_calculate_discount_with_vip_returns_20_percent():
    ...
```

3.【推荐** 每个测试遵循 AAA 模式（Arrange / Act / Assert）：
```python
def test_user_age_calculation():
    # Arrange
    birth_date = date(1990, 1, 1)
    user = User(birth_date=birth_date)

    # Act
    age = user.calculate_age(as_of=date(2024, 1, 1))

    # Assert
    assert age == 34
```

4.【推荐** 测试应该是可以独立阅读和理解的文档，不需要阅读实现代码就能理解业务规则。

### (九) 测试数据管理

1.【强制** 数据库测试不能假设数据已存在，必须通过程序准备测试数据。

2.【推荐** 使用 `factory_boy` 创建测试数据工厂：
正例：
```python
import factory

class UserFactory(factory.Factory):
    class Meta:
        model = User

    name = factory.Sequence(lambda n: f"User{n}")
    email = factory.LazyAttribute(lambda o: f"{o.name}@example.com")
    age = 25

# 使用
user = UserFactory.create()
users = UserFactory.create_batch(10)
```

3.【推荐** 测试数据加明确标识，便于清理。
正例：`email = "test_user_001@example.com"`

4.【参考** 集成测试可使用 Docker 测试容器（`testcontainers-python`）提供真实数据库实例。
