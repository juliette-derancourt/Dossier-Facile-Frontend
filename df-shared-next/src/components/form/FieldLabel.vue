<template>
  <label class="fr-label" :for="props.forInput">
    <slot></slot>
    <span v-if="props.required" style="color:red"> *</span>
    <span> :</span>
  </label>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps<{
  required: boolean;
  forInput?: string;
}>();
</script>

<style scoped lang="scss"></style>
