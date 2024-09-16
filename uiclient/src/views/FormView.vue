<template>
    <v-app>
      <v-content>
        <v-container fluid>
          <app-bar
            :username="username"
            :currentLanguage="currentLanguage"
            :languages="languages"
            @toggle-drawer="drawer = !drawer"
            @switch-language="switchLanguage"
            @change-language="changeLanguage"
            @logout="logout"
          ></app-bar>
          
          <stepper :currentStep="currentStep"></stepper>
          
          <component :is="currentStepComponent"></component>
        </v-container>
      </v-content>
      
      <v-footer color="red">
        <v-container fluid>
          <v-row>
            <v-col>
              <v-spacer></v-spacer>
              <div class="text-center">
                 <v-span style="text-align: center;">&copy; 2024. Ptidej Team @ Concordia University. All Rights Reserved.</v-span>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-footer>
    </v-app>
  </template>
  
  <script>
  import AppBar from '@/components/AppBar.vue';
  import Stepper from '@/components/Stepper.vue';
  import Step1 from '@/components/Step1.vue';
  import Step2 from '@/components/Step2.vue';
  import Step3 from '@/components/Step3.vue';
  import Step4 from '@/components/Step4.vue';
  
  export default {
    components: {
      AppBar,
      Stepper,
      Step1,
      Step2,
      Step3,
      Step4,
    },
    data() {
      return {
        currentStep: 1,
        drawer: false,
        username: 'John',
        currentLanguage: 'English',
        languages: ['English', 'French', 'Spanish'],
      };
    },
    computed: {
      currentStepComponent() {
        switch (this.currentStep) {
          case 1:
            return 'Step1';
          case 2:
            return 'Step2';
          case 3:
            return 'Step3';
          case 4:
            return 'Step4';
          default:
            return null;
        }
      },
    },
    methods: {
      switchLanguage() {
        this.currentLanguage = this.currentLanguage === 'English' ? 'French' : 'English';
      },
      changeLanguage(lang) {
        this.currentLanguage = lang;
        // Implement real logic for changing language
      },
      logout() {
        localStorage.removeItem('user');
        // Redirect to login page or handle as needed
      },
    },
  };
  </script>
  