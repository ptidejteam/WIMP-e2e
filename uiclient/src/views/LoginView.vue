<template>
  <v-app id="inspire">
    <v-main>
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
                            label="Email"
                            v-model="email"
                            prepend-inner-icon="mdi-email"
                            type="text"
                            color="teal accent-3"
                            outlined
                            filled
                            style="width: 500px;"
                          />
                          <v-text-field
                            id="password"
                            label="Password"
                            v-model="password"
                            prepend-inner-icon="mdi-lock"
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
                            label="Name"
                            v-model="userName"
                            prepend-inner-icon="mdi-account"
                            type="text"
                            color="teal accent-3"
                            outlined
                            filled
                            style="width: 500px;"
                          />
                          <v-text-field
                            label="Email"
                            v-model="userEmail"
                            prepend-inner-icon="mdi-email"
                            type="text"
                            color="teal accent-3"
                            outlined
                            filled
                            style="width: 500px;"
                          />
                          <v-text-field
                            id="password"
                            label="Password"
                            v-model="userPassword"
                            prepend-inner-icon="mdi-lock"
                            type="password"
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
              <v-snackbar v-model="snackbar" :timeout="snackbarTimeout" :color="snackbarColor" top center>
                {{ snackbarMessage }}
                <v-btn color="white" text @click="snackbar = false">Close</v-btn>
              </v-snackbar>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios';
import {
  VApp,
  VMain,
  VContainer,
  VRow,
  VCol,
  VCard,
  VCardText,
  VWindow,
  VWindowItem,
  VForm,
  VTextField,
  VBtn,
  VIcon,
  VSnackbar
} from 'vuetify/lib';

export default {
  components: {
    VApp,
    VMain,
    VContainer,
    VRow,
    VCol,
    VCard,
    VCardText,
    VWindow,
    VWindowItem,
    VForm,
    VTextField,
    VBtn,
    VIcon,
    VSnackbar
  },
  data() {
    return {
      step: 1,
      email: '',
      password: '',
      userEmail: '',
      userPassword: '',
      userName: '',
      snackbar: false,
      snackbarMessage: '',
      snackbarColor: '',
      snackbarTimeout: 6000
    };
  },
  methods: {
    async signIn() {
      try {
        const response = await axios.post('http://localhost:3001/login', {
          userEmail: this.email,
          userPassword: this.password
        });

        console.log('Response status:', response.status);
        console.log('Response data:', response.data); 
        console.log('Full response:', response);

        // Check the token
        const token = response.data; 
        if (response.status === 200 && token) {
          // Store the JWT token
          localStorage.setItem('jwtToken', token);
          console.log('Token stored:', localStorage.getItem('jwtToken'));
          this.snackbarMessage = 'Login successful!';
          this.snackbarColor = 'success';
          this.snackbar = true;
          this.$router.push('/stepview');
        } else {
          console.log('Token not found in response:', response.data);
          this.snackbarMessage = 'Login failed. Please check your credentials.';
          this.snackbarColor = 'error';
          this.snackbar = true;
        }
      } catch (error) {
        console.error('Connection failed', error);
        if (error.response) {
          console.log('Error response data:', error.response.data);
          this.snackbarMessage = `Login failed: ${error.response.data.message || 'Please check your credentials.'}`;
        } else {
          this.snackbarMessage = 'Login failed. Please check your credentials.';
        }
        this.snackbarColor = 'error';
        this.snackbar = true;
      }
    },
    async signUp() {
      try {
        const response = await axios.post('http://localhost:3001/users', {
          userName: this.userName,
          userEmail: this.userEmail,
          userPassword: this.userPassword
        });

        console.log('Response status:', response.status);
        console.log('Response data:', response.data);

        if (response.status === 201 || (response.status === 200 && response.data && response.data.success)) {
          this.snackbarMessage = 'Account created successfully!';
          this.snackbarColor = 'success';
          this.snackbar = true;
          this.step = 1; 
        } else {
          this.snackbarMessage = 'Registration failed. Please try again.';
          this.snackbarColor = 'error';
          this.snackbar = true;
        }
      } catch (error) {
        console.error('Registration failed', error);
        if (error.response) {
          console.log('Error response data:', error.response.data);
          this.snackbarMessage = `Registration failed: ${error.response.data.message || 'Please try again.'}`;
        } else {
          this.snackbarMessage = 'Registration failed. Please try again.';
        }
        this.snackbarColor = 'error';
        this.snackbar = true;
      }
    }
  },
  props: {
    source: String
  }
};
</script>



<!-- <script>
import axios from 'axios';

