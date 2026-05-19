---
name: f2e-markup
description: >
  Use when writing HTML, CSS, Sass, or Less code — enforces Alibaba front-end
  coding standards for markup and styling. Triggers on .html, .css, .scss,
  .less, .sass files or when the user asks about markup/styling conventions.
---

# HTML & CSS 编码规约

## S - Scope

- Target: HTML5 + CSS3, including Sass/Less preprocessors.
- Source: Alibaba f2e-spec coding standards.
- Focus: decision guidance; code produced by Claude must comply with mandatory rules by default.

### Default assumptions

- Indentation: 2 spaces.
- Charset: UTF-8.
- Line width: 100 characters (recommended).

### Mandatory rules (强制)

Claude MUST follow these when writing HTML/CSS code.

#### HTML

**DOCTYPE & structure**
- HTML 文件必须以 `<!doctype html>` 开头（小写）。
- 必须有且仅有一个顶层 `<html>` 元素，必须包含 `lang` 属性。
- `<head>` 中必须包含 `<meta charset="utf-8" />` 和 `<meta name="viewport" />`。

```html
// good
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Page Title</title>
  </head>
  <body></body>
</html>
```

**Semantic elements**
- 使用语义化标签：`<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>` 等。
- 不要用 `<div>` 替代语义化标签。

**Attributes**
- 属性名使用小写。
- 属性值用双引号包裹。
- Boolean 属性不赋值：`<input disabled />` 而非 `<input disabled="disabled" />`。

#### CSS

**Formatting**
- 所有声明必须以分号结尾。stylelint: declaration-block-trailing-semicolon
- 使用 2 个空格缩进。
- 选择器和 `{` 之间保留一个空格。
- 属性名和 `:` 之间无空格，`:` 和属性值之间保留一个空格。
- 声明块右大括号 `}` 单独成行。
- 属性声明单独成行。

```css
/* good */
.selector {
  margin-top: 10px;
  padding-left: 15px;
}
```

**Values**
- 使用尽可能短的十六进制值：`#fff` 而非 `#ffffff`。stylelint: color-hex-length
- 十六进制值使用小写字母。stylelint: color-hex-case
- 长度值为 0 时省略单位：`margin: 0;` 而非 `margin: 0px;`。stylelint: length-zero-no-unit
- 不要使用 `!important` 重写样式。

**Selectors**
- 组合器 `>`, `+`, `~`, `||` 前后各保留一个空格。
- 不要使用 CSS `@import`。

### Recommended rules (推荐)

**Sass/Less**
- 四则运算符两侧各保留一个空格：`width: 100px - 50px;`。
- Mixin 名称和 `()` 之间无空格，参数逗号后保留一个空格。
- 嵌套选择器深度不超过 3 层。
- 属性声明顺序：定位 → 盒模型 → 排版 → 视觉 → 动画 → 其他。

## P - Process

### Auto-apply
When writing HTML/CSS code, apply all mandatory rules without being asked. No output needed — code should be compliant by default.

### Query
When user asks about a specific rule:
1. State the rule number from f2e-spec (e.g., CSS 1.1.1).
2. State the level: 强制 / 推荐 / 参考.
3. Provide explanation and good/bad examples.
4. Mention the corresponding lint rule if applicable.

## O - Output

- **Auto-apply**: Code is compliant, no extra commentary.
- **Query**: Rule ID + level + explanation + code examples + lint rule reference.

## References

| Source | Content |
|--------|---------|
| f2e-spec/docs/coding/html.zh.md | HTML 编码规约完整版 |
| f2e-spec/docs/coding/css.zh.md | CSS 编码规约完整版 |
| f2e-spec/docs/coding/common.zh.md | 通用编码规约（缩进、行宽、字符集） |
