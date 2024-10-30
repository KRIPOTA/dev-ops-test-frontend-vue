<script setup lang="ts">
  import { onMounted } from 'vue'

  import { useThemesStore } from '../entities/themes'
  import { Stats, TgUserDto, useViewerStore, WarningLimit } from '../entities/viewer'
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
      <template v-if="viewerStore.isInited && !themesStore.isLoading">
        <div v-if="viewerStore.isAlreadyVisitToday" style="padding: 0 15px">
          <WarningLimit class="q-mt-md" />
          <Stats />
        </div>
        <div v-else style="padding: 0 15px" class="flex column q-mt-md">
          <div style="font-size: 13px" class="text-center text-white">
            Выберите нужную тему или проверьте знания по разным
          </div>
          <div class="flex items-center justify-center q-mt-xs">
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
        </div>
      </template>

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
