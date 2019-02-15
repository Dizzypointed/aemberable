<template>
  <div class="main">
    <router-link :to="{name:'decks', query: {q: query}}">tillbaka</router-link>
    <div class="deck">
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
            <div>
              <ul class="cards">
                <li class="card" v-for="card in cards(house)" :key="card.key">
                  <img :src="card.front_image" @click="enlarge(card, $event)">
                </li>
              </ul>
            </div>
          </div>
        </li>
      </ul>
      <div id="enlarged" :hidden="!this.enlargedImage" @click="shrink()">
        <img :src="enlargedImage">
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import store, { actions } from "../store";
import router from "@/router";
import ViewDeck from "@/model/viewDeck";
import House from "@/model/house";
import Card from "@/model/card";
@Component({})
export default class Start extends Vue {
  enlargedImage = "";
  query = store.state.query.selected;
  get deck() {
    return store.getters.getViewDecks.find(
      (d: ViewDeck) => d.id === router.currentRoute.params.id
    );
  }

  cards(house: House) {
    return this.deck.cards
      .filter((c: Card) => c.house === house.id)
      .map((c: Card, i: number) => ({ ...c, key: i }));
  }

  enlarge(card: Card) {
    this.enlargedImage = card.front_image;
  }

  shrink() {
    this.enlargedImage = "";
  }
}
</script>

<style lang="scss" scoped>
.deck {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  max-height: 80vh;
  font-size: 1em;
  font-weight: 600;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  margin: 8px 0 0;
  background-color: #999;
}

.deck-name {
  > div:last-child {
    font-size: 0.8em;
  }
}

.houses {
  display: flex;
  overflow-y: auto;
}

.house {
  margin: 0 5px;

  img {
    width: 2.5em;
  }
}

::-webkit-scrollbar {
  width: 12px;
}

::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
}
.house-name {
  min-width: 70px;
  background-color: #525252;
  color: #fff;
  font-size: 0.8em;
  //   font-weight: 600;
  text-shadow: 0.1rem 0.1rem 0.4rem #c6bfac;
}
.cards {
  display: flex;
  flex-flow: wrap;
  justify-content: center;
}
.card {
  width: 33%;
  height: auto;

  @media (max-width: 415px) {
    width: 50%;
  }

  img {
    width: 100%;
    height: auto;
    cursor: pointer;
  }
}
.main {
  margin: 0 30px;

  @media (max-width: 415px) {
    margin: 0;
  }
}
#enlarged {
  position: absolute;
  margin: auto;
  user-select: none;
}
</style>

