<template>
    <div class="text-center">
      <v-card color="">
        <v-card-title></v-card-title>
        <v-card-text>
          <p>Wait while the payload is being processed...</p>
          <v-form @submit.prevent="submitPayload">
            <v-textarea v-model="selectedPayload" label="Process Payload" required outlined filled class="custom-textarea"></v-textarea>
            <v-btn color="blue" dark @click="nextStep">SAVE & CONTINUE</v-btn>
            <v-btn color="blue" dark class="ml-2" @click="back">BACK</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        selectedPayload: '',
      };
    },
    methods: {
      submitPayload() {
        if (this.selectedPayload.trim() !== '') {
          this.$emit('next-step');
        } else {
          // Handle error condition if selectedPayload is empty
        }
      },
      nextStep() {
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
  