<script lang="ts" setup>
import {defineEmits, onMounted, ref} from "vue"
import {SETTINGS} from "@/settings"

const guess = ref<string>("")
const input = ref<HTMLInputElement>()
const emit = defineEmits(["guessGiven"])

function submitAnswerIfWordExists() {
  if (SETTINGS.allowedWords.includes(guess.value)) {
    emit("guessGiven", guess.value)
  }
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
         @input="guess = guess.slice(0, SETTINGS.wordSize).toUpperCase()"
         @blur="input.focus()"
         @keydown.enter="submitAnswerIfWordExists">
</template>