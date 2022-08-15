<script lang="ts" setup>
import {defineProps, ref} from "vue"
import {SETTINGS} from "@/settings"
import GuessInput from "@/components/GuessInput.vue"

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

const gameState = ref<GameState>(GameState.InProgress)

function evaluateGuess(guess: string) {
  gameState.value = guess === props.rightAnswer
      ? GameState.Won
      : GameState.Lost
}

</script>

<template>
  <guess-input @guess-given="evaluateGuess"/>

  <p v-if="gameState === GameState.Won" data-role="winning-message">You won!</p>
  <p v-if="gameState === GameState.Lost" data-role="losing-message">Better luck next time!</p>
</template>
