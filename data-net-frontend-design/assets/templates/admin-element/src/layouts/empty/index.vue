<template>
    <!-- 空布局:不套侧边栏/顶栏,直接渲染内容(用于错误页、登录页等全屏页) -->
    <div class="empty-layout">
        <slot />
    </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.empty-layout {
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f6f8fb;
}
</style>
