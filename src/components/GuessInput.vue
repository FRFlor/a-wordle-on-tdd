<script lang="ts" setup>
import {defineEmits, onMounted, ref} from "vue"
import {SETTINGS} from "@/settings"

const guess = ref<string>("")
const input = ref<HTMLInputElement>()
const emit = defineEmits(["guessGiven"])

function submitAnswerIfWordExists() {
  if (SETTINGS.allowedWords.includes(guess.value)) {
    emit("guessGiven", guess.value)
    guess.value = ""
  }
}

function sanitizeInput() {
  const rawInput = guess.value.toUpperCase()

  const onlyAllowLetters = (word: string) => word.replaceAll(/[^a-z]/gi, "")
  const inputWithJustLetters = onlyAllowLetters(rawInput)

  const limitLength = (word: string) => word.slice(0, SETTINGS.wordSize)

  guess.value = limitLength(inputWithJustLetters)
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
         @input="sanitizeInput"
         @blur="input.focus()"
         @keydown.enter="submitAnswerIfWordExists">
</template>