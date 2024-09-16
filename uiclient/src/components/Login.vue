<template>
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
          name="Email"
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
      <div class="text-center mt-4 mb-6">
        <v-btn @click="signIn" rounded color="blue" dark width="300">SIGN IN</v-btn>
      </div>
    </v-card-text>
  </template>
  
  <script>
  export default {
    methods: {
      signIn() {
        this.$emit('sign-in');
      }
    }
  };
  </script>
  