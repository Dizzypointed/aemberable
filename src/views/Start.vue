<template>
  <section class="start">
    <form @submit="search($event)">
      <label for="query">Search</label>
      <input type="text" name="q" id="query" v-model="query">
      <button type="submit" id="search">search</button>
    </form>
    <transition :name="transName">
      <router-view></router-view>
    </transition>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import store, { actions } from "../store";
import router from "@/router";
@Component({})
export default class Start extends Vue {
  query = "";
  transName = "slideLeft";

  created() {
    this._updated();
  }

  _updated() {
    this.query = <string>router.currentRoute.query.q;
    store.dispatch(actions.searchForDeck, this.query);
  }

  search(e: Event) {
    e.preventDefault();
    router.push({ path: "/decks", query: { q: this.query } });

    this._updated();
  }

  //   watch() {
  //     $route: (to: any, from: any) => {
  //       console.log(to, from);
  //     };
  //     console.log(arguments);
  //   }
}
</script>

