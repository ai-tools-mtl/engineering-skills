import { createRouter, createWebHistory } from 'vue-router';
import type { App } from 'vue';
import { routes } from '@/router/routes';

const BASE_URL = import.meta.env.BASE_URL;

export const router = createRouter({
    history: createWebHistory(BASE_URL),
    routes,
    scrollBehavior() {
        return { top: 0, left: 0 };
    },
});

export function setupRouter(app: App) {
    app.use(router);

    // 鉴权守卫骨架:本模板默认不拦截,直接放行。
    // 如需登录态,在此加 token 校验与未登录跳转(如跳 /login)。
    router.beforeEach(async (_to, _from, next) => {
        next();
    });
}

export default router;
