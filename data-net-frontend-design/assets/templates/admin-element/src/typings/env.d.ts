/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_PORT?: string;
    readonly VITE_BASE?: string;
    readonly VITE_API_PROXY?: string;
    readonly VITE_API_PREFIX?: string;
    readonly VITE_APP_NAME?: string;
    readonly VITE_APP_TITLE?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

declare module '*.vue' {
    import type { DefineComponent } from 'vue';
    const component: DefineComponent<{}, {}, any>;
    export default component;
}
