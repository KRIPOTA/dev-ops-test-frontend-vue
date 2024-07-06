<script setup lang="ts">
  import { QLayout } from 'quasar'
  import { computed, watch } from 'vue'

  import { mainInited } from './iframe-init/main'

  const $body = document.querySelector('body')

  // computed
  const isLoaded = computed<boolean>(() => {
    return mainInited.value
  })

  // hooks
  watch(mainInited, (value) => {
    if (!value) return
    if ($body) $body.classList.add('loaded')
  })
</script>

<template>
  <QLayout view="lHh Lpr lFf">
    <router-view />
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
