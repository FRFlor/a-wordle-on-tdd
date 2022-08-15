<script lang="ts" setup>
import {defineProps, ref} from "vue"
import {SETTINGS} from "@/settings"

enum GameState {
  InProgress = "In-Progress",
  Won = "Won",
  Lost = "Lost"
}

const props = defineProps({
  rightAnswer: {
    type: String,
    validator: (wordGiven: string) => wordGiven.length === SETTINGS.wordSize
  }
})

const guess = ref<string>("")
const gameState = ref<GameState>(GameState.InProgress)

function submitAnswer() {
  if (!SETTINGS.allowedWords.includes(guess.value)) {
    return
  }

  gameState.value = guess.value === props.rightAnswer
      ? GameState.Won
      : GameState.Lost
}
</script>

<template>
  <input v-model="guess"
         data-role="guess"
         type="text"
         @input="guess = guess.slice(0, SETTINGS.wordSize)"
         @keydown.enter="submitAnswer">

  <p v-if="gameState === GameState.Won" data-role="winning-message">You won!</p>
  <p v-if="gameState === GameState.Lost" data-role="losing-message">Better luck next time!</p>
</template>
