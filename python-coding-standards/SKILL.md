---
name: python-coding-standards
description: PEP 8 与社区最佳实践编码规范，包含命名风格、代码格式、Pythonic 惯用法、数据结构、字符串处理、迭代器与生成器、注释与文档字符串、现代化语法。Use when writing Python code, reviewing code, or following Python coding standards.
---

# 编程规约

## 一、编程规约

### (一) 命名风格

1.【强制】 模块名使用 snake_case，简短、全小写。包名同样全小写，可用下划线分隔但尽量避免。
正例：`math_utils` / `http_client` / `user_service`
反例：`mathUtils` / `HttpClient` / `userService`

2.【强制】 类名使用 PascalCase（每个单词首字母大写）。
正例：`HttpRequest` / `UserController` / `OrderService`
反例：`httpRequest` / `user_controller` / `ORDER_SERVICE`

3.【强制】 函数名、方法名、变量名、参数名统一使用 snake_case。
正例：`get_user_by_id` / `is_valid` / `total_count`
反例：`getUserById` / `isValid` / `totalCount`

4.【强制】 常量命名使用 UPPER_SNAKE_CASE，单词间用下划线隔开，力求语义完整。
正例：`MAX_RETRY_COUNT` / `DEFAULT_TIMEOUT_SECONDS` / `CACHE_EXPIRED_TIME`
反例：`MAX_COUNT` / `Expired` / `timeout`

5.【强制】 私有成员用单下划线前缀（`_private_attr`），名称修饰用双下划线前缀（`__mangled`）。避免滥用双下划线，仅在需要避免子类命名冲突时使用。
正例：
```python
class Service:
    def __init__(self):
        self._internal_state = None  # 内部使用，子类可访问
        self.__private_key = ""      # 名称修饰，防止子类覆盖
```

6.【强制】 避免使用单字符变量名，以下除外：
- 循环计数器：`i`、`j`、`k`
- 异常处理中不使用的变量：`_`
- 数学运算中的惯例：`x`、`y`、`z`

7.【强制】 禁止使用拼音与英文混合的命名，更不允许直接使用中文命名。
正例：`discount_price` / `user_score`
反例：`dazhe_price` / `积分`

8.【强制】 布尔变量和返回布尔值的方法以 `is_`、`has_`、`can_`、`should_` 等前缀开头。
正例：`is_active` / `has_permission` / `can_delete` / `should_retry`

9.【推荐】 命名应自解释，使用完整的单词组合。不要使用不规范的缩写。
正例：`calculate_total_price` / `user_repository`
反例：`calc_tp` / `user_repo`

10.【推荐】 表示类型的名词放在词尾，提升辨识度。
正例：`user_list` / `name_dict` / `timeout_seconds`
反例：`list_of_users` / `dict_for_names` / `seconds_of_timeout`

11.【推荐】 如果使用了设计模式，在类名或模块名中体现模式名。
正例：`UserFactory` / `LoginProxy` / `EventObserver`

12.【参考】 各层命名规约：
- Service 层方法命名：`get_` / `list_` / `create_` / `update_` / `delete_` 做前缀
- 数据模型后缀：`Model`（ORM）/ `Schema`（Pydantic）/ `DTO`（传输对象）
- 工具函数模块名：`_utils` 后缀（如 `date_utils`）

### (二) 代码格式

1.【强制】 使用 4 个空格缩进，禁止使用 Tab 字符。
说明：在编辑器中配置 Tab 自动转换为空格。使用 `.editorconfig` 文件统一团队配置。

2.【强制】 行宽限制不超过 120 个字符（Black 默认 88 也合规）。长行在适当位置换行。
正例：
```python
result = some_function_with_long_name(
    first_arg, second_arg,
    third_arg, fourth_arg,
)
```
反例：
```python
result = some_function_with_long_name(first_arg, second_arg, third_arg, fourth_arg, fifth_arg)  # 超长不换行
```