export default {
  data() {
    return {
      step: 1,
      email: '',
      password: '',
      userEmail: '',
      userPassword: '',
      userName: '',
      snackbar: false,
      snackbarMessage: '',
      snackbarColor: '',
      snackbarTimeout: 6000
    };
  },
  methods: {
    async signIn() {
      try {
        const response = await axios.post('http://localhost:3001/login', {
          userEmail: this.email,
          userPassword: this.password
        });

        console.log('Response status:', response.status);
        console.log('Response data:', response.data);

        // Debugging: Check the entire response object
        console.log('Full response:', response);

        // Check the token
        const token = response.data; // Directly access the token from response.data
        if (response.status === 200 && token) {
          // Store the JWT token
          localStorage.setItem('jwtToken', token);
          console.log('Token stored:', localStorage.getItem('jwtToken'));
          this.snackbarMessage = 'Login successful!';
          this.snackbarColor = 'success';
          this.snackbar = true;
          this.$router.push('/stepview');
        } else {
          console.log('Token not found in response:', response.data);
          this.snackbarMessage = 'Login failed. Please check your credentials.';
          this.snackbarColor = 'error';
          this.snackbar = true;
        }
      } catch (error) {
        console.error('Connection failed', error);
        if (error.response) {
          console.log('Error response data:', error.response.data);
          this.snackbarMessage = `Login failed: ${error.response.data.message || 'Please check your credentials.'}`;
        } else {
          this.snackbarMessage = 'Login failed. Please check your credentials.';
        }
        this.snackbarColor = 'error';
        this.snackbar = true;
      }
    },
    async signUp() {
      try {
        const response = await axios.post('http://localhost:3001/users', {
          userName: this.userName,
          userEmail: this.userEmail,
          userPassword: this.userPassword
        });

        console.log('Response status:', response.status);
        console.log('Response data:', response.data);

        if (response.status === 201 || (response.status === 200 && response.data && response.data.success)) {
          this.snackbarMessage = 'Account created successfully!';
          this.snackbarColor = 'success';
          this.snackbar = true;
          this.step = 1; // Go to login step
        } else {
          this.snackbarMessage = 'Registration failed. Please try again.';
          this.snackbarColor = 'error';
          this.snackbar = true;
        }
      } catch (error) {
        console.error('Registration failed', error);
        if (error.response) {
          console.log('Error response data:', error.response.data);
          this.snackbarMessage = `Registration failed: ${error.response.data.message || 'Please try again.'}`;
        } else {
          this.snackbarMessage = 'Registration failed. Please try again.';
        }
        this.snackbarColor = 'error';
        this.snackbar = true;
      }
    }
  },
  props: {
    source: String
  }
};
</script>
 -->










<!-- <template>
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
                            label="Email"
                            v-model="email"
                            prepend-inner-icon="mdi-email"
                            type="text"
                            color="teal accent-3"
                            outlined
                            filled
                            style="width: 500px;"
                          />
                          <v-text-field
                            id="password"
                            label="Password"
                            v-model="password"
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
                            label="Name"
                            v-model="userName"
                            prepend-inner-icon="person"
                            type="text"
                            color="teal accent-3"
                            outlined
                            filled
                            style="width: 500px;"
                          />
                          <v-text-field
                            label="Email"
                            v-model="userEmail"
                            prepend-inner-icon="mdi-email"
                            type="text"
                            color="teal accent-3"
                            outlined
                            filled
                            style="width: 500px;"
                          />
                          <v-text-field
                            id="password"
                            label="Password"
                            v-model="userPassword"
                            prepend-inner-icon="lock"
                            type="password"
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
              <v-snackbar v-model="snackbar" :timeout="snackbarTimeout" :color="snackbarColor" top center>
                {{ snackbarMessage }}
                <v-btn color="white" text @click="snackbar = false">Close</v-btn>
              </v-snackbar>
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
      email: '',
      password: '',
      userEmail: '',
      userPassword: '',
      userName: '',
      snackbar: false,
      snackbarMessage: '',
      snackbarColor: '',
      snackbarTimeout: 6000
    };
  },
  methods: {
    async signIn() {
      try {
        const response = await axios.post('http://localhost:3001/login', {
          userEmail: this.email,
          userPassword: this.password
        });
        console.log(response.data); // Output the response data to the console
        if (response.status === 200) {
          this.$router.push('/stepview');
        } else {
          this.snackbarMessage = 'Login failed. Please check your credentials.';
          this.snackbarColor = 'error';
          this.snackbar = true;
        }
      } catch (error) {
        console.error('Connection failed', error);
        this.snackbarMessage = 'Login failed. Please check your credentials.';
        this.snackbarColor = 'error';
        this.snackbar = true;
      }
    },
    async signUp() {
      try {
        const response = await axios.post('http://localhost:3001/users', {
          userName: this.userName,
          userEmail: this.userEmail,
          userPassword: this.userPassword
        });

        console.log('Response status:', response.status);
        console.log('Response data:', response.data);

        if (response.status === 201 || (response.status === 200 && response.data && response.data.success)) {
          this.snackbarMessage = 'Account created successfully!';
          this.snackbarColor = 'success';
          this.snackbar = true;
          this.step = 1; // Go to login step
        } else {
          this.snackbarMessage = 'Registration failed. Please try again.';
          this.snackbarColor = 'error';
          this.snackbar = true;
        }
      } catch (error) {
        console.error('Registration failed', error);

        if (error.response) {
          console.log('Error response data:', error.response.data);
          this.snackbarMessage = `Registration failed: ${error.response.data.message || 'Please try again.'}`;
        } else {
          this.snackbarMessage = 'Registration failed. Please try again.';
        }

        this.snackbarColor = 'error';
        this.snackbar = true;
      }
    }
  },
  props: {
    source: String
  }
};
</script> -->









