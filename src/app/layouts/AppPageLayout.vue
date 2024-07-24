<script setup lang="ts"></script>

<template>
  <!-- <QHeader :fixed="false" class="bg-grey-6">
    <QToolbar>
      <QToolbarTitle><div class="flex items-center justify-center">Tests for the developer</div></QToolbarTitle>
    </QToolbar>
  </QHeader> -->

  <QPageContainer>
    <slot name="content" />
  </QPageContainer>
</template>

<style lang="scss"></style>
