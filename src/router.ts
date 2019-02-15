import Vue from "vue";
import Router from "vue-router";
import Help from "./views/Help.vue";
import Start from "./views/Start.vue";
import Decks from "./views/Decks.vue";
import Deck from "./views/Deck.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    { path: "/", redirect: "/decks" },
    {
      path: "/",
      name: "start",
      component: Start,
      children: [
        { path: "/decks/:id", name: "deck", component: Deck },
        { path: "/decks", name: "decks", component: Decks }
      ]
    },
    {
      path: "/help",
      name: "home",
      component: Help
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue")
    }
  ]
});
