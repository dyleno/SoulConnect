import { createRouter, createWebHistory } from "vue-router";
import LandingPage from "../components/LandingPage.vue";
import Login from "../components/Login.vue";
import Register from "../components/Register.vue";
import Home from "../components/Home.vue";
import ChatPage from "../components/ChatPage.vue";
import Premium from "../components/Premium.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "landing",
      component: LandingPage,
    },
    {
      path: "/login",
      name: "login",
      component: Login,
    },
    {
      path: "/register",
      name: "register",
      component: Register,
    },
    {
      path: "/home",
      name: "Home",
      component: Home,
    },
    {
      path: "/chat",
      name: "Chat",
      component: ChatPage,
    },
    {
      path: "/premium",
      name: "Premium",
      component: Premium,
    },
  ],
});

export default router;
