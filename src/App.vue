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
    validator: (wordGiven: string) =>
        wordGiven.length === SETTINGS.wordSize
        && SETTINGS.allowedWords.includes(wordGiven)
  }
})

const gameState = ref<GameState>(GameState.InProgress)
const pastGuess = ref<string>("")
const numberOfAttempts = ref<number>(0)

function evaluateGuess(guess: string) {
  numberOfAttempts.value++

  pastGuess.value = guess

  if (guess === props.rightAnswer) {
    gameState.value = GameState.Won
    return
  }

  if (numberOfAttempts.value === 6) {
    gameState.value = GameState.Lost
  }
}

</script>

<template>
  <ul data-role="past-guess">
    <li v-for="(letter, index) in pastGuess"
        :key="index"
        :class="{
          'correct': letter === rightAnswer[index],
          'incorrect': letter !== rightAnswer[index] && !rightAnswer.includes(letter),
          'almost': letter !== rightAnswer[index] && rightAnswer.includes(letter)
        }"
        :data-letter="letter">{{ letter }}
    </li>
  </ul>

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
  display: flex
}

[data-role=past-guess] li {
  font-size: 2rem;
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