3.【强制】 import 语句按以下顺序分组，每组之间空一行：
1）标准库
2）第三方库
3）本地模块
说明：使用 `isort` 自动排序。
正例：
```python
import os
import sys
from datetime import datetime

import requests
from fastapi import FastAPI

from myapp.models import User
from myapp.utils import format_date
```

4.【强制】 禁止使用 `from xxx import *`，显式导入需要的名称。
说明：通配符导入会污染命名空间，难以追踪来源，且可能与本地名称冲突。
反例：`from os.path import *`

5.【强制】 类之间空 2 行，方法之间空 1 行。模块级函数之间空 2 行。
说明：使用 Black/Ruff 自动格式化可统一处理。

6.【强制】 二元运算符换行时，运算符与操作数一起换行。
正例：
```python
income = (gross_wages
          + taxable_interest
          + (dividends - qualified_dividends)
          - ira_deduction
          - student_loan_interest)
```

7.【推荐】 使用 Black 或 Ruff formatter 进行自动格式化，统一团队代码风格。
说明：配置 `pyproject.toml` 中的格式化规则，并在 CI 中检查。

8.【推荐】 文件编码统一使用 UTF-8，换行符使用 Unix 格式（LF）。
说明：通过 `.editorconfig` 文件强制统一。

### (三) Pythonic 惯用法

1.【强制】 使用 `enumerate` 替代 `range(len())` 进行带索引遍历。
正例：
```python
for i, item in enumerate(items):
    print(f"{i}: {item}")
```
反例：
```python
for i in range(len(items)):
    print(f"{i}: {items[i]}")
```

2.【强制】 使用列表推导/生成器表达式替代循环 + append，仅在逻辑复杂时使用 for 循环。
正例：
```python
squares = [x ** 2 for x in range(10)]
active_users = [u for u in users if u.is_active]
```
反例：
```python
squares = []
for x in range(10):
    squares.append(x ** 2)
```

3.【强制】 使用 `with` 语句管理资源（文件、数据库连接、锁等），确保资源正确释放。
正例：
```python
with open("data.txt", "r") as f:
    content = f.read()
```
反例：
```python
f = open("data.txt", "r")
content = f.read()
f.close()  # 可能遗漏
```

4.【强制】 使用 `pathlib` 替代 `os.path` 进行路径操作。
正例：
```python
from pathlib import Path
data_dir = Path("data")
config_path = data_dir / "config.json"
if config_path.exists():
    content = config_path.read_text()
```
反例：
```python
import os
config_path = os.path.join("data", "config.json")
if os.path.exists(config_path):
    with open(config_path) as f:
        content = f.read()
```

5.【强制】 使用 f-string（Python 3.6+）进行字符串格式化，禁止使用 `%` 或 `.format()`（除非需要兼容旧版本）。
正例：`f"Hello, {name}! You have {count} messages."`
反例：`"Hello, %s! You have %d messages." % (name, count)`

6.【推荐】 使用 `dataclass` 替代手动编写 `__init__` 的简单数据容器。
正例：
```python
from dataclasses import dataclass

@dataclass
class Point:
    x: float
    y: float
    label: str = ""
```
反例：
```python
class Point:
    def __init__(self, x: float, y: float, label: str = ""):
        self.x = x
        self.y = y
        self.label = label
```

7.【推荐】 使用海象运算符 `:=`（Python 3.8+）简化赋值 + 判断的场景。
正例：
```python
if (n := len(data)) > 10:
    print(f"Too long: {n} elements")
```

8.【推荐】 使用 `collections` 模块中的专用容器替代手动实现。
- `Counter`：计数统计
- `defaultdict`：带默认值的字典
- `deque`：双端队列
- `OrderedDict`：有序字典（3.7+ 普通 dict 已有序，但 OrderedDict 支持排序操作）

