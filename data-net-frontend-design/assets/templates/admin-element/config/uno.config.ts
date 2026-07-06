import { defineConfig, presetAttributify, presetUno, transformerDirectives } from 'unocss';
import presetRemToPx from '@unocss/preset-rem-to-px';

/**
 * UnoCSS 配置。
 * - presetUno:类 Tailwind 原子类(flex / w-100px / text-14px ...)
 * - presetAttributify:属性化模式,可写成 HTML 属性(text="red")
 * - presetRemToPx(baseFontSize:4):1rem=4px → p-4 = 16px,无需手动换算
 * - transformerDirectives:支持 SCSS 里的 @apply
 * - shortcuts:项目高频组合的语义化简写
 */
export default defineConfig({
    rules: [],
    presets: [
        presetUno(),
        presetAttributify(),
        presetRemToPx({
            baseFontSize: 4,
        }),
    ],
    transformers: [transformerDirectives()],
    shortcuts: {
        'flex-center': 'flex justify-center items-center',
        'flex-x-center': 'flex justify-center',
        'flex-y-center': 'flex items-center',
        'wh-full': 'w-full h-full',
        'flex-x-between': 'flex items-center justify-between',
        'flex-x-end': 'flex items-center justify-end',
        'absolute-lt': 'absolute left-0 top-0',
        'absolute-rt': 'absolute right-0 top-0',
        'absolute-center': 'absolute left-50% top-50% translate-x--50% translate-y--50%',
        'fixed-lt': 'fixed left-0 top-0',
        'ellipse-text': 'overflow-hidden text-ellipsis whitespace-nowrap',
    },
    theme: {},
});
