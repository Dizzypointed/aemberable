<template>
  <div class="results">
    <ul class="decks">
      <li v-for="deck in results" :key="deck.id">
        <div class="deck" @click="showDetails(deck.id)">
          <div class="deck-name">
            <div>{{deck.name}}</div>
            <div>
              {{deck.cards.reduce((prev, card) => prev + card.amber, 0)}} &AElig;mber,
              {{deck.cards.reduce((prev, card) => prev + card.power, 0)}} power,
              {{deck.cards.reduce((prev, card) => prev + card.armor, 0)}} armor
            </div>
          </div>
          <ul class="houses">
            <li class="house" v-for="house in deck.houses" :key="house.id">
              <img :src="house.image">
              <div class="house-name">
                <div>{{house.name}}</div>
              </div>
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import store, { actions } from "../store";
import router from "@/router";
@Component({})
export default class Start extends Vue {
  get results() {
    return store.getters.getViewDecks;
  }

  showDetails(id: string) {
    router.push({ name: "deck", params: { id } });
  }
}
</script>

<style lang="scss" scoped>
.deck {
  font-size: 0.9em;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  margin: 8px 0;
  background-color: #999;
  border: solid 1px;
  border-color: #999;
  cursor: pointer;

  &:hover {
    background-color: #525252;
    border-color: #000;
    color: #fff;
  }
}

.deck-name {
  text-align: start;

  > div:last-child {
    font-size: 0.7em;
  }
}

.houses {
  display: flex;
}

.house {
  margin-left: 10px;

  img {
    width: 2.5em;
  }
}
.house-name {
  min-width: 70px;
  background-color: #525252;
  color: #fff;
  font-size: 0.8em;
  //   font-weight: 600;
  text-shadow: 0.1rem 0.1rem 0.4rem #c6bfac;
}
.results {
  margin: 0 30px;

  @media (max-width: 375px) {
    margin: 0;
  }
}
</style>

