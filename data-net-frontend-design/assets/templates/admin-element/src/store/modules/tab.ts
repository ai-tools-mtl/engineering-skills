import { defineStore } from 'pinia';
import { ref } from 'vue';

interface TabItem {
    name: string;
    path: string;
    title?: string;
    keepAlive?: boolean;
}

/**
 * 标签页/KeepAlive 状态。
 * App.vue 读取 tabs 中 keepAlive 的 name 作为 <KeepAlive :include>。
 * reloading 用于强制刷新当前页(改 false→true 触发组件重建)。
 *
 * 本模板默认不渲染标签页 UI;如需 tags-view,在此 store 基础上加 UI。
 * 当前页打开时业务侧调用 addTab(route) 登记。
 */
export default defineStore('tab', () => {
    const tabs = ref<TabItem[]>([]);
    const reloading = ref(false);

    const addTab = (item: TabItem) => {
        if (!item.name) return;
        if (tabs.value.some((t) => t.name === item.name)) return;
        tabs.value.push(item);
    };

    const reload = () => {
        reloading.value = true;
        // 下一个微任务再改回 false,触发 <component :is> 重建
        Promise.resolve().then(() => {
            reloading.value = false;
        });
    };

    return { tabs, reloading, addTab, reload };
});
