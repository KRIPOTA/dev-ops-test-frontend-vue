<script setup lang="ts">
  import { onMounted } from 'vue'

  import { useThemesStore } from '../entities/themes'
  import { TgUserDto, useViewerStore } from '../entities/viewer'
  import AppPageLayout from '../layouts/AppPageLayout.vue'

  const viewerStore = useViewerStore()
  const themesStore = useThemesStore()

  onMounted(async () => {
    const tgWebApp = window['Telegram'].WebApp || null
    if (!tgWebApp) return
    const tgUser = tgWebApp?.initDataUnsafe?.user || (null as TgUserDto | null)

    await viewerStore.init(tgUser)
    await themesStore.init()
  })
</script>
<template>
  <AppPageLayout>
    <template #content>
      <div
        v-if="viewerStore.isInited && !themesStore.isLoading"
        class="flex items-center justify-center"
        style="height: 100px"
      >
        <QSelect
          :class="$style.select"
          v-model="themesStore.current"
          :options="themesStore.themesAsDropdown"
          square
          outlined
          option-value="id"
          option-label="theme"
        />
        <QBtn class="q-ml-md" color="primary" label="начать" :to="{ name: 'TEST' }" />
      </div>
      <QSpinner v-else color="primary" size="3em" style="position: absolute; top: 50%; left: 42%" />
    </template>
  </AppPageLayout>
</template>

<style lang="scss" module>
  .select {
    width: 220px;
    :global(.q-field__control) {
      :global(.q-field__native) {
        color: white;
        min-height: 37px;
      }

      :global(.q-field__append) {
        color: white;
        height: 37px;
      }

      min-height: auto;
      height: 37px;
    }

    :global(.q-field__control:before) {
      border: 1px solid #585dffa8;
      border-radius: 5px;
    }
  }
</style>
