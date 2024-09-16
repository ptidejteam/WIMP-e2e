<template>
    <v-app-bar app color="teal" dark class="mt-2">
      <v-app-bar-nav-icon @click.stop="$emit('toggle-drawer')"></v-app-bar-nav-icon>
      <v-toolbar-title>Functional Testing of Your IoT System</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text @click="$emit('switch-language')">Language</v-btn>
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn text v-on="on">
            {{ currentLanguage }}
            <v-icon>mdi-menu-down</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="(lang, index) in languages" :key="index" @click="$emit('change-language', lang)">
            <v-list-item-title>{{ lang }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-btn text @click="$emit('logout')">
        {{ username }}
        <v-icon class="mr-2" color="light-blue">mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>
  </template>
  
  <script>
  export default {
    props: {
      username: String,
      currentLanguage: String,
      languages: Array,
    },
  };
  </script>
  
  <style scoped>
  /* Add scoped styles if needed */
  </style>
  