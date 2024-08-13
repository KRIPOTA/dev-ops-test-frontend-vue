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
          <div
            v-if="!questionsStore.isLoading && currentQuestion"
            :class="[$style.question, 'full-width flex column items-center justify-center']"
          >
            <div :class="[$style.label, 'text-bold']">{{ currentQuestion?.question }}</div>
            <div class="full-width flex column">
              <div
                :class="[
                  'q-mt-sm',
                  $style.option,
                  {
                    [$style.optionCorrect]:
                      index == currentQuestion?.correctAnswerIndex && isBoolean(currentQuestion?.isAnswerCorrect),
                    [$style.optionUnCorrect]: currentQuestion?.isAnswerCorrect == false && index == answerIndex,
                    [$style.optionBlink]:
                      currentQuestion?.isAnswerCorrect == false && index == currentQuestion?.correctAnswerIndex,
                  },
                ]"
                v-for="(text, index) in currentQuestion?.answers"
                :key="index"
                color="primary"
                @click="chooseOption(index)"
              >
                {{ text }}
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
            <div class="q-mt-lg">
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
                title="Статистика"
              />
            </div>

            <div
              v-if="isBoolean(currentQuestion?.isAnswerCorrect) && !questionsStore.isLoading"
              :class="[$style.info, 'text-bold q-mt-lg']"
            >
              На этот вопрос верно ответило: {{ percentAnswerCorrect }}%
            </div>
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
      .testTitle {
        font-size: 1.25rem;
        font-weight: 700;
        line-height: 1rem;
        letter-spacing: 0.0125em;
      }

      .warning {
        text-align: center;
        padding: 5px 20px;
        font-size: 16px;
        border-radius: 5px;
        background: rgb(255, 179, 40);
      }

      .question {
        .label {
          font-size: 20px;
          font-weight: 200;
          padding: 0 35px;
          line-height: 25px;
          margin-bottom: 7px;
          color: white;
          text-align: center;
        }

        .option {
          border-radius: 10px;
          padding: 5px 25px;
          background: #585dff;
          width: 100%;
          font-size: 20px;
          text-align: center;
          color: #ffffff;

          &Correct {
            background: rgb(96 169 23);
          }

          &UnCorrect {
            background: #e51400;
          }

          &Blink {
            animation: blink 2s infinite;
          }

          @keyframes blink {
            70% {
              opacity: 70%;
            }
          }
        }

        .count {
          padding: 5px;
          color: white;
          font-size: 16px;
          font-weight: 800;
          margin-left: auto;
          margin-top: 10px;
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
          :global(.q-table__top) {
            justify-content: center;
            border-bottom: 1px solid #d4d4d4;
          }

          table,
          td,
          th {
            font-size: 14px;
          }
        }
      }

      .info {
        padding: 5px 20px;
        font-size: 17px;
        border-radius: 5px;
        background: #ffe83f;
      }
    }
  }
</style>
