<script lang="ts" setup>
import {defineProps, ref} from "vue"
import {SETTINGS} from "@/configurations"

const props = defineProps({
  rightAnswer: {
    type: String,
    validator: (wordGiven: string) => wordGiven.length === SETTINGS.wordSize
  }
})

const guess = ref<string>("")
const hasWon = ref<boolean>(false)

function submitAnswer() {
  hasWon.value = guess.value === props.rightAnswer
}
</script>

<template>
  <input v-model="guess" data-role="guess" type="text" @keydown.enter="submitAnswer">

  <p v-if="hasWon" data-role="winning-message">You won!</p>
</template>
