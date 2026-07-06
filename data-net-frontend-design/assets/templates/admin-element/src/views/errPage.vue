<template>
    <el-result :icon="icon" :title="title" :sub-title="subTitle">
        <template #extra>
            <el-button type="primary" @click="$router.push('/')">返回首页</el-button>
        </template>
    </el-result>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const code = computed(() => route.params.code || '404');
const icon = computed(() => (code.value === '403' ? 'warning' : 'info'));
const title = computed(() => (code.value === '403' ? '无权访问' : '页面不存在'));
const subTitle = computed(() => (code.value === '403' ? '您没有权限访问该页面' : '您访问的页面走丢了'));
</script>
