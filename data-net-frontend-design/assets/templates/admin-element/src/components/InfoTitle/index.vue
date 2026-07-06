<template>
    <div class="section-title flex-y-center">
        <svg-icon v-if="iconName" :size="size" :name="iconName" />
        <span>{{ title }}</span>
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
/**
 * 详情页小节标题:图标 + 标题文字。
 * 图标用 svg-icon(name 对应 src/assets/svg-icon/)。
 */
defineProps({
    title: { default: '', type: String },
    size: { default: 20, type: Number },
    color: { default: '', type: String },
    iconName: { default: '', type: String },
});
</script>

<style lang="scss" scoped>
.section-title {
    margin: 20px 0;
    display: flex;
    align-items: center;
    > svg {
        width: 20px !important;
        height: 20px !important;
    }
    > span {
        color: #333;
        font-size: 18px;
        font-weight: 600;
        margin-left: 16px;
    }
}
</style>
