---
name: python-web-api
description: Python Web/API 开发规范，包含 FastAPI/Django/Flask 通用规范、RESTful 设计、数据验证、中间件、异步处理。Use when building Web APIs, designing RESTful endpoints, or working with FastAPI/Django/Flask.
---

# Web/API 开发

## 六、Web/API 开发

### (一) RESTful API 设计

1.【强制】 API 路径使用复数名词，kebab-case 风格（小写 + 连字符）。
正例：`/api/v1/users` / `/api/v1/order-items`
反例：`/api/v1/user` / `/api/v1/orderItems` / `/api/v1/order_items`

2.【强制】 使用标准 HTTP 方法表达操作语义：
| 方法 | 用途 | 幂等性 |
|------|------|--------|
| GET | 获取资源 | 是 |
| POST | 创建资源 / 触发动作 | 否 |
| PUT | 全量更新资源 | 是 |
| PATCH | 部分更新资源 | 否 |
| DELETE | 删除资源 | 是 |

3.【强制】 API 版本控制放在 URL 路径中：`/api/v1/...`。
说明：便于路由分发和版本管理。

4.【强制】 使用标准 HTTP 状态码：
- `200 OK`：成功
- `201 Created`：资源创建成功
- `204 No Content`：成功但无返回体（删除）
- `400 Bad Request`：请求参数错误
- `401 Unauthorized`：未认证
- `403 Forbidden`：无权限
- `404 Not Found`：资源不存在
- `422 Unprocessable Entity`：数据验证失败
- `500 Internal Server Error`：服务器内部错误

5.【强制】 响应体使用统一信封格式：
```python
# 成功响应
{
    "success": true,
    "data": {...},
    "message": "ok"
}

# 错误响应
{
    "success": false,
    "data": null,
    "error": {
        "code": "A0210",
        "message": "密码错误",
        "detail": "Password mismatch for user xxx"
    }
}
```

6.【强制】 分页接口返回元数据：
```python
{
    "success": true,
    "data": [...],
    "pagination": {
        "page": 1,
        "page_size": 20,
        "total": 150,
        "total_pages": 8
    }
}
```

7.【强制】 列表接口为空时返回 `[]`，不返回 `null`。

8.【推荐】 JSON key 使用 lowerCamelCase 风格，与前端约定一致。
正例：`orderId` / `userName` / `createdAt`

### (二) FastAPI 规范

1.【强制】 使用 `APIRouter` 按功能模块分组路由。
正例：
```python
# routers/users.py
from fastapi import APIRouter

router = APIRouter(prefix="/api/v1/users", tags=["users"])

@router.get("/", response_model=list[UserResponse])
async def list_users(...): ...

@router.post("/", response_model=UserResponse, status_code=201)
async def create_user(...): ...
```

2.【强制】 使用 Pydantic 模型定义请求体和响应体，通过 `response_model` 自动过滤和文档化。
正例：
```python
@router.post("/", response_model=UserResponse)
async def create_user(data: UserCreate, service: UserService = Depends()): ...
```

3.【强制】 使用 `Depends` 实现依赖注入（数据库会话、服务实例、权限校验）。
正例：
```python
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

@router.get("/me")
async def get_current_user(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
): ...
```

4.【强制】 使用 `lifespan` 管理应用生命周期（初始化/释放资源）。
正例：
```python
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 启动时
    await init_db()
    yield
    # 关闭时
    await engine.dispose()

app = FastAPI(lifespan=lifespan)
```

5.【推荐】 使用 `BackgroundTasks` 或 `Celery`/`ARQ` 处理耗时操作，不阻塞请求。

6.【推荐】 使用 `HTTPException` 或自定义异常处理器统一错误响应。
正例：
```python
@app.exception_handler(AppError)
async def app_error_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"success": False, "error": {"code": exc.code, "message": exc.message}},
    )
```

### (三) Django 规范

1.【强制】 使用 Django REST Framework (DRF) 构建 API，使用 `ViewSet` + `Router` 组织路由。
正例：
```python
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

router = DefaultRouter()
router.register(r"users", UserViewSet)
```

2.【强制】 使用 `Serializer` 做数据验证和序列化，不直接操作 `dict`。

3.【强制】 使用 DRF 的权限类（`IsAuthenticated` / `IsAdminUser`）控制访问。

4.【推荐】 使用 `django-filter` 实现列表过滤和排序。

5.【推荐】 使用 `drf-spectacular` 自动生成 OpenAPI 文档。

### (四) Flask 规范

1.【强制】 使用 `Blueprint` 组织路由模块。
2.【强制】 使用 `flask-pydantic` 或 `marshmallow` 做请求/响应验证。
3.【推荐】 使用 `flask-restful` 或 `flask-smorest`（OpenAPI 支持）构建 RESTful API。
4.【推荐】 使用应用工厂模式（`create_app()`）管理配置和扩展。

### (五) 数据验证

1.【强制】 所有外部输入必须经过验证。使用 Pydantic（FastAPI）或 Serializer（Django）验证请求参数。

2.【强制】 路径参数和查询参数必须声明类型和约束。
正例（FastAPI）：
```python
@router.get("/{user_id}")
async def get_user(
    user_id: int = Path(..., gt=0, description="用户 ID"),
    include_deleted: bool = Query(default=False, description="是否包含已删除"),
): ...
```

3.【强制】 文件上传必须验证文件类型和大小。
正例（FastAPI）：
```python
@router.post("/upload")
async def upload_file(
    file: UploadFile = File(..., max_length=10 * 1024 * 1024),  # 10MB
):
    allowed_types = {"image/jpeg", "image/png", "application/pdf"}
    if file.content_type not in allowed_types:
        raise ValidationError("不支持的文件类型")
```

4.【推荐】 分页参数使用合理的默认值和上限保护。
正例：
```python
class PaginationParams(BaseModel):
    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=20, ge=1, le=100)
```

### (六) 中间件与拦截器

1.【强制】 实现统一的请求日志中间件，记录请求路径、方法、耗时、状态码。

2.【强制】 实现全局异常处理中间件，捕获未处理异常并返回标准错误响应。

3.【推荐】 实现请求 ID 中间件，为每个请求生成唯一标识，贯穿日志和响应头。

4.【推荐】 实现 CORS 中间件，严格控制允许的来源。

5.【推荐】 实现限流中间件（如 `slowapi`），防止 API 滥用。

### (七) 异步处理

1.【推荐】 FastAPI 路由默认使用 `async def`。仅在调用同步阻塞代码时使用 `def`（FastAPI 自动放入线程池）。

2.【推荐】 耗时操作（邮件发送、文件处理、第三方调用）使用后台任务或消息队列。
正例（FastAPI BackgroundTasks）：
```python
@router.post("/register")
async def register(data: UserCreate, background_tasks: BackgroundTasks):
    user = await service.create_user(data)
    background_tasks.add_task(send_welcome_email, user.email)
    return user
```

3.【推荐】 使用 Celery / ARQ / Dramatiq 处理异步任务队列。

4.【参考】 WebSocket 使用 `async for` 处理消息流。
