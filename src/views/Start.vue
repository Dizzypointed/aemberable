<template>
  <section class="start">
    <router-view></router-view>
  </section>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import store, { actions } from "../store";
import router from "@/router";
@Component({})
export default class Start extends Vue {}
</script>

