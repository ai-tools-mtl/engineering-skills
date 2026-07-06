import type { RouteRecordRaw } from 'vue-router';

/**
 * 管理端业务路由(侧边栏菜单的来源)。
 *
 * 范式:按「模块」组织,每个模块是一级菜单,其 children 是二级菜单。
 * 详情/审核页加 hiddenMenu:true + activeMenu 指回列表页 name,使其不出现在菜单但能高亮。
 *
 * 新增菜单 = 新增一条路由。component 指向 @/views/<目录>/index.vue。
 */
export const backendRouter: RouteRecordRaw[] = [
    {
        path: '/demo',
        name: 'Demo',
        redirect: '/demo/list',
        meta: {
            title: '示例模块',
            icon: 'common-demo', // 对应 src/assets/svg-icon/common/demo.svg
            layout: 'menuPageLayout',
        },
        children: [
            {
                path: 'list',
                name: 'DemoList',
                component: () => import('@/views/demo-list/index.vue'),
                meta: {
                    title: '用户列表',
                    layout: 'menuPageLayout',
                    keepAlive: true,
                },
            },
            // 详情页范例:不在菜单显示,激活时高亮列表页
            // {
            //     path: 'detail/:id',
            //     name: 'DemoDetail',
            //     component: () => import('@/views/demo-list/detail.vue'),
            //     meta: {
            //         title: '用户详情',
            //         layout: 'menuPageLayout',
            //         hiddenMenu: true,
            //         activeMenu: 'DemoList',
            //     },
            // },
        ],
    },
    // 继续添加模块,例如:
    // {
    //     path: '/audit',
    //     name: 'Audit',
    //     redirect: '/audit/dataSource',
    //     meta: { title: '审核中心', icon: 'common-audit', layout: 'menuPageLayout' },
    //     children: [
    //         { path: 'dataSource', name: 'AuditDataSource', component: () => import('@/views/audit/dataSource.vue'), meta: { title: '数据资源审核', layout: 'menuPageLayout', keepAlive: true } },
    //     ],
    // },
];
