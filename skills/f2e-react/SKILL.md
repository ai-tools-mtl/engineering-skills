---
name: f2e-react
description: >
  Use when writing React code (components, hooks, JSX) — enforces Alibaba
  front-end coding standards for React. Triggers on React/JSX code, component
  files, or when the user asks about React coding conventions.
---

# React 编码规约

## S - Scope

- Target: React 16+ with Hooks support, JSX syntax.
- Prerequisite: follows f2e-javascript rules as base.
- Source: Alibaba f2e-spec React coding standards.
- Focus: decision guidance; code produced by Claude must comply with mandatory rules by default.

### Default assumptions

- Function components with Hooks preferred over class components.
- TypeScript for type safety.
- File extension: `.tsx` for components with JSX, `.ts` for pure logic.

### Mandatory rules (强制)

Claude MUST follow these when writing React code.

#### 1 JSX formatting

- JSX 使用 2 个空格缩进。react/jsx-indent
- 自闭合标签斜线前有且仅有一个空格：`<Foo />`。react/jsx-tag-spacing
- JSX 行内属性之间仅有一个空格。react/jsx-props-no-multi-spaces
- 属性大括号内部两侧无空格：`bar={baz}`。react/jsx-curly-spacing
- 属性等号两边不加空格：`name={value}`。jsx-equals-spacing
- JSX 属性使用双引号：`bar="bar"`，JS 中仍用单引号。jsx-quotes
- 多行 JSX 用小括号包裹。react/jsx-wrap-multilines
- 无子元素写成自闭合标签。react/self-closing-comp

```jsx
// good
<Foo
  superLongParam="bar"
  anotherSuperLongParam="baz"
>
  <Quux />
</Foo>

// good - single line
<Foo bar="bar" />
```

#### 2 Tags & attributes

- 标签属性换行：属性多于一个时，第一个属性换行。react/jsx-first-prop-new-line
- 属性多行时结束标签另起一行。react/jsx-closing-bracket-location
- 禁止在有子节点的组件中使用 `dangerouslySetInnerHTML`。react/no-danger-with-children
- HTML 自闭标签不能有子节点。react/void-dom-elements-no-children
- 文本节点中不要使用注释字符串。react/jsx-no-comment-textnodes
- 标签中禁止无意义字符（`>`, `"`, `}`, `'`）。react/no-unescaped-entities

#### 3 Components

- 每个文件只包含一个 React 组件。react/no-multi-comp
- 不要在函数组件中使用 `this`。react/no-this-in-sfc
- 使用 ES6 class 而非 `createReactClass`。react/prefer-es6-class
- 不要使用 `React.createElement`（除非非 JSX 入口）。react/no-deprecated
- render 方法必须要有返回值。react/require-render-return

#### 4 Props

- prop 命名使用小驼峰。react/no-unknown-property
- 声明的 prop 必须被使用。react/no-unused-prop-types
- prop 值为 `true` 时省略值：`<Foo visible />`。react/jsx-boolean-value
- 禁止将 `children` 作为属性名。react/no-children-prop
- 不要声明重复的属性名。react/jsx-no-duplicate-props
- `style` 的属性值必须是对象。react/style-prop-object
- `isRequired` 类型的 prop 不要在 `defaultProps` 中赋值。react/default-props-match-prop-types

#### 5 State

- 不要在 `setState` 中使用 `this.state`。react/no-access-state-in-setstate
- 声明的 state 必须被使用。react/no-unused-state
- 不要使用已废弃的生命周期方法（`componentWillMount` 等）。react/no-deprecated

#### 6 Refs

- 使用 ref 回调函数或 `React.createRef()`，不要使用字符串 ref。react/no-string-refs

#### 7 Hooks (强制)

- **只在最顶层调用 Hooks**：不要在循环、条件和嵌套函数中调用。
- **Hooks 命名必须以 `use` 开头**，小驼峰形式。
- **只在 React 函数组件和自定义 Hooks 中调用 Hooks**。

#### 8 File naming

- 文件扩展名：`.jsx`, `.tsx`, `.js`, `.ts`。
- 组件引用名使用大驼峰（PascalCase）。react/jsx-pascal-case

#### 9 Forbidden patterns

- 不要使用 `findDOMNode`。react/no-find-dom-node
- 不要使用 mixins。
- `PureComponent` 中不要使用 `shouldComponentUpdate`。react/no-redundant-should-component-update

### Recommended rules (推荐)

- 不要在 JSX 属性中使用 `.bind()`。react/jsx-no-bind
- 不要用数组索引作为 `key`。react/no-array-index-key
- 不要单独使用 `target='_blank'`，加 `rel="noreferrer"`。react/jsx-no-target-blank
- 不要使用 `dangerouslySetInnerHTML`。react/no-danger
- 高阶组件命名：组合 HOC 名和传入组件名作为 displayName。
- `useEffect` 等声明所有依赖。exhaustive-deps

#### Accessibility (推荐)

- `img` 标签必须包含 `alt` 属性。jsx-a11y/alt-text
- `alt` 不要使用 "image"、"photo" 之类的关键词。jsx-a11y/img-redundant-alt
- `<a>` 元素必须含有内容。jsx-a11y/anchor-has-content
- 仅使用有效的、非抽象的 ARIA roles。jsx-a11y/aria-role
- `<iframe>` 必须有唯一的 `title` 属性。jsx-a11y/iframe-has-title
- 不要使用 `accessKey` 属性。jsx-a11y/no-access-key

## P - Process

### Auto-apply
When writing React code, apply all mandatory and recommended rules without being asked. No output needed — code should be compliant by default.

### Query
When user asks about a specific rule:
1. State the rule number from f2e-spec (e.g., React 1.1.1).
2. State the level: 强制 / 推荐.
3. Provide explanation and good/bad examples.
4. Mention the corresponding eslint rule.

## O - Output

- **Auto-apply**: Code is compliant, no extra commentary.
- **Query**: Rule ID + level + explanation + code examples + eslint rule.

## References

| Source | Content |
|--------|---------|
| f2e-spec/docs/coding/react.zh.md | React 编码规约完整版 |
| f2e-spec/docs/coding/javascript.zh.md | JavaScript 编码规约（React 基础） |
