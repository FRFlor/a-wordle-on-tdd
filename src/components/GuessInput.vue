<script lang="ts" setup>
import {defineEmits, ref} from "vue"
import {SETTINGS} from "@/settings"

const guess = ref<string>("")
const emit = defineEmits(["guessGiven"])

function submitAnswerIfWordExists() {
  if (SETTINGS.allowedWords.includes(guess.value)) {
    emit("guessGiven", guess.value)
  }
}

</script>

<template>
  <input v-model="guess"
         data-role="guess"
         type="text"
         @input="guess = guess.slice(0, SETTINGS.wordSize)"
         @keydown.enter="submitAnswerIfWordExists">
</template>