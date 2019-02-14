<template>
  <section class="start">
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
  transName = "slideLeft";

  //   watch() {
  //     $route: (to: any, from: any) => {
  //       console.log(to, from);
  //     };
  //     console.log(arguments);
  //   }
}
</script>

