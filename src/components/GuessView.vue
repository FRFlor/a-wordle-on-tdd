<script lang="ts" setup>
import {computed, defineProps} from "vue"
import {SETTINGS} from "@/settings"

const props = defineProps({
  guess: {
    type: String,
    required: true
  },
  rightAnswer: {
    type: String,
    required: true
  },
  showHints: {
    type: Boolean,
    required: true
  }
})

const lettersToRender = computed(() => {
  return props.guess.trim().length === 0 ? " ".repeat(SETTINGS.wordSize) : props.guess
})

function getHintClassForLetter(letter: string, letterPosition: number): string {
  if (letter === " " || !props.showHints) {
    return ""
  }

  const expectedLetter = props.rightAnswer[letterPosition]

  if (letter === expectedLetter) {
    return "correct"
  }

  if (props.rightAnswer.includes(letter)) {
    return "almost"
  }

  return "incorrect"
}

</script>

<template>
  <ul data-role="guess-view">
    <li v-for="(letter, letterPosition) in lettersToRender"
        :key="letterPosition"
        :class="getHintClassForLetter(letter, letterPosition)"
        data-role="letter"
        :data-letter="letter">
      {{ letter }}
    </li>
  </ul>
</template>