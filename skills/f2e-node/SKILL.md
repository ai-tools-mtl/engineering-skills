---
name: f2e-node
description: >
  Use when writing Node.js server-side code — enforces Alibaba front-end
  coding standards for Node.js. Triggers on Node.js code, Express/Koa routes,
  server files, or when the user asks about Node.js coding conventions.
---

# Node.js 开发规约

## S - Scope

- Target: Node.js (LTS versions).
- Prerequisite: follows f2e-javascript rules as base.
- Source: Alibaba f2e-spec Node.js coding standards.
- Focus: decision guidance; code produced by Claude must comply with mandatory rules by default.

### Default assumptions

- Use `async/await` over callbacks.
- Use Node.js built-in `Promise` over third-party libraries.
- Error handling is explicit at every layer.

### Mandatory rules (强制)

Claude MUST follow these when writing Node.js code.

#### Security (安全规约)

- **在客户端隐藏错误详情**：不要将堆栈跟踪、内部路径、数据库详情等暴露给前端。
- **隐藏或伪造技术栈标识**：不要通过 `X-Powered-By` 等头暴露框架信息。
- **JSONP 跨域接口必须严格校验访问来源**。
- **禁止使用从参数或明文 cookie 中获取的用户标识进行敏感信息查询输出**。
- **防止 SQL 注入**：使用参数化查询，不要拼接 SQL。

```js
// bad - 暴露错误详情
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.stack });
});

// good - 隐藏错误详情
app.use((err, req, res, next) => {
  logger.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// bad - SQL 注入
const query = `SELECT * FROM users WHERE id = '${userId}'`;

// good - 参数化查询
const query = 'SELECT * FROM users WHERE id = ?';
db.query(query, [userId]);
```

### Recommended rules (推荐)

#### Coding style

- 使用 Node.js 内置全局变量（如 `Buffer`, `process`, `console`）。node/prefer-global
- 使用模块内支持的 `promises` API（如 `fs.promises`）。node/prefer-promises
- 模块引用声明放在文件顶端，注意引用顺序（核心模块 → 第三方 → 本地）。import/order
- 抛出异常时使用原生 `Error` 对象。no-throw-literal

```js
// bad
throw 'Something went wrong';
throw { message: 'error' };

// good
throw new Error('Something went wrong');

// bad
const data = fs.readFileSync(path);

// good
const data = await fs.promises.readFile(path);
```

#### Best practices

- **应用不应该有状态**：使用外部存储（Redis/DB）管理状态。
- **尽量不要用 Node.js 托管前端静态文件**：交给 Nginx/CDN。
- **把 CPU 密集型任务委托给反向代理**：如图片处理、压缩。
- **使用 `async/await`**，尽量避免回调函数。
- **使用 `util.promisify` 处理回调函数**。
- **使用 Node.js 原生 `Promise`**，而非 bluebird 等。
- **在类方法中返回 `this`** 方便链式调用。
- **定期检查过期依赖和依赖漏洞升级**。
- **用户上传文件上传到 OSS 等服务**，不允许至服务器本地。
- **服务端 URL 重定向设置白名单**。
- **对接口入参严格校验**。

## P - Process

### Auto-apply
When writing Node.js code, apply all mandatory and recommended rules without being asked. Security rules are critical — never skip them.

### Query
When user asks about a specific rule:
1. State the rule number from f2e-spec (e.g., Node 2.1).
2. State the level: 强制 / 推荐.
3. Provide explanation and good/bad examples.

## O - Output

- **Auto-apply**: Code is compliant, no extra commentary.
- **Query**: Rule ID + level + explanation + code examples.

## References

| Source | Content |
|--------|---------|
| f2e-spec/docs/coding/node.zh.md | Node.js 开发规约完整版 |
| f2e-spec/docs/coding/javascript.zh.md | JavaScript 编码规约（Node.js 基础） |
