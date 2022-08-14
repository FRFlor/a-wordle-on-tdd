<template>
  <p>Nothing :(</p>
</template>

<script lang="ts" setup>
import {onMounted} from "vue"

onMounted(() => console.warn("Invalid Prop 'rightAnswer' was given!"))
</script>
