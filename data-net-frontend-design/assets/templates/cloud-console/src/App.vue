<template>
  <a class="skip-link" href="#main-content">跳到主内容</a>
  <TopNotice />
  <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import TopNotice from './components/portal/TopNotice.vue'
</script>
