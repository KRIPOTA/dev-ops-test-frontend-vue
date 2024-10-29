<script setup lang="ts">
  import { isBoolean } from 'lodash'

  import { useQuestionsStore } from '../../model/questions.store'
  import { Question } from '../../types/general.types'

  const questionsStore = useQuestionsStore()

  const emit = defineEmits<{
    (e: 'chooseOption', index: number): void
    (e: 'next'): void
  }>()

  defineProps<{
    question: Question
    answerIndex: number
    index: number
  }>()
</script>
<template>
  <div :class="[$style.question, 'full-width flex column items-center justify-center']">
    <div :class="[$style.label, 'text-bold']">{{ question?.question }}</div>
    <div class="full-width flex column">
      <div
        :class="[
          'q-mt-sm',
          $style.option,
          {
            [$style.optionCorrect]: index == question?.correctAnswerIndex && isBoolean(question?.isAnswerCorrect),
            [$style.optionUnCorrect]: question?.isAnswerCorrect == false && index == answerIndex,
            [$style.optionBlink]: question?.isAnswerCorrect == false && index == question?.correctAnswerIndex,
          },
        ]"
        v-for="(text, index) in question?.answers"
        :key="index"
        @click="emit('chooseOption', index)"
      >
        {{ text }}
      </div>
    </div>
    <div class="full-width flex items-center justify-between" style="margin-top: 10px">
      <div :class="$style.count">Вопрос {{ index + 1 }} из {{ questionsStore.questions.length }}</div>
      <QBtn :class="$style.button" label="Далее" icon-right="arrow_forward" color="green" @click="emit('next')" />
    </div>
  </div>
</template>

<style module lang="scss">
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
    }

    .button {
      min-height: auto;
      i {
        font-size: 20px;
      }
    }
  }
</style>
