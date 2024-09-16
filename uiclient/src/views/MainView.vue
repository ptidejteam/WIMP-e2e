<template>
    <v-app id="inspire">
      <v-content>
        <v-container class="fill-height" fluid>
          <v-row align="center" justify="center">
            <v-col cols="12" sm="8" md="8">
              <v-card class="elevation-12">
                <v-window v-model="step">
                  <v-window-item :value="1">
                    <v-row>
                      <v-col cols="12" md="8">
                        <Login @sign-in="signIn" />
                      </v-col>
                      <v-col cols="12" md="4" style="background-color: red;">
                        <v-card-text class="white--text mt-12">
                          <h1 class="text-center display-1">TestIoT TaaS</h1>
                          <h5 class="text-center">Functionnal Testing of Your IoT System</h5>
                        </v-card-text>
                        <div class="text-center">
                          <v-btn rounded outlined dark @click="step++">SIGN UP</v-btn>
                        </div>
                      </v-col>
                    </v-row>
                  </v-window-item>
                  <v-window-item :value="2">
                    <v-row class="fill-height">
                      <v-col cols="12" md="4" style="background-color: red;">
                        <v-card-text class="white--text mt-12">
                          <h1 class="text-center display-1">TestIoT TaaS</h1>
                          <h5 class="text-center">Functionnal Testing of Your IoT System</h5>
                        </v-card-text>
                        <div class="text-center">
                          <v-btn rounded outlined dark @click="step--">Sign in</v-btn>
                        </div>
                      </v-col>
                      <v-col cols="12" md="8">
                        <SignUp />
                      </v-col>
                    </v-row>
                  </v-window-item>
                </v-window>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-content>
    </v-app>
  </template>
  
  <script>
  import axios from 'axios';
  import Login from '@/components/Login.vue';
  import SignUp from '@/components/SignUp.vue';
  
  export default {
    components: {
      Login,
      SignUp
    },
    data() {
      return {
        step: 1,
        userEmail: '',
        userPassword: ''
      };
    },
    methods: {
      async signIn() {
        try {
          const response = await axios.post('http://localhost:3000/users', {
            userEmail: this.userEmail,
            userPassword: this.userPassword
          });
          console.log(response.data); // Output the response data to the console
          
          if (response.status === 200) {
            this.$router.push('/stepview');
          }
        } catch (error) {
          console.error('Connection failed', error);
        }
      }
    }
  };
  </script>
  