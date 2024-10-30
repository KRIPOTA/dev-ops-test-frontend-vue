<script setup lang="ts"></script>

<template>
  <!-- <QHeader :fixed="false" class="bg-grey-6">
    <QToolbar>
      <QToolbarTitle><div class="flex items-center justify-center">Tests for the developer</div></QToolbarTitle>
    </QToolbar>
  </QHeader> -->

  <QPageContainer>
    <QHeader style="background: #14161a" class="text-white">
      <QToolbar class="justify-center">
        <div style="font-size: 15px; font-weight: bold" class="text-center">
          Тренажёр знаний специалистов SysOps/DevOps/SRE
        </div>
      </QToolbar>
    </QHeader>
    <slot name="content" />
  </QPageContainer>
</template>

<style lang="scss"></style>
