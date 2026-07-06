<template>
    <div :class="[isWarp ? 'isWarp' : 'common-search']">
        <div ref="searchContentRef" class="common-search-content" :style="{ height: height + 'px' }">
            <slot></slot>
        </div>
        <div :class="['common-search-action', showExport ? 'show-export' : '']">
            <div v-if="showToggle" class="toggle-area" @click="handleToggle">
                {{ isOpen ? '收起' : '展开' }}
                <el-icon class="action-icon" :class="{ 'is-open': isOpen }"><ArrowDown /></el-icon>
            </div>
            <el-button :disabled="resetBtnLoading" @click="reset">重置</el-button>
            <el-button type="primary" :disabled="searchBtnLoading" @click="search">查询</el-button>
            <el-button v-if="showExport" @click="exportTable">导出</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue';
import { ArrowDown } from '@element-plus/icons-vue';

/**
 * 搜索区(全局注册,直接用 <CommonSearch>)。
 * 默认展示一行(50px),超出显示"展开/收起";自带查询/重置(+可选导出)按钮 + loading 防抖。
 * slot 内放 el-form + el-row + el-col 的搜索项。
 */
const props = defineProps({
    isWarp: { type: Boolean, default: false },
    showExport: { type: Boolean, default: false },
    defaultExpanded: { type: Boolean, default: false },
});

const isOpen = ref(false);
const handleToggle = () => {
    isOpen.value = !isOpen.value;
    height.value = isOpen.value ? contentHeight.value : oneLineHeight;
};
const searchContentRef = ref();
const contentHeight = ref(0);
const height = ref<string | number>('auth');
const oneLineHeight = 50;

onMounted(() => {
    contentHeight.value = searchContentRef.value.clientHeight;
    if (props.defaultExpanded) {
        isOpen.value = true;
        height.value = contentHeight.value;
    } else {
        height.value = oneLineHeight;
    }
    window.addEventListener('resize', handleResize);
});

const showToggle = computed(() => contentHeight.value > oneLineHeight);

const handleResize = () => {
    const originalOverflow = searchContentRef.value.style.overflow;
    searchContentRef.value.style.overflow = 'visible';
    contentHeight.value = searchContentRef.value.scrollHeight;
    searchContentRef.value.style.overflow = originalOverflow;
    height.value = oneLineHeight;
    isOpen.value = false;
};

onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
});

const searchBtnLoading = ref(false);
const resetBtnLoading = ref(false);
const loadingChange = (type) => {
    type == 2 ? (searchBtnLoading.value = true) : (resetBtnLoading.value = true);
    setTimeout(() => {
        type == 2 ? (searchBtnLoading.value = false) : (resetBtnLoading.value = false);
    }, 500);
};

const emits = defineEmits(['search', 'reset', 'exportTable']);
const reset = () => {
    if (resetBtnLoading.value) return;
    emits('reset');
    loadingChange(1);
};
const search = () => {
    if (searchBtnLoading.value) return;
    emits('search');
    loadingChange(2);
};
const exportTable = () => emits('exportTable');
</script>

<style scoped lang="scss">
.common-search {
    width: 100%;
    display: flex;
    align-items: flex-start;

    &-action {
        width: 250px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        flex: none;
    }
    &-content {
        flex: 1;
        transition: height 0.3s;
        overflow: hidden;

        :deep(.el-form) {
            .el-row {
                flex-wrap: wrap;
            }
            .el-col {
                min-width: 400px;
                flex-shrink: 0;
                flex-grow: 1;
            }
        }
    }
}
.toggle-area {
    font-size: 14px;
    margin-right: 16px;
    color: #1777ff;
    font-weight: 400;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    .action-icon {
        transition: transform 0.3s;
    }
    .is-open {
        transform: rotate(180deg);
    }
}
.isWarp {
    width: 100%;
    display: flex;
    align-items: flex-start;
    padding-bottom: 16px;
    border-bottom: 1px solid rgba(205, 208, 214, 0.5);
    margin-bottom: 18px;
    flex-wrap: wrap;
    .common-search-content {
        width: 100%;
        flex: auto;
    }
    .common-search-action {
        width: 250px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex: none;
    }
}
.show-export {
    width: 300px !important;
}
</style>