9.【推荐】 使用 `__slots__` 优化大量实例的内存占用。
说明：当需要创建大量相同类的实例时，`__slots__` 可显著减少内存使用。

10.【推荐】 使用 `str.join()` 而非循环拼接字符串。
正例：`", ".join(names)`
反例：
```python
result = ""
for name in names:
    result += name + ", "
```

### (四) 迭代器与生成器

1.【推荐】 处理大数据集时使用生成器而非列表，避免内存溢出。
正例：
```python
def read_large_file(file_path):
    with open(file_path) as f:
        for line in f:
            yield line.strip()
```
反例：
```python
def read_large_file(file_path):
    with open(file_path) as f:
        return [line.strip() for line in f]  # 一次性加载全部
```

2.【推荐】 使用 `yield from` 委托子生成器。
正例：
```python
def flatten(nested):
    for item in nested:
        if isinstance(item, list):
            yield from flatten(item)
        else:
            yield item
```

3.【推荐】 使用 `itertools` 模块的常用函数简化迭代逻辑。
- `chain`：连接多个可迭代对象
- `groupby`：分组
- `islice`：切片迭代器
- `product` / `permutations` / `combinations`：组合运算

### (五) 注释与文档字符串

1.【强制】 模块、类、公开函数必须使用 docstring。格式统一选择一种风格（推荐 Google 风格）。
正例（Google 风格）：
```python
def calculate_discount(price: float, rate: float) -> float:
    """计算折扣后的价格。

    Args:
        price: 原价，必须为正数。
        rate: 折扣率，范围 0.0 ~ 1.0。

    Returns:
        折扣后的价格。

    Raises:
        ValueError: 当 price 或 rate 不在合法范围时。
    """
```

2.【强制】 行内注释使用 `#`，与代码至少隔 2 个空格，`#` 后跟 1 个空格。
正例：`x = x + 1  # 补偿边界偏移`

3.【强制】 禁止注释掉的代码直接提交。无用代码直接删除，通过版本控制系统追溯。
反例：
```python
# result = old_calculation(data)
# if result > threshold:
#     do_something()
result = new_calculation(data)
```

4.【推荐】 type hints 已覆盖的类型信息不要在 docstring 中重复。
正例：
```python
def get_user(user_id: int) -> User:
    """根据 ID 获取用户。"""
```
反例：
```python
def get_user(user_id):
    """根据 ID 获取用户。

    Args:
        user_id: int 类型，用户 ID

    Returns:
        User 对象
    """
```

5.【推荐】 注释说明「为什么」而非「是什么」。代码本身应说明做什么。
正例：`# 使用稳定排序保持相同分数的原始顺序`
反例：`# 对列表排序`

6.【参考】 特殊标记格式（注明标记人与日期）：
- `TODO(姓名, 2024-01-01):` 待实现功能
- `FIXME(姓名, 2024-01-01):` 已知问题需要修复
- `HACK(姓名, 2024-01-01):` 临时解决方案

### (六) 现代化语法（Python 3.9+）

1.【强制】 Python 3.9+ 使用内置泛型，不再需要 `from typing import List, Dict`。
正例：`def process(items: list[str]) -> dict[str, int]:`
反例：`def process(items: List[str]) -> Dict[str, int]:`

2.【推荐】 Python 3.9+ 使用 `dict |` 合并运算符。
正例：`config = default_config | user_config`
反例：`config = {**default_config, **user_config}`

3.【推荐】 Python 3.9+ 使用 `str.removeprefix()` / `str.removesuffix()`。
正例：`filename.removeprefix("tmp_")`

4.【推荐】 Python 3.10+ 的 `match/case` 用于复杂条件分支。
正例：
```python
match command:
    case ["quit"]:
        exit()
    case ["load", filename]:
        load_file(filename)
    case _:
        print("Unknown command")
```

5.【推荐】 使用 `from __future__ import annotations` 延迟注解求值，解决前向引用问题。
