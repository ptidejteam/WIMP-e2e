<template>
    <div class="text-center">
      <v-card color="">
        <v-card-title></v-card-title>
        <v-card-text>
          <div class="download-button">
            <v-btn color="blue" dark @click="restart">DOWNLOAD REPORT</v-btn>
          </div>
        </v-card-text>
      </v-card>
    </div>
  </template>
  
  <script>
  export default {
    methods: {
      restart() {
        this.$emit('restart');
      },
    },
  };
  </script>
  
  <style scoped>
  .download-button {
    margin-top: 20px; /* Adjust spacing as needed */
  }
  </style>
  
  