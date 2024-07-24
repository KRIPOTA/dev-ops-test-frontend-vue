<script setup lang="ts">
  import { isBoolean } from 'lodash'
  import { computed, onMounted, ref, watch } from 'vue'

  import AppPageLayout from '../app/layouts/AppPageLayout.vue'
  import { useQuestionsStore } from '../entities/questions/model/questions.store'
  import { useViewerStore } from '../entities/viewer'

  const questionsStore = useQuestionsStore()
  const viewerStore = useViewerStore()

  //refs
  const currentQuestionIndex = ref(0)
  const answerIndex = ref(0)

  //computed
  const currentQuestion = computed(() => questionsStore?.questions[currentQuestionIndex.value])

  const questionsIsOver = computed(
    () => currentQuestionIndex.value == 9 && isBoolean(currentQuestion.value.isAnswerCorrect)
  )

  const percentAnswerCorrect = computed(() => {
    const percent = ((currentQuestion.value.countTrueAnswer || 0) / (currentQuestion.value.countPublish || 0)) * 100
    return Math.ceil(percent || 0)
  })

  //methods
  const chooseOption = (index: number) => {
    if (isBoolean(currentQuestion.value.isAnswerCorrect)) return

    const isAnswerCorrect = index == currentQuestion.value.correctAnswerIndex

    answerIndex.value = index
    currentQuestion.value.isAnswerCorrect = isAnswerCorrect

    if (!viewerStore.viewer) return

    viewerStore.initialStats.questionsAnswer = (viewerStore?.initialStats?.questionsAnswer || 0) + 1
    viewerStore.viewer.stats.questionsAnswer = (viewerStore.viewer?.stats.questionsAnswer || 0) + 1

    if (isAnswerCorrect) {
      viewerStore.initialStats.questionsAnswerTrue = (viewerStore?.initialStats?.questionsAnswerTrue || 0) + 1
      viewerStore.viewer.stats.questionsAnswerTrue = (viewerStore.viewer?.stats.questionsAnswerTrue || 0) + 1
    }
  }

  const onSwipe = () => {
    if (currentQuestion.value.isAnswerCorrect == null || questionsIsOver.value) return
    currentQuestionIndex.value = currentQuestionIndex.value + 1
  }

  //hooks
  watch(questionsIsOver, async () => {
    if (questionsIsOver.value) {
      await questionsStore.updateQuestions()
      await viewerStore.updateUserStats()
    }
  })

  onMounted(() => {
    if (!viewerStore.isAlreadyVisitToday) questionsStore.init()
  })
</script>
<template>
  <AppPageLayout>
    <template #content>
      <div :class="$style.container">
        <div v-touch-swipe.left="onSwipe" :class="[$style.wrapper, 'flex items-center justify-center']">
          <div :class="$style.testTitle">DevOps Test</div>

          <div
            v-if="!questionsStore.isLoading && currentQuestion"
            :class="[$style.question, 'full-width flex column items-center justify-center']"
          >
            <div :class="[$style.label, 'text-bold']">{{ currentQuestion?.question }}</div>
            <div>
              <div
                :class="[
                  'q-mt-sm',
                  $style.option,
                  {
                    [$style.optionCorrect]:
                      index == currentQuestion?.correctAnswerIndex && isBoolean(currentQuestion?.isAnswerCorrect),
                    [$style.optionUnCorrect]: currentQuestion?.isAnswerCorrect == false && index == answerIndex,
                  },
                ]"
                v-for="(text, index) in currentQuestion?.answers"
                :key="index"
                @click="chooseOption(index)"
              >
                {{ index + 1 }}. {{ text }}
              </div>
            </div>
            <div :class="$style.count">
              Вопрос {{ currentQuestionIndex + 1 }} из {{ questionsStore.questions.length }}
            </div>
          </div>

          <QSpinner v-if="questionsStore.isLoading" style="position: absolute; top: 50%; left: 42%" />

          <div v-if="viewerStore.isAlreadyVisitToday" :class="[$style.warning, 'text-bold']">
            Дневной лимит исчерпан. Приходи завтра.
          </div>

          <div :class="[$style.statistics, 'flex column justify-center items-center']">
            <div :class="$style.title">Статистика</div>
            <div class="q-mt-md">
              <QTable
                :class="$style.table"
                flat
                bordered
                :rows="viewerStore.rows"
                :columns="viewerStore.columns || []"
                hide-bottom
                wrap-cells
                row-key="name"
                separator="cell"
              />
            </div>
          </div>

          <div
            v-if="isBoolean(currentQuestion?.isAnswerCorrect) && !questionsStore.isLoading"
            :class="[$style.info, 'text-bold']"
          >
            На этот вопрос верно ответило: {{ percentAnswerCorrect }}%
          </div>
        </div>
      </div>
    </template>
  </AppPageLayout>
</template>

<style module lang="scss">
  .container {
    font-size: 15px;
    padding: 15px;

    .wrapper {
      padding: 15px;
      gap: 15px;
      border: 1px solid black;
      border-radius: 20px;

      .testTitle {
        font-size: 1.25rem;
        font-weight: 700;
        line-height: 1rem;
        letter-spacing: 0.0125em;
      }

      .warning {
        padding: 5px;
        border: 1px solid #e2b035;
        text-align: center;
        background: linear-gradient(0deg, rgba(255, 179, 40, 1) 20%, rgba(255, 255, 255, 1) 100%);
      }

      .question {
        .label {
          padding: 5px;
          margin-bottom: 7px;
          border: 1px solid #009500;
          background: rgba(0, 149, 0, 0.1803921569);
          border-radius: 5px;
          text-align: center;
        }

        .option {
          padding: 0 5px;

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
        .title {
          padding: 3px 15px;
          border: 1px solid #006eaf;
          color: white;
          background: #1ba1e2;
        }

        .table {
          table,
          th,
          td {
            border: 1px dashed black !important;
            border-color: black !important;
            border-collapse: collapse !important;
          }
        }
      }

      .info {
        padding: 3px 15px;
        border: 1px solid #bba000;
        background: #e3c800;
      }
    }
  }
</style>
