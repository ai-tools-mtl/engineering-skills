<template>
    <el-menu
        :default-active="activeIndex"
        class="el-menu-vertical-demo"
        text-color="#333"
        active-text-color="#055DD9"
        :collapse="isCollapse"
        :unique-opened="true"
    >
        <template v-for="subItem in routerList" :key="subItem.name">
            <!-- 有子菜单:渲染为可展开的 sub-menu -->
            <el-sub-menu v-if="subItem.children?.length" :index="subItem.name">
                <template #title>
                    <el-icon v-if="subItem.icon">
                        <svg-icon :name="subItem.icon" :local-icon="true" />
                    </el-icon>
                    <span>{{ subItem.title }}</span>
                </template>
                <el-menu-item
                    v-for="menu in subItem.children"
                    :key="menu.name"
                    :index="menu.name"
                    @click="menuClick(menu)"
                >
                    <el-icon>
                        <svg-icon :name="menu.icon" :local-icon="menu.localIcon" />
                    </el-icon>
                    <span>{{ menu.title }}</span>
                </el-menu-item>
            </el-sub-menu>

            <!-- 无子菜单:单条菜单项 -->
            <el-menu-item v-else :index="subItem.name" @click="menuClick(subItem)">
                <el-icon v-if="subItem.icon">
                    <svg-icon :name="subItem.icon" :local-icon="true" />
                </el-icon>
                <template #title>
                    <span>{{ subItem.title }}</span>
                </template>
            </el-menu-item>
        </template>
    </el-menu>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';

/**
 * 侧边栏菜单:基于 el-menu,支持多级(unique-opened)。
 * 菜单数据由 menuPageLayout 从路由表生成后传入(routerList)。
 * 图标用 svg-icon(name 对应 src/assets/svg-icon/ 下的文件)。
 */
interface Props {
    activeIndex: string;
    isCollapse: boolean;
    routerList: any[];
}
defineProps<Props>();

const router = useRouter();
const menuClick = (menu: any) => {
    const path = menu && menu.children ? menu.children[0].path : menu.path;
    router.push({ path });
};
</script>

<style lang="scss" scoped>
.el-menu-vertical-demo {
    border: none;
    .el-menu-item.is-active {
        width: 100%;
        background-color: #f3f8ff;
    }
}
:deep(.el-breadcrumb__item) {
    .el-breadcrumb__inner {
        color: #666 !important;
    }
}
:deep(.el-breadcrumb__item):last-child {
    .el-breadcrumb__inner {
        color: #333 !important;
    }
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 240px;
}
.el-menu-vertical-demo {
    overflow-y: auto;
    max-height: calc(100% - 43px);
}
.el-menu {
    border-right: none;
}
.is-active {
    background: #f3f8ff !important;
}
:deep(.el-sub-menu.is-active > .el-sub-menu__title) {
    background-color: none !important;
}
.el-menu-vertical-demo::-webkit-scrollbar {
    display: none !important;
}
</style>
