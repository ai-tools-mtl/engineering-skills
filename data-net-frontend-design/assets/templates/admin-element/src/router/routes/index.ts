import type { RouteRecordRaw } from 'vue-router';
import { backendRouter } from './backend';

/**
 * 路由总表。
 *
 * 布局机制:每条路由的 meta.layout 指定用哪个布局壳(@/layouts/<name>/index.vue)。
 * 管理端页面统一用 'menuPageLayout'(顶栏 + 侧边栏 + 面包屑)。
 *
 * 菜单生成:menuPageLayout 会遍历本路由表,挑出 meta.layout==='menuPageLayout'
 * 且 meta.hiddenMenu 不为 true 的路由渲染到侧边栏。所以**加菜单 = 加路由**。
 *
 * meta 字段约定:
 *   - layout      使用的布局(管理端页面:'menuPageLayout')
 *   - title       菜单名 / 面包屑名
 *   - icon        一级菜单图标(svg-icon name,对应 src/assets/svg-icon/)
 *   - hiddenMenu  true 时不在侧边栏显示(详情页用)
 *   - activeMenu  详情页激活哪个菜单项的 name(配合 hiddenMenu)
 *   - keepAlive   是否缓存组件
 *   - noPadding   内容区不加内边距(全屏表格等)
 */
export const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: () => import('@/layouts/menuPageLayout/index.vue'),
        meta: {
            layout: 'menuPageLayout',
            hiddenMenu: true,
        },
        children: [
            {
                // 根路径重定向到第一个业务菜单(改成你的默认页)
                path: '',
                redirect: '/demo/list',
            },
        ],
    },
    {
        path: '/errPage/:code',
        name: 'errPage',
        component: () => import('@/views/errPage.vue'),
        meta: {
            title: '错误',
            layout: 'empty',
            hiddenMenu: true,
        },
    },

    // 业务路由(管理端菜单),见 backend.ts
    ...backendRouter,

    // 兜底:未匹配路由
    {
        path: '/:catchAll(.*)',
        redirect: '/demo/list',
        meta: { hiddenMenu: true },
    },
];
