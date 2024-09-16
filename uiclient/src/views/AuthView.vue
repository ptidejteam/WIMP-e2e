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
                        <v-card-text class="mt-12">
                          <h1 class="text-center display-2 teal--text text--black">Login and Test Your System</h1>
                          <div class="text-center mt-4">
                            <v-btn class="mx-2" fab color="blue" outlined>
                              <v-icon>fab fa-facebook-f</v-icon>
                            </v-btn>
                            <v-btn class="mx-2" fab color="red" outlined>
                              <v-icon>fab fa-google-plus-g</v-icon>
                            </v-btn>
                            <v-btn class="mx-2" fab color="light-blue" outlined>
                              <v-icon>fab fa-linkedin-in</v-icon>
                            </v-btn>
                          </div>
                          <h4 class="text-center mt-4">Ensure your email for registration</h4>
                          <v-form class="d-flex align-center justify-center flex-column mt-4">
                            <v-text-field
                              v-model="loginEmail"
                              label="Email"
                              name="Email"
                              prepend-inner-icon="mdi-email"
                              type="text"
                              color="teal accent-3"
                              outlined
                              filled
                              style="width: 500px;"
                            />
                            <v-text-field
                              v-model="loginPassword"
                              id="password"
                              label="Password"
                              name="password"
                              prepend-inner-icon="lock"
                              type="password"
                              color="teal accent-3"
                              outlined
                              filled
                              style="width: 500px;"
                            />
                          </v-form>
                          <h3 class="text-center mt-4">Forgot your password ?</h3>
                        </v-card-text>
                        <div class="text-center mt-4 mb-6">
                          <v-btn @click="signIn" rounded color="blue" dark width="300">SIGN IN</v-btn>
                        </div>
                      </v-col>
                      <v-col cols="12" md="4" style="background-color: red;">
                        <v-card-text class="white--text mt-12">
                          <h1 class="text-center display-1">TestIoT TaaS</h1>
                          <h5 class="text-center">Functional Testing of Your IoT System</h5>
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
                          <h5 class="text-center">Functional Testing of Your IoT System</h5>
                        </v-card-text>
                        <div class="text-center">
                          <v-btn rounded outlined dark @click="step--">Sign in</v-btn>
                        </div>
                      </v-col>
                      <v-col cols="12" md="8">
                        <v-card-text class="mt-12">
                          <h1 class="text-center display-2 black--text text--black">Create Account</h1>
                          <div class="text-center mt-4">
                            <v-btn class="mx-2" fab color="blue" outlined>
                              <v-icon>fab fa-facebook-f</v-icon>
                            </v-btn>
                            <v-btn class="mx-2" fab color="red" outlined>
                              <v-icon>fab fa-google-plus-g</v-icon>
                            </v-btn>
                            <v-btn class="mx-2" fab color="light-blue" outlined>
                              <v-icon>fab fa-linkedin-in</v-icon>
                            </v-btn>
                          </div>
                          <h4 class="text-center mt-4">Ensure your email for registration</h4>
                          <v-form class="d-flex align-center justify-center flex-column mt-4">
                            <v-text-field
                              v-model="signUpName"
                              label="Name"
                              name="Name"
                              prepend-inner-icon="person"
                              type="text"
                              color="teal accent-3"
                              outlined
                              filled
                              style="width: 500px;"
                            />
                            <v-text-field
                              v-model="signUpEmail"
                              label="Email"
                              name="Email"
                              prepend-inner-icon="mdi-email"
                              type="text"
                              color="teal accent-3"
                              outlined
                              filled
                              style="width: 500px;"
                            />
                            <v-text-field
                              v-model="signUpPassword"
                              id="password"
                              label="Password"
                              name="password"
                              prepend-inner-icon="lock"
                              type="password"
                              color="teal accent-3"
                              outlined
                              filled
                              style="width: 500px;"
                            />
                            <v-text-field
                              v-model="signUpAge"
                              label="Age"
                              name="Age"
                              prepend-inner-icon="mdi-cake"
                              type="number"
                              color="teal accent-3"
                              outlined
                              filled
                              style="width: 500px;"
                            />
                          </v-form>
                        </v-card-text>
                        <div class="text-center mt-3 mb-6">
                          <v-btn @click="signUp" rounded color="blue" dark width="300">SIGN UP</v-btn>
                        </div>
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
  
  export default {
    data() {
      return {
        step: 1,
        loginEmail: '',
        loginPassword: '',
        signUpName: '',
        signUpEmail: '',
        signUpPassword: '',
        signUpAge: ''
      };
    },
    methods: {
      async signIn() {
        try {
          const response = await axios.post('http://localhost:3001/login', {
            userEmail: this.loginEmail,
            userPassword: this.loginPassword
          });
          console.log(response.data); // Output the response data to the console
          
          if (response.status === 200) {
            this.$router.push('/stepview');
          }
        } catch (error) {
          console.error('Connection failed', error);
        }
      },
      async signUp() {
        try {
          const response = await axios.post('http://localhost:3001/users', {
            userName: this.signUpName,
            userEmail: this.signUpEmail,
            userPassword: this.signUpPassword,
            userAge: this.signUpAge
          });
          console.log(response.data); // Output the response data to the console
          
          if (response.status === 201) {
            this.$router.push('/stepview');
          }
        } catch (error) {
          console.error('Registration failed', error);
        }
      }
    },
    props: {
      source: String
    }
  };
  </script>
  
  