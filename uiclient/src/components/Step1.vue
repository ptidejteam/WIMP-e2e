<template>
    <div>
      <v-card color="">
        <v-card-title></v-card-title>
        <v-card-text>
          <p>Please upload the following details about the system to be tested...</p>
          <v-form @submit.prevent="submitSystemInfo">
            <v-text-field v-model="systemName" label="System Name" required outlined filled></v-text-field>
            <input type="file" multiple @change="handleFileUpload" accept=".json"/>
            <div v-if="isJSONFile" class="valid-json">Valid JSON file</div>
            <div v-else class="invalid-json">Invalid JSON File</div>
            <div class="text-left mt-4 mb-6">
              <v-btn color="blue" dark @click="nextStep">SUBMIT</v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        systemName: '',
        isJSONFile: false,
      };
    },
    methods: {
      submitSystemInfo() {
        if (this.systemName.trim() !== '') {
          this.$emit('next-step');
        } else {
          // Handle error condition if systemName is empty
        }
      },
      handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
  
        if (file.type === "application/json") {
          this.isJSONFile = true;
          // Additional logic for handling JSON file
        } else {
          this.isJSONFile = false;
          // Handle non-JSON file error
        }
      },
      nextStep() {
        this.$emit('next-step');
      },
    },
  };
  </script>
  
  <style scoped>
  .valid-json {
    color: green;
    font-weight: bold;
  }
  
  .invalid-json {
    color: red;
    font-weight: bold;
  }
  </style>
  