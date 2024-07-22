<script setup lang="ts">
  import { TouchPan } from 'quasar'
  import { computed, onMounted, ref } from 'vue'

  import AppPageLayout from '../app/layouts/AppPageLayout.vue'
  import { useTestsStore } from '../entities/tests'
  import { useViewerStore } from '../entities/viewer'
  import { arrayToObjectByKey } from '../shared/utils'

  const testStore = useTestsStore()
  const viewerStore = useViewerStore()

  //refs
  const currentQuestionId = ref(0)
  const panX = ref(0)
  const panY = ref(0)

  //computed
  const currentQuestion = computed(() => testStore?.questionsById[currentQuestionId.value])
  const currentViewerQuestion = computed(() =>
    viewerStore.currentTaskById[testStore.currentTask?.id || 0]?.questions.find((q) => q.id == currentQuestionId.value)
  )
  const optionById = computed(() => arrayToObjectByKey(currentQuestion.value?.options || [], 'id'))

  //methods
  const chooseOption = (optionId: number) => {
    const currentTask = viewerStore.currentTaskById[testStore.currentTask?.id || 0]

    if (!currentTask) return

    const isQuestionExist = currentTask.questions.find((q) => q.id == currentQuestion.value?.id)

    if (isQuestionExist) return

    currentTask.questions.push({ id: currentQuestion.value?.id || 0, chooseOptionId: optionId })
  }

  const onPan = (e: any) => {
    const questionIndex = testStore.currentTask?.questions.findIndex((q) => q.id == currentQuestion.value?.id)
    const isDirectionLeft = e?.direction == 'left'
    if (questionIndex == 0 && !isDirectionLeft) return
    panX.value = isDirectionLeft ? -e.distance.x : e.distance.x
  }

  const onTouchEnd = () => {
    const innerWidth = window.innerWidth
    if (panX.value < 0 && Math.abs(panX.value || 0) / innerWidth > 0.6) {
      currentQuestionId.value = currentQuestionId.value + 1
    } else if (panX.value > 0 && Math.abs(panX.value || 0) / innerWidth > 0.6) {
      currentQuestionId.value = currentQuestionId.value - 1
    }
    panX.value = 0
  }

  //hooks
  onMounted(() => {
    currentQuestionId.value = 0
  })
</script>
<template>
  <AppPageLayout>
    <template #content>
      <div :class="$style.container">
        <div
          :class="[$style.wrapper, 'flex items-center justify-center']"
          :style="{ transform: `translate(${panX}px, ${panY}px)` }"
        >
          <div class="text-h6">{{ testStore.currentTask?.name }}</div>

          <div
            v-touch-pan.stop="onPan"
            @touchend="onTouchEnd"
            :class="[$style.question, 'full-width flex column items-center justify-center']"
            v-if="!!currentQuestion"
          >
            <div :class="[$style.title, 'text-bold']">{{ currentQuestion.text }}</div>
            <div>
              <div
                :class="[
                  'q-mt-sm',
                  !currentViewerQuestion || (currentViewerQuestion?.chooseOptionId !== option.id && !option.isRight)
                    ? $style.option
                    : optionById[currentViewerQuestion?.chooseOptionId]?.isRight ||
                      (!optionById[currentViewerQuestion?.chooseOptionId]?.isRight && option.isRight)
                    ? $style.optionCorrect
                    : $style.optionUnCorrect,
                ]"
                v-for="(option, index) in currentQuestion.options"
                :key="option.id"
                @click="chooseOption(option.id)"
              >
                {{ index + 1 }}. {{ option.text }}
              </div>
            </div>
            <div :class="$style.count">
              Вопрос {{ currentQuestionId + 1 }} из {{ currentQuestion.options.length + 1 }}
            </div>
          </div>

          <div :class="[$style.statistics, 'flex column justify-center items-center']">
            <div :class="$style.title">Статистика</div>
            <div class="q-mt-md">
              <div>Правильных ответов всего: 90%</div>
              <div>Решено: 20 вопросов</div>
            </div>
          </div>

          <div :class="[$style.info, 'text-bold q-mt-md']">На этот вопрос верно ответило: 23%</div>
        </div>
      </div>
    </template>
  </AppPageLayout>
</template>

<style module lang="scss">
  .container {
    font-size: 17px;
    padding: 15px;

    .wrapper {
      padding: 15px;
      border: 1px solid black;
      border-radius: 20px;
    }

    .question {
      padding: 15px 0px;

      .title {
        padding: 5px;
        margin-bottom: 7px;
        border: 1px solid #009500;
        background: #0095002e;
      }

      .option {
        &Correct {
          margin-top: 6px !important;
          border: 1px solid #2d7600;
          color: white;
          background: rgb(96 169 23);
        }

        &UnCorrect {
          margin-top: 6px !important;
          border: 1px solid #b20000;
          background: #e51400;
          color: white;
        }
      }

      .count {
        padding: 5px;
        border: 1px solid #8ba7d0;
        background: #dae8fc;
        margin-left: auto;
        margin-top: 15px;
      }
    }

    .statistics {
      margin-top: 40px;

      .title {
        padding: 3px 15px;
        border: 1px solid #006eaf;
        color: white;
        background: #1ba1e2;
      }
    }

    .info {
      padding: 3px 15px;
      border: 1px solid #bba000;
      background: #e3c800;
    }
  }
</style>
