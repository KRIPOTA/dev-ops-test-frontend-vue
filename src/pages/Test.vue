<script setup lang="ts">
  import { isBoolean } from 'lodash'
  import { Notify } from 'quasar'
  import { computed, onMounted, ref } from 'vue'

  import { QuestionComponent } from '../entities/questions'
  import { useQuestionsStore } from '../entities/questions/model/questions.store'
  import { useThemesStore } from '../entities/themes'
  import { useViewerStore } from '../entities/viewer'
  import { Stats, WarningLimit } from '../entities/viewer/ui'
  import AppPageLayout from '../layouts/AppPageLayout.vue'

  const questionsStore = useQuestionsStore()
  const viewerStore = useViewerStore()

  //refs
  const currentIndex = ref(0)
  const answerIndex = ref(0)

  const currentQuestion = computed(() => questionsStore?.questions[currentIndex.value])
  const overIndex = computed(() => questionsStore.questions.length - 1)

  const questionsIsOver = computed(
    () =>
      (!questionsStore.isAdditionalQuestionsLoaded
        ? currentIndex.value == overIndex.value
        : currentIndex.value == overIndex.value + 20) && isBoolean(currentQuestion.value.isAnswerCorrect)
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
        const limit = useThemesStore().isCurrentThemeRandom ? 20 : 10
        Notify.create({
          type: 'positive',
          message: `Вы верно решили 90% вопросов! За это мы добавляем вам еще ${limit} вопросов!`,
          position: 'top',
        })
        await questionsStore.loadAdditionalQuestions(limit)
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
            :disableNextButton="currentQuestion.isAnswerCorrect == null"
            @choose-option="chooseOption($event)"
            @next="next"
          />

          <QSpinner v-if="questionsStore.isLoading" style="position: absolute; top: 50%; left: 42%" />

          <WarningLimit
            class="q-mt-md"
            v-if="viewerStore.isAlreadyVisitToday && !questionsStore.isAdditionalQuestionsLoaded"
          />

          <Stats />

          <div
            v-if="isBoolean(currentQuestion?.isAnswerCorrect) && !questionsStore.isLoading"
            :class="[$style.info, 'text-bold']"
          >
            На этот вопрос верно ответило: {{ percentAnswerCorrect }}%
          </div>
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

      .info {
        padding: 5px 20px;
        font-size: 17px;
        border-radius: 5px;
        background: #ffe83f;
      }
    }
  }
</style>
