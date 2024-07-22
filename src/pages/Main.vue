<script setup lang="ts">
  import { onMounted } from 'vue'

  import AppPageLayout from '../app/layouts/AppPageLayout.vue'
  import { useTestsStore } from '../entities/tests'

  const testsStore = useTestsStore()

  onMounted(() => {
    testsStore.init()
  })
</script>
<template>
  <AppPageLayout>
    <template #content>
      <div class="flex items-center justify-center" style="height: 100px">
        <QBtn
          color="primary"
          label="Открыть DevOps Test"
          @click="useTestsStore().initCurrent(0)"
          :to="{ name: 'TEST' }"
        />
      </div>
    </template>
  </AppPageLayout>
</template>

<script setup lang="ts"></script>
