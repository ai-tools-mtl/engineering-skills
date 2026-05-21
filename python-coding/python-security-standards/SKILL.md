---
name: python-security-standards
description: Python 安全开发规范，包含输入校验、SQL 注入防护、XSS 防护、认证授权、密钥管理、文件安全。Use when implementing security features, handling user input, or configuring authentication.
---

# 安全规约

## 七、安全规约

### (一) 输入校验

1.【强制】 所有用户输入必须验证后才可使用，包括：URL 参数、请求体、请求头、Cookie、文件上传。

2.【强制】 使用 Pydantic / marshmallow / Django Form 在入口处统一验证，禁止在业务逻辑中分散校验。

3.【强制】 防止超限参数导致资源耗尽：
- 分页参数 `page_size` 上限不超过 100
- 批量操作数量上限控制
- 字符串长度限制
- 文件上传大小限制
正例：
```python
class QueryParams(BaseModel):
    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=20, ge=1, le=100)
    keyword: str = Field(default="", max_length=200)
```

4.【强制】 防止排序字段注入。排序字段必须使用白名单校验。
正例：
```python
ALLOWED_SORT_FIELDS = {"created_at", "updated_at", "name", "price"}

def validate_sort_field(field: str) -> str:
    if field.lstrip("-") not in ALLOWED_SORT_FIELDS:
        raise ValidationError(f"不允许的排序字段: {field}")
    return field
```

5.【强制】 防止路径遍历。文件路径操作必须校验不包含 `../` 等目录跳转字符。
正例：
```python
from pathlib import Path

def safe_path(base_dir: Path, filename: str) -> Path:
    target = (base_dir / filename).resolve()
    if not str(target).startswith(str(base_dir.resolve())):
        raise ValidationError("非法文件路径")
    return target
```

### (二) SQL 注入防护

1.【强制】 禁止使用字符串拼接、f-string、`%` 格式化构造 SQL 语句。必须使用参数化查询或 ORM。
正例：
```python
# ORM（推荐）
User.objects.filter(name=name)

# 参数化查询
cursor.execute("SELECT * FROM users WHERE name = %s", (name,))
```
反例：
```python
cursor.execute(f"SELECT * FROM users WHERE name = '{name}'")
cursor.execute("SELECT * FROM users WHERE name = '%s'" % name)
```

2.【强制】 原始 SQL 使用命名参数或占位符，不信任任何用户输入。
正例（SQLAlchemy）：`text("SELECT * FROM users WHERE id = :id")`

### (三) XSS 防护

1.【强制】 存储型和反射型用户输入在输出到 HTML 时必须转义。
说明：现代前端框架（React/Vue）默认转义，但服务端渲染（Jinja2）需手动启用。
正例（Jinja2）：`{{ user_input | e }}`（默认启用自动转义）

2.【强制】 禁止使用 `|safe` 过滤器输出未经验证的用户输入。

3.【强制】 JSON API 响应设置 `Content-Type: application/json`，浏览器不会将 JSON 当作 HTML 执行。

4.【推荐】 设置 `Content-Security-Policy` 响应头。

### (四) 认证与授权

1.【强制】 密码存储使用 `bcrypt` 或 `argon2` 哈希，禁止使用 MD5 / SHA1 / 明文。
正例：
```python
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# 哈希
hashed = pwd_context.hash(password)

# 验证
pwd_context.verify(password, hashed)
```
反例：
```python
import hashlib
hashed = hashlib.md5(password.encode()).hexdigest()  # 不安全
```

2.【强制】 JWT Token 的密钥必须使用高强度随机字符串（至少 32 字节），存储在环境变量中。
正例：`SECRET_KEY = os.environ["JWT_SECRET_KEY"]`

3.【强制】 JWT Token 必须设置合理的过期时间。Access Token 短（15-30 分钟），Refresh Token 长（7-30 天）。

4.【强制】 登录接口必须实现防暴力破解机制（限流、验证码、账户锁定）。

