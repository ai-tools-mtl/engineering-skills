<template>
    <el-config-provider :locale="zhCn" :message="{ max: 3 }">
        <router-view v-if="Layout" v-slot="{ Component, route }" :key="key">
            <component :is="Layout">
                <KeepAlive :include="keepAliveNames">
                    <component :is="Component" v-if="!tabStore.reloading" />
                </KeepAlive>
            </component>
        </router-view>
        <router-view v-else></router-view>
    </el-config-provider>
</template>

<script setup lang="ts">
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import { computed, defineAsyncComponent, markRaw } from 'vue';
import { useRoute } from 'vue-router';
import { useTabStore } from '@/store';

const route = useRoute();
const tabStore = useTabStore();

// 按路由 meta.layout 动态加载布局:@/layouts/<name>/index.vue
// 不指定 layout(或 'normal')则不套布局壳,直接渲染。
const layouts = new Map();
const key = computed(() => route.path);

const getLayout = (name: string) => {
    if (name === 'normal' || !name) return null;
    if (layouts.get(name)) return layouts.get(name);
    const layout = markRaw(defineAsyncComponent(() => import(`@/layouts/${name}/index.vue`)));
    layouts.set(name, layout);
    return layout;
};

const Layout = computed(() => {
    if (!route.matched?.length) return null;
    return getLayout(route.meta?.layout as string);
});

// KeepAlive 白名单:仅缓存 tabStore.tabs 里标记 keepAlive 的页面
const keepAliveNames = computed(() => {
    return tabStore.tabs.filter((item) => item.keepAlive).map((item) => item.name);
});
</script>
