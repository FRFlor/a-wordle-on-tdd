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

function evaluateGuess(guess: string) {
  pastGuess.value = guess

  gameState.value = guess === props.rightAnswer
      ? GameState.Won
      : GameState.Lost
}

</script>

<template>
  <ul data-role="past-guess">
    <li v-for="(letter, index) in pastGuess"
        :key="index"
        :class="{'correct': letter === rightAnswer[index]}"
        :data-letter="letter">{{ letter }}
    </li>
  </ul>

  <guess-input @guess-given="evaluateGuess"/>

  <p v-if="gameState === GameState.Won" data-role="winning-message">You won!</p>
  <p v-if="gameState === GameState.Lost" data-role="losing-message">Better luck next time!</p>
</template>
