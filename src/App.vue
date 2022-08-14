<template>
  <p>Nothing :(</p>
</template>

<script lang="ts" setup>
import {defineProps} from "vue"

defineProps({
  rightAnswer: {
    type: String,
    validator: (wordGiven: string) => wordGiven.length === 5
  }
})
</script>
