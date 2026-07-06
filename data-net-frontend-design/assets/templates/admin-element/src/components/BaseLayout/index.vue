<template>
    <div class="base-layout">
        <!-- 可选左栏:树/筛选区,可折叠 -->
        <div
            v-if="showLeft"
            class="base-layout-left"
            :class="{ 'base-layout-left-close': !isOpenLeft }"
        >
            <slot name="left"></slot>
            <div class="collapse-area">
                <el-button
                    class="collapse-icon"
                    link
                    :icon="ArrowLeft"
                    @click="isOpenLeft = !isOpenLeft"
                ></el-button>
            </div>
        </div>

        <!-- 右栏:搜索区 + 操作区 + 内容区 -->
        <div class="base-layout-right" :class="{ 'base-layout-right-tree': showLeft }">
            <div class="base-layout-search">
                <slot name="search"></slot>
            </div>
            <div v-if="$slots.action" class="base-layout-action">
                <slot name="action"></slot>
            </div>
            <div class="base-layout-content">
                <slot name="content"></slot>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ArrowLeft } from '@element-plus/icons-vue';
import { ref } from 'vue';

/**
 * 列表页三段式容器(全局注册,直接用 <BaseLayout>)。
 * slots: left(可选树/筛选) / search(搜索区,配 CommonSearch) / action(批量操作) / content(主体,配 BaseTable)
 */
defineProps({
    showLeft: {
        type: Boolean,
        default: false,
    },
});
const isOpenLeft = ref(true);
</script>

<style scoped lang="scss">
.base-layout {
    display: flex;
    height: 100%;
    gap: 4px;
    &-left {
        width: 280px;
        flex: none;
        height: 100%;
        padding: 40px 20px;
        background-color: #fff;
        position: relative;
        transition: all 0.3s linear;
        .collapse-area {
            position: absolute;
            top: 0;
            bottom: 0;
            width: 9px;
            right: 0;
            display: flex;
            align-items: center;
            z-index: 2;
            background-color: #fff;
            .collapse-icon {
                cursor: pointer;
                width: 100%;
            }
        }
        &-close {
            padding: 40px 0;
            width: 9px;
            overflow: hidden;
            .collapse-icon {
                transform: rotate(180deg);
            }
        }
    }
    &-right {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        &-tree {
            padding-left: 24px;
        }
    }
    &-search {
        margin-bottom: 6px;
    }
    &-action {
        margin-bottom: 16px;
    }
    &-content {
        overflow: auto;
        flex: 1;
        min-height: 0;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }
}
</style>
