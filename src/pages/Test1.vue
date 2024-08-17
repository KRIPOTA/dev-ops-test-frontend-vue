<template>
  <div class="question-container" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
    <div class="question-card" v-if="!animateOut" :style="{ transform: `translateX(${translateX}px)` }">
      <div class="question-card-content">
        {{ questions[currentIndex] }}
      </div>
    </div>
    <div
      v-if="currentIndex < questions.length - 1 && !animateOut1"
      class="next-question-card"
      :style="{ transform: `translateX(${nextTranslateX}px)` }"
    >
      <div class="question-card-content">
        {{ questions[currentIndex + 1] }}
      </div>
    </div>
  </div>
  <div>asdsadasdsad</div>
</template>

<script>
  export default {
    data() {
      return {
        questions: ['Question 1', 'Question 2', 'Question 3'],
        currentIndex: 0,
        startX: 0,
        endX: 0,
        translateX: 0,
        nextTranslateX: window.innerWidth,
        animateOut: false,
        animateOut1: false,
      }
    },
    methods: {
      touchStart(event) {
        if (this.currentIndex < this.questions.length - 1) {
          this.startX = event.touches[0].clientX
        }
      },
      touchMove(event) {
        if (this.currentIndex < this.questions.length - 1) {
          this.endX = event.touches[0].clientX
          this.translateX = this.endX - this.startX
          this.nextTranslateX = window.innerWidth - Math.abs(this.translateX)
          if (this.nextTranslateX < 0) {
            this.nextTranslateX = 0
          }
        }
      },
      touchEnd() {
        if (this.currentIndex < this.questions.length - 1 && this.translateX < 0 && Math.abs(this.translateX) > 50) {
          this.swipeNext()
        } else {
          this.translateX = 0
          this.nextTranslateX = window.innerWidth
        }
      },
      swipeNext() {
        this.animateOut = true
        this.translateX = -window.innerWidth
        this.nextTranslateX = 0
        setTimeout(() => {
          this.currentIndex++
          this.translateX = 0
          this.animateOut1 = true
          this.nextTranslateX = window.innerWidth
          setTimeout(() => {
            this.animateOut1 = false
          }, 100)
          this.animateOut = false
        }, 300)
      },
    },
  }
</script>

<style>
  .question-container {
    overflow: hidden;
    width: 80%; /* adjust the width to fit your needs */
    margin: 40px auto;
    border-radius: 10px;
  }

  .question-card {
    display: block; /* change to block */
    width: 100%;
    background-color: #fff;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    transition: visibility 0.3s ease;
  }

  .animate-out {
    visibility: hidden;
    transition: visibility 0.3s ease;
  }

  .next-question-card {
    display: block; /* change to block */
    width: 100%;
    background-color: #fff;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    visibility: hidden; /* add this line */
    transition: visibility 0.3s ease;
  }

  .question-card-content {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
  }
</style>
