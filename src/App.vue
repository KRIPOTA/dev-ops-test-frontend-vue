<script setup lang="ts">
  import { QLayout } from 'quasar'
  import { computed } from 'vue'

  import { mainInited } from './iframe-init/main'

  // computed
  const isLoaded = computed<boolean>(() => {
    return mainInited.value
  })
</script>

<template>
  <QLayout view="lHh Lpr lFf">
    <router-view v-if="isLoaded" />
  </QLayout>
</template>

<style module lang="scss">
  body:not(.loaded) {
    background-color: #1c1f24;
  }

  svg:focus {
    border: none;
    outline: none;
  }
</style>
