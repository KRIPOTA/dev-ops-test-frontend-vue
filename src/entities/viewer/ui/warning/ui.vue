<script setup lang="ts"></script>
<template>
  <div :class="[$style.warning, 'text-bold']">Дневной лимит исчерпан. Приходи завтра.</div>
</template>

<style module lang="scss">
  .warning {
    text-align: center;
    padding: 5px 20px;
    font-size: 16px;
    border-radius: 5px;
    background: rgb(255, 179, 40);
  }
</style>
