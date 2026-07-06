import { resolve } from 'node:path';
import type { ConfigEnv, UserConfigExport } from 'vite';
import { loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import UnoCSS from 'unocss/vite';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

/**
 * Vite 配置(管理端模板)。
 * 关键点:
 *  - @ → src,~ → 项目根
 *  - SCSS 全局注入 theme.scss(令牌 + 变量,供所有 .scss 用 $primary-color 等)
 *  - Element Plus 按需自动导入(组件 + 图标 + 样式),无需手动 import
 *  - UnoCSS(预设 + rem→px,baseFontSize:4 即 1rem=4px)
 *  - SVG 雪碧图:src/assets/svg-icon/ 下的 svg 用 <svg-icon name="xxx" /> 引用
 */
export default ({ mode }: ConfigEnv): UserConfigExport => {
    const { VITE_BASE, VITE_API_PROXY, VITE_API_PREFIX } = loadEnv(mode, process.cwd());

    return {
        base: VITE_BASE,
        resolve: {
            alias: {
                '@': resolve(__dirname, '../src'),
                '~': resolve(__dirname, '..'),
            },
        },
        plugins: [
            vue(),
            UnoCSS(),
            AutoImport({
                imports: ['vue', 'vue-router'],
                resolvers: [ElementPlusResolver()],
                dts: false,
            }),
            Components({
                resolvers: [ElementPlusResolver()],
                dts: false,
            }),
            createSvgIconsPlugin({
                iconDirs: [resolve(process.cwd(), 'src/assets/svg-icon')],
                symbolId: 'icon-[dir]-[name]',
            }),
        ],
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `@use "@/assets/styles/theme.scss" as *;`,
                    api: 'modern-compiler',
                },
            },
        },
        server: {
            port: 8083,
            host: true,
            cors: true,
            proxy: {
                [VITE_API_PREFIX || '/prod-api']: {
                    target: VITE_API_PROXY || 'http://localhost:3000',
                    changeOrigin: true,
                    secure: false,
                },
            },
        },
    };
};
