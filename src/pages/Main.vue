<script setup lang="ts">
  import { onMounted } from 'vue'

  import AppPageLayout from '../app/layouts/AppPageLayout.vue'
  import { TgUserDto, useViewerStore } from '../entities/viewer'

  const viewerStore = useViewerStore()

  onMounted(async () => {
    const tgWebApp = window['Telegram'].WebApp || null

    if (!tgWebApp) return

    const tgUser = tgWebApp?.initDataUnsafe?.use || (null as TgUserDto | null)

    await viewerStore.init(tgUser)
  })
</script>
<template>
  <AppPageLayout>
    <template #content>
      <div class="flex items-center justify-center" style="height: 100px">
        <QBtn v-if="viewerStore.isInited" color="primary" label="DevOps Test" :to="{ name: 'TEST' }" />
        <QSpinner v-else color="primary" size="3em" style="position: absolute; top: 50%; left: 42%" />
      </div>
    </template>
  </AppPageLayout>
</template>

<script setup lang="ts"></script>
