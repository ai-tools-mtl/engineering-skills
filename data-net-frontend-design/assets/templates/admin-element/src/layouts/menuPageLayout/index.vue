<template>
    <div class="common-layout home-page-layout">
        <!-- 顶栏:logo + 系统名 + 用户区 -->
        <div class="common-layout-header">
            <innerHeader :app-name="appName" :user-name="userName" @logout="onLogout" />
        </div>

        <div class="control">
            <!-- 侧边栏:可折叠菜单 -->
            <div class="layout-left">
                <CustomMenu
                    :is-collapse="isCollapse"
                    :router-list="routerList"
                    :active-index="activeIndex"
                />
                <div class="collapse-icon" :class="{ 'collapse-icon-open': isCollapse }">
                    <el-icon v-if="isCollapse" color="#8191A3" size="20">
                        <Expand @click="isCollapse = !isCollapse" />
                    </el-icon>
                    <el-icon v-else color="#8191A3" size="20">
                        <Fold @click="isCollapse = !isCollapse" />
                    </el-icon>
                </div>
            </div>

            <!-- 主区:面包屑 + 内容 -->
            <div class="layout-right">
                <div v-if="routerList.length > 0" class="breadcrumb-area">
                    <el-breadcrumb>
                        <template v-for="(item, index) in breadcrumbList" :key="index">
                            <el-breadcrumb-item v-if="index === 0">{{ item.breadcrumbName }}</el-breadcrumb-item>
                            <el-breadcrumb-item v-else :to="{ path: item.path }">{{
                                item.breadcrumbName
                            }}</el-breadcrumb-item>
                        </template>
                    </el-breadcrumb>
                </div>
                <div class="content" :class="{ noPadding: route.meta.noPadding }">
                    <template v-if="routerList.length > 0">
                        <slot />
                    </template>
                    <div v-else class="empty-menu">
                        <el-empty description="暂无菜单权限" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { Expand, Fold } from '@element-plus/icons-vue';
import CustomMenu from '../components/customMenu.vue';
import innerHeader from '../components/innerHeader.vue';
import { routes } from '@/router/routes/index.ts';

/**
 * 管理端主布局:蓝色渐变底壳 + 可折叠侧边栏 + 面包屑 + 内容区。
 * 菜单由路由表(routes)生成 —— 遍历挑出 layout==='menuPageLayout' 且非 hiddenMenu 的项。
 */
const route = useRoute();

// 品牌 / 用户信息(业务侧从 store 或接口取,这里留可覆盖的默认值)
const appName = ref(import.meta.env.VITE_APP_NAME || '管理系统');
const userName = ref('管理员');
const emit = defineEmits<{ (e: 'logout'): void }>();
function onLogout() {
    emit('logout');
    // 业务侧在此清除登录态并跳登录页
}

const routerList = ref<any[]>([]);
const activeIndex = ref(route.name as string);
const isCollapse = ref(false);

// 从静态路由表生成侧边栏菜单树
const filterTreeArray = (tree: any[]) => {
    return tree
        .filter((item) => {
            return (
                item.meta?.layout === 'menuPageLayout' && !item.meta?.hiddenMenu && item.meta?.title
            );
        })
        .map((item) => {
            const newItem = Object.assign({}, item);
            if (item.children) {
                newItem.children = filterTreeArray(item.children);
            }
            return newItem;
        });
};

const arrayRecursion = (array: any[], parentPath = '') => {
    return array.map((item) => {
        const fullPath = parentPath ? `${parentPath}/${item.path}` : item.path;
        const newItem = {
            path: fullPath,
            title: item.meta?.title,
            name: item.name,
            icon: item.meta?.icon,
            activeMenu: item.meta?.activeMenu,
            children: null as any,
        };
        if (item.children && item.children.length > 0) {
            newItem.children = arrayRecursion(item.children, fullPath);
        }
        return newItem;
    });
};

const getRouterList = () => {
    const visibleMenus = filterTreeArray(routes);
    routerList.value = arrayRecursion(visibleMenus, '');
};
getRouterList();

// 面包屑:由 route.matched 的 meta.title 拼成
const breadcrumbList = computed(() => {
    const list: any[] = [];
    route.matched.forEach((item) => {
        if (item.meta.title) {
            list.push({ path: item.path, breadcrumbName: item.meta.title });
        }
    });
    return list;
});

// 当前激活菜单(详情页用 activeMenu 指回列表页)
const getActiveIndex = () => {
    if (route.name) {
        activeIndex.value = (route.meta?.activeMenu || route.name) as string;
    }
};
watch(route, getActiveIndex, { immediate: true });
</script>

<style lang="scss" scoped>
/* 整体容器:蓝色纵向渐变(管理端最强辨识度特征) */
.home-page-layout {
    display: flex;
    flex-direction: column;
    height: 100vh;
    position: relative;
    overflow: hidden;
    padding: 0 40px 40px 40px;
    background: linear-gradient(
        359deg,
        #e6f3ff -6.58%,
        #e8f1ff 23.49%,
        #eaefff 59.35%,
        #a7c3ff 73.53%,
        #0852e5 99.42%
    );

    .common-layout-header {
        padding: 16px 0;
    }
}

.control {
    height: 100%;
    width: 100%;
    overflow: auto;
    display: flex;
    gap: 16px;

    .layout-left {
        overflow: auto;
        flex: none;
        border-radius: 4px;
        background: linear-gradient(180deg, #f0f6ff 0%, #f6f9ff 94.49%);
        position: relative;

        .collapse-icon {
            text-align: right;
            padding: 10px 20px;
            transition: all 0.8s;
            position: absolute;
            bottom: 0;
            right: 0;
            width: 240px;
            .el-icon {
                cursor: pointer;
            }
        }
        .collapse-icon-open {
            width: auto !important;
        }
    }

    .layout-right {
        flex: 1;
        background: linear-gradient(180deg, #f0f6ff 0%, #f6f9ff 94.49%);
        display: flex;
        flex-direction: column;
        overflow: hidden;

        .breadcrumb-area {
            padding: 0 24px;
            flex: none;
            :deep(.el-breadcrumb) {
                padding: 16px 0;
            }
        }
        .content {
            padding: 0 24px 16px;
            position: relative;
            flex: 1;
            min-width: 0;
            overflow-y: auto;
            overflow-x: hidden;
        }
        .content.noPadding {
            padding: 0;
        }
    }
}

:deep(.el-breadcrumb__item) {
    .el-breadcrumb__inner {
        color: #7f8ecd !important;
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
.el-menu {
    border-right: none;
    background: transparent !important;
}
:deep(.el-sub-menu .el-menu) {
    background: transparent !important;
}
.el-menu-item:hover {
    background: #dbe8ff;
}
.is-active {
    background: #f3f8ff !important;
}
:deep(.el-sub-menu.is-active > .el-sub-menu__title) {
    color: #055dd9 !important;
}
:deep(.el-menu-item.is-active) {
    background: #dbe8ff !important;
}
</style>
