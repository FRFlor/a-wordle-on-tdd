<script lang="ts" setup>
import {defineProps, ref} from "vue"
import {SETTINGS} from "@/settings"
import GuessInput from "@/components/GuessInput.vue"
import GuessView from "@/components/GuessView.vue"

enum GameState {
  InProgress = "In-Progress",
  Won = "Won",
  Lost = "Lost"
}

const props = defineProps({
  rightAnswer: {
    type: String,
    validator: (wordGiven: string) =>
        wordGiven.length === SETTINGS.wordSize
        && SETTINGS.allowedWords.includes(wordGiven)
  }
})

const gameState = ref<GameState>(GameState.InProgress)

function initializePastGuesses(): string[] {
  return Array.from({length: SETTINGS.numberOfAttemptsAllowed}, () => " ".repeat(SETTINGS.wordSize))
}

const pastGuesses = ref<string[]>(initializePastGuesses())
const numberOfAttempts = ref<number>(0)

function evaluateGuess(guess: string) {
  pastGuesses.value[numberOfAttempts.value] = guess
  numberOfAttempts.value++

  if (guess === props.rightAnswer) {
    gameState.value = GameState.Won
    return
  }

  if (numberOfAttempts.value >= SETTINGS.numberOfAttemptsAllowed) {
    gameState.value = GameState.Lost
  }
}

</script>

<template>
  <guess-view v-for="(pastGuess, index) in pastGuesses"
              :key="index"
              :guess="pastGuess"
              :right-answer="props.rightAnswer"/>

  <guess-input @guess-given="evaluateGuess"/>

  <p v-if="gameState === GameState.Won" data-role="winning-message">You won!</p>
  <p v-if="gameState === GameState.Lost" data-role="losing-message">Better luck next time!</p>
</template>

<style>
ul {
  list-style: none;
  padding: 0;
}

[data-role=past-guess] {
  display: flex;
  margin: 0.4rem 0;
  gap: 0.2rem;
}

[data-role=letter] {
  background-color: white;
  border: 1px solid hsl(0, 0%, 30%);
  width: 3rem;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.correct {
  background-color: hsl(120, 40%, 65%);
  color: hsl(0, 0%, 95%);
}

.incorrect {
  background-color: hsl(120, 0%, 65%);
  color: hsl(0, 0%, 95%);
}

.almost {
  background-color: hsl(41, 100%, 48%);
  color: hsl(0, 0%, 95%);
}
</style>