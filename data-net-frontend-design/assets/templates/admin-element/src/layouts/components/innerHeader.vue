<template>
    <div class="header">
        <!-- 左:logo 占位 + 系统名(logo 用 slot 可覆盖) -->
        <div class="flex cursor-pointer items-center">
            <slot name="logo">
                <div class="logo-placeholder"></div>
            </slot>
            <span class="sys-name">{{ appName }}</span>
        </div>

        <!-- 右:用户下拉 -->
        <div class="w-393px flex flex-x-end flex-row items-center space-x-[20px]">
            <el-dropdown trigger="hover" @command="handleClickDropdown">
                <div class="username flex-center cursor-pointer text-18px">
                    <img class="mr-[8px] h-40px" src="./user-avatar.svg" alt="" />
                    {{ userName }}
                    <el-icon><ArrowDown /></el-icon>
                </div>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ArrowDown } from '@element-plus/icons-vue';

/**
 * 顶栏:左侧 logo + 系统名,右侧用户下拉。
 * appName / userName 由父组件传入(业务侧从 store/env 取)。
 * 退出通过 emit 抛出,具体清理逻辑由父组件处理。
 */
defineProps<{ appName?: string; userName?: string }>();
const emit = defineEmits<{ (e: 'logout'): void }>();

const handleClickDropdown = (command: string) => {
    if (command === 'logout') {
        emit('logout');
    }
};
</script>

<style lang="scss" scoped>
.header {
    z-index: 100;
    flex: none;
    width: 100%;
    display: flex;
    align-items: center;
    height: 40px;
    font-weight: 500;
    justify-content: space-between;

    .logo-placeholder {
        width: 40px;
        height: 40px;
        border-radius: 6px;
        background: rgba(255, 255, 255, 0.9);
        margin-right: 16px;
    }
    .sys-name {
        color: #fff;
        font-size: 30px;
        font-weight: 500;
    }
    .username {
        color: #fff;
    }
}
</style>
