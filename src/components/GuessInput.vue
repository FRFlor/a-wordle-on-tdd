<script lang="ts" setup>
import {SETTINGS} from "@/settings"
import {onMounted, ref} from "vue"

const guess = ref<string>("")
const input = ref<HTMLInputElement>()
const emit = defineEmits(["guessGiven", "guessUpdated"])

function submitAnswerIfWordExists() {
  if (SETTINGS.allowedWords.includes(guess.value)) {
    emit("guessGiven")

    guess.value = ""
    emit("guessUpdated", guess.value)
  }
}

function sanitizeGuess() {
  const rawInput = guess.value.toUpperCase()

  const onlyAllowLetters = (word: string) => word.replaceAll(/[^a-z]/gi, "")
  const inputWithJustLetters = onlyAllowLetters(rawInput)

  const limitLength = (word: string) => word.slice(0, SETTINGS.wordSize)

  guess.value = limitLength(inputWithJustLetters)

  emit("guessUpdated", guess.value)
}

onMounted(() => {
  input.value?.focus()
})
</script>

<template>
  <input v-model="guess"
         ref="input"
         data-role="guess"
         type="text"
         @input="sanitizeGuess"
         @blur="input.focus()"
         @keydown.enter="submitAnswerIfWordExists">
</template>

<style scoped>
input {
  position: absolute;
  transform: scale(0);
}
</style>