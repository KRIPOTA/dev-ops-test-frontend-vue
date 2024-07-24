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

<style lang="scss">
  body:not(.loaded) {
    background-color: rgba(255, 255, 255, 0.6);
  }

  svg:focus {
    border: none;
    outline: none;
  }
</style>

<style module lang="scss">
  .background {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: transparent !important;
    cursor: pointer;
  }
</style>
