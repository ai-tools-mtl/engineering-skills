import type { App } from 'vue';
import { createPinia } from 'pinia';

const pinia = createPinia();

/**
 * Pinia 安装入口(main.ts 调用)。
 * 如需持久化,在此 app.use(pinia) 前注册 pinia-plugin-persistedstate。
 */
export function setupStore(app: App) {
    app.use(pinia);
}

export { default as useTabStore } from './modules/tab';
