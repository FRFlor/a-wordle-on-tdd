<script lang="ts" setup>
import {defineProps} from "vue"

const props = defineProps({
  guess: {
    type: String,
    required: true
  },
  rightAnswer: {
    type: String,
    required: true
  }
})

function getHintClassForLetter(letter: string, letterPosition: number): string {
  if (letter === " ") {
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
    <li v-for="(letter, letterPosition) in props.guess"
        :key="letterPosition"
        :class="getHintClassForLetter(letter, letterPosition)"
        data-role="letter"
        :data-letter="letter">
      {{ letter }}
    </li>
  </ul>
</template>