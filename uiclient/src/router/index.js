import Vue from "vue";
import VueRouter from "vue-router";
import LoginView from "../views/LoginView.vue";
import StepView from "../views/StepView.vue"
import MainView from "../views/MainView.vue"
import FormView from "../views/FormView.vue"


Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "login",
    component: LoginView
  },
  {
    path: "/mainview",
    name: "mainview",
    component: MainView
  },
  {
    path: "/stepview",
    name: "stepview",
    component: StepView
  },

  {
    path: "/formview",
    name: "formview",
    component: FormView
  },
  
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
