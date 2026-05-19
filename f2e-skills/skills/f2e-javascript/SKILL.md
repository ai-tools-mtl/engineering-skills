---
name: f2e-javascript
description: >
  Use when writing JavaScript or TypeScript code — enforces Alibaba front-end
  coding standards. Triggers on .js, .jsx, .ts, .tsx files or when the user
  asks about JS/TS coding conventions.
---

# JavaScript & TypeScript 编码规约

## S - Scope

- Target: ECMAScript 6+ / TypeScript.
- Base: JS 规约是基础，TS 规约在其上扩展。未包含的内容默认遵循 JS 规约。
- Source: Alibaba f2e-spec coding standards.
- Focus: decision guidance; code produced by Claude must comply with mandatory rules by default.

### Default assumptions

- Indentation: 2 spaces.
- Semicolons: always.
- Quotes: single quotes for JS strings, double quotes for JSX attributes.
- Line width: 100 characters.

### Mandatory rules (强制)

Claude MUST follow these when writing JS/TS code.

#### 1 Formatting

| Rule | Description | Lint |
|------|-------------|------|
| 1.1.1 | 2 个空格缩进 | indent |
| 1.2.1 | 使用分号 | semi |
| 1.3.1 | 不使用行首逗号 | comma-style |
| 1.3.2 | 多行结构始终加最后一个逗号 | comma-dangle |
| 1.4.2.1 | 非空代码块使用 Egyptian Brackets（开括号不换行） | brace-style |
| 1.4.3 | 不要使用空代码块 | no-empty |
| 1.5.1 | 行尾不要有多余空格 | no-trailing-spaces |
| 1.6.2 | 块的开始和结束不能是空行 | padded-blocks |

#### 2 Language features

**Variables**
- 使用 `const` 或 `let` 声明变量，禁止 `var`。no-var
- 优先使用 `const`，只在需要重新赋值时使用 `let`。prefer-const
- 一条声明语句声明一个变量。one-var
- 声明的变量必须被使用。no-unused-vars
- 不要在声明前使用变量。no-use-before-define
- 变量不要与外层作用域已存在的变量同名。no-shadow
- 不要重复声明变量和函数。no-redeclare
- 禁止连续赋值。no-multi-assign

**Types & values**
- 不要使用 `new Number/String/Boolean`。no-new-wrappers
- 避免不必要的布尔类型转换。no-extra-boolean-cast
- 字符串优先使用单引号。quotes
- 禁止不必要的转义字符。no-useless-escape
- 使用字面量创建数组，不要 `new Array()`。no-array-constructor
- 数组方法回调必须包含 `return`（非 void 回调）。array-callback-return
- 使用字面量创建对象，不要 `new Object()`。no-new-object
- 使用对象属性和方法的简写语法。object-shorthand
- 属性名不要用引号包裹（除非含特殊字符）。quote-props
- 优先使用 `.` 访问属性。dot-notation
- 不要直接调用 `Object.prototypes` 上的方法（如 `hasOwnProperty`）。no-prototype-builtins

**Functions**
- 不要用 `Function` 构造函数。no-new-func
- 不要在块中使用函数声明。no-inner-declarations
- 使用箭头函数代替匿名函数。prefer-arrow-callback
- 不要使用 `arguments` 对象，用 rest 参数。prefer-rest-params
- 不要将函数参数命名为 `arguments`。
- IIFE 用小括号包裹。wrap-iife
- generator 内必须有 `yield`。require-yield

**Classes**
- 避免不必要的 `constructor`。
- 正确使用 `super`。constructor-super / no-this-before-super
- 避免重复的类成员命名。no-dupe-class-members

**Modules**
- 不要用多个 `import` 引入同一模块。import/no-duplicates
- `import` 语句放到模块最上方。import/first
- 禁止 default import 名字跟文件内其他 export 同名。import/no-named-as-default
- 禁止引用自身。import/no-self-import
- 禁止循环引用。import/no-cycle

