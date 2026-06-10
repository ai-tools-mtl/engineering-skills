---
name: python-database
description: Python 数据库操作规范，包含通用 SQL 原则、SQLAlchemy 2.0、Django ORM、连接池管理、迁移策略。Use when writing database queries, designing schemas, or configuring ORM in Python projects.
---

# 数据库

## 五、数据库

### (一) 通用原则

1.【强制】 禁止在 SQL 查询中使用字符串拼接或 f-string 构造查询条件，必须使用参数化查询，防止 SQL 注入。
正例：
```python
# SQLAlchemy
session.execute(text("SELECT * FROM users WHERE id = :id"), {"id": user_id})

# Django ORM
User.objects.filter(id=user_id)

# 原生驱动
cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
```
反例：
```python
cursor.execute(f"SELECT * FROM users WHERE id = {user_id}")
```

2.【强制】 查询时明确指定需要的字段，禁止使用 `SELECT *`。
正例（SQLAlchemy）：`session.query(User.id, User.name).filter(...)`
正例（Django）：`User.objects.values("id", "name").filter(...)`
反例：`session.query(User).filter(...)` / `User.objects.all()`

3.【强制】 批量操作必须使用批量接口，禁止在循环中逐条执行 INSERT/UPDATE。
正例：
```python
# SQLAlchemy
session.execute(insert(User), user_list)
session.bulk_update_mappings(User, update_list)

# Django
User.objects.bulk_create(user_objects)
User.objects.bulk_update(user_objects, ["name", "email"])
```
反例：
```python
for user_data in user_list:
    session.add(User(**user_data))
```

4.【强制】 大数据量查询必须分页，禁止无限制的结果集。
正例：
```python
# SQLAlchemy
query.offset((page - 1) * size).limit(size)

# Django
User.objects.all()[offset:offset + size]
```

5.【强制】 禁止在应用代码中使用数据库存储过程和触发器，业务逻辑应在应用层实现。
说明：存储过程和触发器难以版本控制、测试和调试。

6.【强制】 使用迁移工具管理数据库变更（Alembic / Django Migrations），禁止手动执行 DDL。

7.【推荐】 使用乐观锁处理并发更新冲突。
正例（SQLAlchemy）：
```python
class Order(Base):
    __tablename__ = "orders"
    version = Column(Integer, default=1)

# 更新时
order.version += 1
session.commit()  # 若 version 不匹配会抛异常
```

### (二) 建表规约

1.【强制】 表名和字段名统一使用 snake_case，全小写。
2.【强制】 每张表必须包含 `id`（主键）、`created_at`、`updated_at` 字段。
3.【强制】 布尔类型字段使用 `is_xxx` 命名，类型为 `Boolean`。
4.【强制】 金额字段使用整数类型存储最小货币单位（分），禁止使用浮点数。
5.【强制】 禁止使用物理删除，使用逻辑删除（`is_deleted` 字段）。
6.【推荐】 小数类型使用 `Numeric(precision, scale)`，禁止使用浮点数。

### (三) SQLAlchemy 2.0 规范

1.【强制】 使用 SQLAlchemy 2.0 新风格（`select()` / `insert()` / `update()` / `delete()`），不使用旧版 `Query` API。
正例：
```python
from sqlalchemy import select

stmt = select(User).where(User.id == user_id)
result = session.execute(stmt)
user = result.scalar_one_or_none()
```
反例（旧风格）：
```python
user = session.query(User).filter(User.id == user_id).first()
```

2.【强制】 使用 `DeclarativeBase` 定义模型基类。
正例：
```python
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    email: Mapped[str] = mapped_column(String(255), unique=True)
```

3.【强制】 使用 `Mapped[]` 类型注解定义列类型，替代旧版 `Column()`。
正例：`name: Mapped[str] = mapped_column(String(100))`
反例：`name = Column(String(100))`

