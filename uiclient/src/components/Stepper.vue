<template>
    <v-stepper v-model="currentStep" vertical class="mt-2">
      <v-stepper-header class="mt-2">
        <!-- Stepper steps -->
      </v-stepper-header>
    </v-stepper>
  </template>
  
  <script>
  export default {
    props: {
      currentStep: Number,
    },
  };
  </script>
  
  <style scoped>
  /* Add scoped styles if needed */
  </style>
  