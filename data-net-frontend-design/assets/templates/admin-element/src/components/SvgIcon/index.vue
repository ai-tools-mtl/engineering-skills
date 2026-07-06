<template>
    <!-- localIcon:渲染本地 svg 雪碧图(src/assets/svg-icon/ 下的文件);否则用 Element Plus 图标 -->
    <template v-if="localIcon">
        <svg :width="`${size}px`" :height="`${size}px`" aria-hidden="true">
            <use :xlink:href="symbolId" class="svg-icon-class" />
        </svg>
    </template>
    <template v-else>
        <el-icon v-bind="$attrs" :size="size" :class="[{ 'is-loading': loading }]">
            <component :is="ElementPlusIconsVue[name]"></component>
        </el-icon>
    </template>
</template>

<script setup lang="ts" name="SvgIcon">
import { computed } from 'vue';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

/**
 * 图标组件:统一入口,两种来源。
 * - localIcon=true(默认):用 vite-plugin-svg-icons 的雪碧图,name 对应 src/assets/svg-icon/ 下的文件名。
 * - localIcon=false:用 Element Plus 图标,name 对应 @element-plus/icons-vue 的组件名(如 'ArrowDown')。
 */
interface SvgProps {
    name?: string;
    prefix?: string;
    size?: string | number;
    loading?: boolean;
    localIcon?: boolean;
}

const props = withDefaults(defineProps<SvgProps>(), {
    prefix: 'icon',
    size: 18,
    loading: false,
    localIcon: true,
});

const symbolId = computed(() => `#${props.prefix}-${props.name}`);
</script>

<style>
svg:focus {
    outline: none;
}
</style>