4.【强制】 使用 `relationship()` 定义关联关系时，必须配置 `lazy="selectin"` 或 `lazy="joined"`，避免 N+1 查询。
正例：
```python
class Order(Base):
    __tablename__ = "orders"
    items: Mapped[list["OrderItem"]] = relationship(lazy="selectin")
```
反例：
```python
class Order(Base):
    __tablename__ = "orders"
    items: Mapped[list["OrderItem"]] = relationship()  # 默认 lazy="select"，触发 N+1
```

5.【强制】 异步环境使用 `AsyncSession` 和 `create_async_engine`。
正例：
```python
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession

engine = create_async_engine("postgresql+asyncpg://...")
async with AsyncSession(engine) as session:
    result = await session.execute(select(User))
```

6.【推荐】 使用 `sessionmaker` 或 `async_sessionmaker` 管理会话工厂。
正例：
```python
from sqlalchemy.ext.asyncio import async_sessionmaker

AsyncSessionLocal = async_sessionmaker(engine, class_=AsyncSession)
```

7.【推荐】 更新数据时必须同时更新 `updated_at` 字段。
正例：
```python
class Base(DeclarativeBase):
    updated_at: Mapped[datetime] = mapped_column(
        onupdate=func.now(), default=func.now()
    )
```

### (四) Django ORM 规范

1.【强制】 使用 `select_related`（ForeignKey / OneToOne）和 `prefetch_related`（ManyToMany / 反向 ForeignKey）优化查询，避免 N+1。
正例：
```python
# ForeignKey / OneToOne
orders = Order.objects.select_related("user").all()

# ManyToMany / 反向关系
users = User.objects.prefetch_related("orders").all()
```

2.【强制】 使用 `values()` 或 `values_list()` 仅查询需要的字段，减少内存占用。
正例：`User.objects.values("id", "name").filter(is_active=True)`

3.【推荐】 使用 `only()` / `defer()` 延迟加载大字段。
正例：`Article.objects.defer("content").all()`

4.【推荐】 复杂查询使用 `Q` 对象和 `F` 表达式。
正例：
```python
from django.db.models import Q, F

User.objects.filter(Q(age__gte=18) | Q(is_verified=True))
Product.objects.filter(stock__gt=F("min_stock"))
```

5.【推荐】 使用 `bulk_create` / `bulk_update` 批量操作。

6.【推荐】 使用数据库索引优化查询。在 `Meta` 中定义 `indexes`。
正例：
```python
class User(models.Model):
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=100)

    class Meta:
        indexes = [
            models.Index(fields=["name"]),
            models.Index(fields=["-created_at"]),
        ]
```

### (五) 连接池管理

1.【强制】 生产环境必须配置连接池参数。
正例（SQLAlchemy）：
```python
engine = create_engine(
    database_url,
    pool_size=10,          # 常驻连接数
    max_overflow=20,       # 最大溢出连接数
    pool_timeout=30,       # 获取连接超时（秒）
    pool_recycle=3600,     # 连接回收时间（秒）
    pool_pre_ping=True,    # 连接前检测有效性
)
```

2.【强制】 应用关闭时必须释放连接池。
正例：
```python
# FastAPI lifespan
@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    await engine.dispose()
```

3.【推荐】 监控连接池使用情况，设置合理告警。

### (六) 迁移管理

1.【强制】 使用 Alembic（SQLAlchemy）或 Django Migrations 管理数据库变更。

2.【强制】 每次迁移必须可回滚（提供 `downgrade` / `reverse` 操作）。
正例（Alembic）：
```python
def upgrade() -> None:
    op.add_column("users", sa.Column("phone", sa.String(20), nullable=True))

def downgrade() -> None:
    op.drop_column("users", "phone")
```

3.【强制】 数据迁移和结构迁移分开。数据迁移必须使用批次处理，避免锁表。

4.【推荐】 迁移文件命名使用自增编号 + 描述性名称，不使用日期戳（避免合并冲突）。

5.【推荐】 生产环境迁移执行前必须备份。