**Operators & control flow**
- 不要使用一元自增自减 `++`/`--`。no-plusplus
- 不要使用 `void` 运算符。no-void
- 避免嵌套的三元表达式。no-nested-ternary
- 避免不必要的三元表达式。no-unneeded-ternary
- 混合操作符用小括号分组。no-mixed-operators
- `switch` 的 `case` 必须以 `break` 结尾。no-fallthrough
- `for` 循环计数器应朝着正确方向移动。for-direction

**Forbidden**
- 禁止 `eval`。no-eval
- 禁止 `debugger`。no-debugger
- 禁止对原生对象或只读全局对象赋值。no-global-assign

#### 3 Comments
- 注释内容和注释符之间需要有一个空格。spaced-comment

#### 4 Naming
- 使用大驼峰（PascalCase）命名类和构造函数。new-cap

### Recommended rules (推荐)

Key rules Claude should follow by default unless there's a reason not to:
- 始终使用大括号包裹代码块。curly
- 文件末尾保留一行空行。eol-last
- 使用严格相等 `===`。eqeqeq
- 使用模板字符串替代字符串拼接。prefer-template
- 使用扩展运算符 `...` 处理数组和对象。
- 使用解构获取数组元素和对象属性。prefer-destructuring
- 使用默认参数语法，有默认值的参数放最后。
- 不要修改函数参数。no-param-reassign
- 使用 ES6 modules 而非其他模块系统。
- `switch` 需要包含 `default` 分支。default-case
- 使用 `class` 声明类，使用 `extends` 继承。
- 生产环境禁止使用 `console`。no-console

### TypeScript-specific mandatory rules

Claude MUST follow these when writing TypeScript code.

- 重载的函数必须写在一起。@typescript-eslint/adjacent-overload-signatures
- 禁止使用 `// tslint:` 注释。@typescript-eslint/ban-tslint-comment
- 类型断言必须使用 `as Type`，禁止尖括号语法 `<Type>`。@typescript-eslint/consistent-type-assertions
- interface/type 成员分隔符统一使用 `;`。@typescript-eslint/member-delimiter-style
- 禁止无意义的 `void` 类型。@typescript-eslint/no-invalid-void-type
- 禁止使用 `namespace` 定义命名空间。@typescript-eslint/no-namespace
- 禁止在 optional chaining 后使用 non-null 断言 `!?`。@typescript-eslint/no-non-null-asserted-optional-chain
- 禁止使用 `module` 定义命名空间，用 `namespace`。@typescript-eslint/prefer-namespace-keyword
- 字符串字面量使用单引号。@typescript-eslint/quotes
- 禁止三斜杠 `///` 导入。@typescript-eslint/triple-slash-reference
- 类型声明时空格间距正确：`name: type`。@typescript-eslint/type-annotation-spacing
- interface 和 type 成员必须声明类型。@typescript-eslint/typedef

### TypeScript-specific recommended rules

- 简单数组用 `T[]`，复杂类型用 `Array<T>`。@typescript-eslint/array-type
- 优先使用 `interface` 定义类型。@typescript-eslint/consistent-type-definitions
- 初始化为 `number/string/boolean` 的变量避免显式类型声明。@typescript-eslint/no-inferrable-types
- 当变量值与类型声明相等时使用 `as const`。@typescript-eslint/prefer-as-const
- 定义函数时优先使用参数联合类型而非函数重载。@typescript-eslint/unified-signatures

## P - Process

### Auto-apply
When writing JS/TS code, apply all mandatory and recommended rules without being asked. No output needed — code should be compliant by default.

### Query
When user asks about a specific rule:
1. State the rule number from f2e-spec (e.g., JS 1.1.1, TS adjacent-overload-signatures).
2. State the level: 强制 / 推荐.
3. Provide explanation and good/bad examples.
4. Mention the corresponding eslint rule.

## O - Output

- **Auto-apply**: Code is compliant, no extra commentary.
- **Query**: Rule ID + level + explanation + code examples + eslint rule.

## References

| Source | Content |
|--------|---------|
| f2e-spec/docs/coding/javascript.zh.md | JavaScript 编码规约完整版 |
| f2e-spec/docs/coding/typescript.zh.md | TypeScript 编码规约完整版 |
| f2e-spec/docs/coding/common.zh.md | 通用编码规约（缩进、行宽、字符集） |
