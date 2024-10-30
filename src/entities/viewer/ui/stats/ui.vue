<script setup lang="ts">
  import { useViewerStore } from '../../model'
  import Tabs from './Tabs.vue'

  const viewerStore = useViewerStore()
</script>
<template>
  <Tabs class="q-mt-md" :tab="viewerStore.tab" @update:tab="viewerStore.tab = $event" />

  <div v-if="viewerStore.tab == 'stats'" :class="[$style.statistics, 'flex column justify-center items-center']">
    <div class="q-mt-lg q-mb-lg">
      <QTable
        :class="$style.table"
        flat
        :rows="viewerStore.rows"
        :columns="viewerStore.columns || []"
        hide-bottom
        wrap-cells
        row-key="name"
        separator="cell"
      />
    </div>
  </div>
  <div class="q-mt-lg text-white text-center" v-else>Скоро тут появится новый контент...</div>
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

  .statistics {
    .title {
      padding: 3px 15px;
      border: 1px solid #006eaf;
      color: white;
      background: #1ba1e2;
    }

    .table {
      background: #23272d;
      border-width: 0px;
      border-radius: 15px;
      padding: 7px 15px;
      color: white;
      box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);

      :global(.q-table__top) {
        justify-content: center;
        border-bottom: 1px solid #d4d4d4;
      }

      table,
      td,
      th {
        font-size: 16px;
      }
    }
  }
</style>
