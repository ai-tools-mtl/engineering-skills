# 模板注册表

本文件是**选择前端模板的入口**。AI 在「从零新建前端项目」时,先读本表选模板,再拷对应模板目录到新项目。

**重要:不同模板技术栈不同**(Vue+手写CSS / Vue+Element Plus / 未来可能 React 等)。选模板时技术栈是首要匹配维度。

## 模板清单

| ID | 名称 | 技术栈 | 一句话定位 | 适用场景 | 默认 |
|----|------|--------|-----------|---------|------|
| `cloud-console` | 云控制台 | Vue3 + 纯手写CSS | 浅色、#1677ff、小圆角、轻阴影 | 后台管理 / 数据看板 / SaaS 控制台 | ✅ |
| `admin-element` | 蓝渐变管理端 | Vue3 + Element Plus + UnoCSS | 蓝色渐变底壳、EP 组件、三件套列表页范式 | 中后台管理系统 / 审核运营平台 / 政务/企业级管理 | |

## 如何选模板

**第一步:技术栈匹配(首要)**
- 用户明确指定了技术栈(如"用 Element Plus""用 Ant Design""用 React")→ 选 stack 匹配的模板;无匹配则说明本系统暂无,回退默认并告知
- 用户没指定 → 进入第二步

**第二步:风格/场景匹配**
读各模板的 `useCases` 和 `distinctiveFeatures`,选最贴切的。都不贴切时用默认。

**优先级**:用户显式指定技术栈 > 场景匹配 > 默认模板(`cloud-console`)。

## 选定后的动作

1. 读 `templates/<选中的 id>/TEMPLATE.yaml` 确认技术栈与特征
2. 读 `templates/<选中的 id>/README.md` 按**该模板的**接入步骤操作(不同技术栈接入方式不同:手写CSS 模板直接拷 src;EP/UnoCSS 模板还要装依赖、配 vite/uno)
3. 写页面/组件时,查 `templates/<选中的 id>/references/` 下该模板专属的令牌与组件文档
4. 向用户简短说明"将采用 <名称> 模板(<技术栈>)",然后直接开始

## 各模板技术栈速查

- **cloud-console**:Vue3 + vue-router + 纯手写 CSS(令牌在 style.css :root)。无 UI 库、无 Tailwind。轻量,适合不需要重型组件库的场景。
- **admin-element**:Vue3 + Element Plus(按需自动导入) + UnoCSS(原子类) + SCSS + Pinia。含封装的三件套(BaseLayout/BaseTable/CommonSearch)和蓝渐变管理端布局。适合需要丰富 UI 组件的中后台。

## 添加新模板

当你沉淀出一套新的前端样式(可能含不同技术栈),想让它可复用时,按 `templates/_TEMPLATE_GUIDE.md` 的步骤添加。
