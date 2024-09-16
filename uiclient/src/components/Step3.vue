<template>
    <div class="text-center">
      <v-card color="">
        <v-card-title></v-card-title>
        <v-card-text>
          <p>Wait while the tool executes the payloads in your system...</p>
          <v-textarea v-model="testExecutionResult" label="Test Execution Result" outlined filled class="custom-textarea"></v-textarea>
          <v-btn color="blue" dark @click="finish">SAVE & CONTINUE</v-btn>
          <v-btn color="blue" dark class="ml-2" @click="back">BACK</v-btn>
        </v-card-text>
      </v-card>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        testExecutionResult: '',
      };
    },
    methods: {
      finish() {
        this.$emit('next-step');
      },
      back() {
        this.$emit('back');
      },
    },
  };
  </script>
  
  <style scoped>
  .custom-textarea {
    min-height: 150px;
  }
  </style>
  