5.【强制】 敏感操作（修改密码、删除账户、资金操作）必须二次验证。

6.【推荐】 使用 OAuth2 / OpenID Connect 实现第三方登录，不自建认证协议。

7.【推荐】 权限控制使用 RBAC（基于角色）或 ABAC（基于属性），不使用硬编码权限判断。

### (五) 密钥管理

1.【强制】 禁止在源代码中硬编码任何密钥、密码、Token。
反例：
```python
API_KEY = "sk-xxxxxxxxxxxx"
DB_PASSWORD = "admin123"
```

2.【强制】 所有密钥通过环境变量或密钥管理服务（AWS Secrets Manager / HashiCorp Vault）注入。

3.【强制】 `.env` 文件必须加入 `.gitignore`，禁止提交到版本控制。

4.【强制】 应用启动时验证必要的环境变量是否存在，缺失则拒绝启动。
正例：
```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str  # 缺失时自动报错
    secret_key: str

    model_config = {"env_file": ".env"}
```

5.【推荐】 定期轮换密钥和 Token。支持密钥轮换的设计（如 JWT 支持多个有效密钥）。

6.【推荐】 使用 `direnv` 或 `dotenv` 管理开发环境密钥。

### (六) 文件安全

1.【强制】 文件上传必须验证文件类型（通过文件头魔数，而非仅扩展名）和大小。
正例：
```python
import magic

def validate_file(file: UploadFile) -> None:
    ALLOWED_TYPES = {"image/jpeg", "image/png", "application/pdf"}
    MAX_SIZE = 10 * 1024 * 1024  # 10MB

    content = file.file.read()
    if len(content) > MAX_SIZE:
        raise ValidationError("文件过大")

    mime_type = magic.from_buffer(content, mime=True)
    if mime_type not in ALLOWED_TYPES:
        raise ValidationError(f"不支持的文件类型: {mime_type}")

    file.file.seek(0)
```

2.【强制】 上传文件存储到专用目录（不在 Web 根目录），文件名使用 UUID 重命名。
正例：
```python
import uuid
from pathlib import Path

def save_upload(file: UploadFile, upload_dir: Path) -> str:
    ext = Path(file.filename).suffix
    new_name = f"{uuid.uuid4().hex}{ext}"
    file_path = upload_dir / new_name
    file_path.write_bytes(await file.read())
    return new_name
```

3.【强制】 禁止将用户上传的文件路径直接拼接到系统命令中（防止命令注入）。

4.【推荐】 文件下载使用预签名 URL（S3）或流式传输，不直接暴露文件路径。

### (七) 依赖安全

1.【强制】 定期运行 `pip audit` / `safety check` / `dependabot` 检查依赖中的已知漏洞。

2.【强制】 `requirements.txt` / `pyproject.toml` 中锁定依赖版本。

3.【推荐】 使用 `pip-audit` 在 CI 中自动检查依赖安全性。

4.【推荐】 避免使用不再维护的第三方包（检查最近更新时间和 issue 活跃度）。

### (八) 其他安全措施

1.【强制】 生产环境必须使用 HTTPS。

2.【强制】 设置安全相关的 HTTP 响应头：
```python
SECURITY_HEADERS = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
}
```

3.【强制】 日志中禁止记录密码、Token、身份证号等敏感信息。必须脱敏处理。
正例：`logger.info("User login: phone=%s", mask_phone(phone))`

4.【推荐】 实现 CSRF 防护（Django 默认启用，FastAPI 需手动实现或使用 `fastapi-csrf-protect`）。

5.【推荐】 API 接口实现速率限制（Rate Limiting），使用 `slowapi`（FastAPI）或 `django-ratelimit`。

6.【推荐】 使用安全随机数生成器（`secrets` 模块），不使用 `random` 模块生成安全相关随机值。
正例：
```python
import secrets
token = secrets.token_urlsafe(32)
```
反例：
```python
import random
token = ''.join(random.choices(string.ascii_letters, k=32))  # 不安全
```
