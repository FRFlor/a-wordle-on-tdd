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
const pastGuesses = ref<string[]>(Array.from({length: SETTINGS.numberOfAttemptsAllowed}, () => ""))
const guessInProgress = ref<string>("")
const numberOfAttempts = ref<number>(0)

function updateGuessInProgress(newValue: string) {
  guessInProgress.value = newValue
}

function evaluateGuess() {
  pastGuesses.value[numberOfAttempts.value] = guessInProgress.value
  numberOfAttempts.value++

  if (guessInProgress.value === props.rightAnswer) {
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
              :guess="index === numberOfAttempts ? guessInProgress : pastGuess"
              :show-hints="index !== numberOfAttempts"
              :right-answer="props.rightAnswer"/>

  <guess-input @guess-given="evaluateGuess" @guess-updated="updateGuessInProgress"/>

  <p v-if="gameState === GameState.Won" data-role="winning-message">You won!</p>
  <p v-if="gameState === GameState.Lost" data-role="losing-message">Better luck next time!</p>
</template>

<style>
ul {
  list-style: none;
  padding: 0;
}

[data-role=guess-view] {
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