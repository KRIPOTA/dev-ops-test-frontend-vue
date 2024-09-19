<script setup lang="ts">
  import { computed } from 'vue'

  const emit = defineEmits<{
    (e: 'update:tab', tab: 'stats' | 'leaders'): void
  }>()

  const props = defineProps<{
    tab: 'stats' | 'leaders'
  }>()

  const isTabStats = computed(() => {
    return props.tab == 'stats'
  })
</script>
<template>
  <div :class="[$style.tabs, 'flex items-center justify-between']">
    <div
      :class="$style.option"
      :style="{ background: isTabStats ? '#1C1F24' : undefined }"
      @click="emit('update:tab', 'stats')"
    >
      Статистика
    </div>
    <div
      :class="$style.option"
      :style="{ background: !isTabStats ? '#1C1F24' : undefined }"
      @click="emit('update:tab', 'leaders')"
    >
      Лидеры
    </div>
  </div>
</template>

<style module lang="scss">
  .tabs {
    height: 60px;
    width: 100%;
    padding: 0px 30px;
    background-color: #23272d;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.2509803922);
    border-radius: 10px;

    .option {
      padding: 4px 10px;
      border-radius: 8px;
      color: white;
      height: 40px;
      font-size: 23px;
      font-weight: 400;
      line-height: 30px;
      letter-spacing: -0.3000000119px;
      text-align: center;
    }
  }
</style>
