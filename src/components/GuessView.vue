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

</script>

<template>
  <ul data-role="past-guess">
    <li v-for="(letter, index) in props.guess"
        :key="index"
        :class="{
          'correct': letter === props.rightAnswer[index],
          'incorrect': letter !== props.rightAnswer[index] && !props.rightAnswer.includes(letter),
          'almost': letter !== props.rightAnswer[index] && props.rightAnswer.includes(letter)
        }"
        :data-letter="letter">{{ letter }}
    </li>
  </ul>
</template>