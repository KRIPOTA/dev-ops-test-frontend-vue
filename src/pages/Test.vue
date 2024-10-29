<script setup lang="ts">
  import { isBoolean } from 'lodash'
  import { Notify } from 'quasar'
  import { computed, onMounted, ref } from 'vue'

  import { QuestionComponent, Tabs } from '../entities/questions'
  import { useQuestionsStore } from '../entities/questions/model/questions.store'
  import { useThemesStore } from '../entities/themes'
  import { useViewerStore } from '../entities/viewer'
  import AppPageLayout from '../layouts/AppPageLayout.vue'

  const OVER_QUESTION_INDEX = 19
  const themesStore = useThemesStore()
  const questionsStore = useQuestionsStore()
  const viewerStore = useViewerStore()

  //refs
  const currentIndex = ref(0)
  const answerIndex = ref(0)
  // const translateX = ref(0)
  // const startX = ref(0)
  // const endX = ref(0)
  // const needClass = ref(false)
  // const isNotifyAlreadyShown = ref(false)

  //computed
  // const maxTranslateX = computed(() => -window.innerWidth / 3.5 || -130)

  const currentQuestion = computed(() => questionsStore?.questions[currentIndex.value])

  const questionsIsOver = computed(
    () =>
      (!questionsStore.isAdditionalQuestionsLoaded
        ? currentIndex.value == OVER_QUESTION_INDEX
        : currentIndex.value == OVER_QUESTION_INDEX + 20) && isBoolean(currentQuestion.value.isAnswerCorrect)
  )

  const percentAnswerCorrect = computed(() => {
    const percent = ((currentQuestion.value.countTrueAnswer || 0) / (currentQuestion.value.countPublish || 0)) * 100
    return Math.ceil(percent || 0)
  })

  //methods
  const chooseOption = async (index: number) => {
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

    if (viewerStore.loginFirst && currentIndex.value == 0 && isBoolean(currentQuestion.value.isAnswerCorrect)) {
      Notify.create({
        type: 'warning',
        message: 'Для перехода к следующему вопросу сделай свайп вправо',
        position: 'top',
      })
    }

    if (questionsIsOver.value) {
      if (!questionsStore.isAdditionalQuestionsLoaded) await questionsStore.updateQuestions()
      if (viewerStore.percentCorrectAnswer.today >= 90 && !questionsStore.isAdditionalQuestionsLoaded) {
        Notify.create({
          type: 'positive',
          message: 'Вы верно решили 90% вопросов! За это мы добавляем вам еще +20 вопросов!',
          position: 'top',
        })
        await questionsStore.loadAdditionalQuestions()
      }
      if (questionsStore.isAdditionalQuestionsLoaded && viewerStore.isStatsUpdated) {
        questionsStore.isAdditionalQuestionsLoaded = false
      }
      await viewerStore.updateUserStats()
    }
  }

  const next = () => {
    currentIndex.value += 1
  }

  // const touchStart = (e) => {
  //   if (currentIndex.value < questionsStore?.questions.length - 1) {
  //     startX.value = e.touches[0].clientX
  //   }
  // }

  // const touchMove = (e) => {
  //   if (currentQuestion.value.isAnswerCorrect == null) {
  //     if (!isNotifyAlreadyShown.value) {
  //       Notify.create({
  //         message: 'Для того, чтобы перейти к следующему вопросу, нужно ответить на этот',
  //         type: 'warning',
  //       })
  //     }
  //     isNotifyAlreadyShown.value = true
  //     startX.value = 0
  //     endX.value = 0
  //     translateX.value = 0
  //     return
  //   }
  //   if (currentIndex.value < questionsStore?.questions.length - 1) {
  //     endX.value = e.touches[0].clientX
  //     if ((endX.value - startX.value) / 2 < maxTranslateX.value) {
  //       translateX.value = maxTranslateX.value
  //     } else {
  //       translateX.value = (endX.value - startX.value) / 2
  //     }
  //   }
  // }
  // const touchEnd = () => {
  //   if (currentQuestion.value.isAnswerCorrect == null) {
  //     return
  //   }
  //   if (translateX.value > maxTranslateX.value) {
  //     needClass.value = true
  //     startX.value = 0
  //     endX.value = 0
  //     translateX.value = 0
  //     setTimeout(() => {
  //       needClass.value = false
  //     }, 500)
  //   } else {
  //     currentIndex.value += 1
  //     startX.value = 0
  //     endX.value = 0
  //     translateX.value = 0
  //   }
  // }

  onMounted(async () => {
    if (!viewerStore.isAlreadyVisitToday) questionsStore.init()
  })
</script>
<template>
  <AppPageLayout>
    <template #content>
      <div v-if="viewerStore.isInited" :class="$style.container">
        <div :class="[$style.wrapper, 'flex items-center justify-center']">
          <QuestionComponent
            v-if="!questionsStore.isLoading && currentQuestion"
            :question="currentQuestion"
            :answer-index="answerIndex"
            :index="currentIndex"
            @choose-option="chooseOption($event)"
            @next="next"
          />

          <QSpinner v-if="questionsStore.isLoading" style="position: absolute; top: 50%; left: 42%" />
          <!-- <QBtn
            :class="{ [$style.buttonNext]: needClass }"
            round
            :color="Math.abs(translateX) >= Math.abs(maxTranslateX) ? 'primary' : 'white'"
            icon="arrow_forward"
            :text-color="Math.abs(translateX) >= Math.abs(maxTranslateX) ? 'white' : 'primary'"
            :style="{
              zIndex: '10',
              transform: `translateX(${translateX}px)`,
              position: 'absolute',
              right: '-45px',
              boxShadow: `0px 0px 0px ${Math.abs(translateX) / 8}px rgb(88 93 255 / 66%)`,
            }"
          /> -->
          <div
            v-if="viewerStore.isAlreadyVisitToday && !questionsStore.isAdditionalQuestionsLoaded"
            :class="[$style.warning, 'text-bold']"
          >
            Дневной лимит исчерпан. Приходи завтра.
          </div>

          <Tabs class="q-mt-md" :tab="questionsStore.tab" @update:tab="questionsStore.tab = $event" />

          <div
            v-if="questionsStore.tab == 'stats'"
            :class="[$style.statistics, 'flex column justify-center items-center']"
          >
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

            <div
              v-if="isBoolean(currentQuestion?.isAnswerCorrect) && !questionsStore.isLoading"
              :class="[$style.info, 'text-bold']"
            >
              На этот вопрос верно ответило: {{ percentAnswerCorrect }}%
            </div>
          </div>
          <div class="q-mt-lg text-white" v-else>Скоро тут появится новый контент...</div>
        </div>
      </div>
      <QSpinner v-else color="primary" size="3em" style="position: absolute; top: 50%; left: 42%" />
    </template>
  </AppPageLayout>
</template>

<style module lang="scss">
  .container {
    font-size: 15px;
    padding: 15px;

    .wrapper {
      position: relative;
      overflow: hidden;

      .buttonNext {
        transition: transform 0.5s ease-in-out;
      }

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

      .info {
        padding: 5px 20px;
        font-size: 17px;
        border-radius: 5px;
        background: #ffe83f;
      }
    }
  }
</style>
