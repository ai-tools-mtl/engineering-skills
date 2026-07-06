import { createApp } from 'vue';
import App from './App.vue';
import { setupStore } from './store';
import { setupRouter } from '@/router';

// UnoCSS 原子类(必须在 EP 样式前引入)
import 'virtual:uno.css';
// SVG 雪碧图注册(src/assets/svg-icon/ 下的 svg)
import 'virtual:svg-icons-register';

// Element Plus 全量样式(组件本身由 unplugin-vue-components 按需自动导入)
import 'element-plus/dist/index.css';
// 全局样式入口:重置 + 滚动条 + EP 覆盖 + 通用类
import './assets/styles/index.css';

const app = createApp(App);

// 全局注册列表页三件套(业务页直接用 <BaseLayout>/<BaseTable>/<CommonSearch>,无需 import)
app.component('BaseTable', () => import('@/components/BaseTable/index.vue'));
app.component('CommonSearch', () => import('@/components/commonSearch/index.vue'));
app.component('BaseLayout', () => import('@/components/BaseLayout/index.vue'));
// SvgIcon:菜单/详情图标组件(布局与 InfoTitle 依赖)
app.component('SvgIcon', () => import('@/components/SvgIcon/index.vue'));

setupStore(app);
setupRouter(app);

app.mount('#app');
