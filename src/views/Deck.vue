<template>
  <div v-if="deck" class="main">
    <router-link :to="{name:'decks', query: {q: query}}">tillbaka</router-link>
    <div v-if="selectedCard" class="selected-creature">
      <button class="close" type="button" @click="deselect()">&times;</button>
      <div style="position: relative">
        <div style="position: absolute; display: flex; justify-content: space-around">
          <button @click="selectedCard.tmp_wounds = selectedCard.tmp_power">kill</button>
        </div>
        <transition name="pulse">
          <div
            :hidden="selectedCard.tmp_wounds < 1"
            :key="selectedCard.tmp_wounds"
            class="wounds"
          >{{selectedCard.tmp_wounds}}</div>
        </transition>
        <img :src="selectedCard.front_image" alt>
        <div class="death" :hidden="this.selectedCard.tmp_wounds < this.selectedCard.tmp_power">
          <!-- <img
            src="../assets/blood.jpg"
          >-->
        </div>
      </div>
      <div class="stats">
        <div>
          <label for="wounds">Wounds</label>
          <div>
            <button type="button" @click="increment('tmp_wounds', -1)">-</button>
            <input
              type="number"
              min="0"
              name="wounds"
              id="wounds"
              v-model="selectedCard.tmp_wounds"
            >
            <button type="button" @click="increment('tmp_wounds', 1)">+</button>
          </div>
        </div>
        <div>
          <label for="armor">Armor</label>
          <div>
            <button type="button" @click="increment('tmp_armor', -1)">-</button>
            <input type="number" min="0" name="armor" id="armor" v-model="selectedCard.tmp_armor">
            <button type="button" @click="increment('tmp_armor', 1)">+</button>
          </div>
        </div>
        <div>
          <label for="power">Power</label>
          <div>
            <button type="button" @click="increment('tmp_power', -1)">-</button>
            <input type="number" min="0" name="power" id="power" v-model="selectedCard.tmp_power">
            <button type="button" @click="increment('tmp_power', 1)">+</button>
          </div>
        </div>
        <div>
          <label for="power">Captured &aelig;mber</label>
          <div>
            <button type="button" @click="increment('tmp_amber', -1)">-</button>
            <input type="number" min="0" name="power" id="power" v-model="selectedCard.tmp_amber">
            <button type="button" @click="increment('tmp_amber', 1)">+</button>
          </div>
        </div>
      </div>
    </div>
    <div class="played-creatures">
      <ul>
        <li v-for="card in playedCreatures" :key="card.key">
          <div :hidden="card.tmp_wounds < 1" class="wounds">{{card.tmp_wounds}}</div>
          <img :src="card.front_image" @click="select(card)">
        </li>
      </ul>
    </div>
    <div class="victory-conditions">
      <div class="aember"></div>
    </div>
    <div class="deck">
      <div class="deck-name">
        <div>{{deck.name}}</div>
        <div>
          {{deck.cards.reduce((prev, card) => prev + card.amber, 0)}} &AElig;mber,
          {{deck.cards.reduce((prev, card) => prev + card.power, 0)}} Power,
          {{deck.cards.reduce((prev, card) => prev + card.armor, 0)}} Armor
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
      <div id="enlarged" v-if="enlarged.front_image" @click="shrink()">
        <img :src="enlarged.front_image">
        <div v-if="enlarged.card_type === 'Creature'" class="creature-play">
          <button type="button" @click="play()">PLAY</button>
        </div>
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
  enlarged = <Card>{};

  playedCreatures = new Array<any>();

  private selectedCardKey = "";

  created() {
    store.dispatch(actions.selectDeck, router.currentRoute.params.id);
  }

  get selectedCard() {
    return this.playedCreatures.find(
      (c: any) => c.key === this.selectedCardKey
    );
  }

  query = store.state.query.selected;

  increment(prop: string, value: number) {
    // const elem = <HTMLInputElement>document.getElementById(id);
    // elem.value = (+elem.value + value).toString();
    this.selectedCard[prop] = this.selectedCard[prop] + value;
  }

  deselect() {
    if (this.selectedCard.tmp_wounds >= this.selectedCard.tmp_power) {
      this.playedCreatures = this.playedCreatures.filter(
        c => c.key !== this.selectedCard.key
      );
    }
    this.selectedCardKey = "";
  }

  select(card: any) {
    this.selectedCardKey = card.key;
  }

  play() {
    this.playedCreatures.push({
      ...this.enlarged,
      key: `${this.enlarged.id}:${this.playedCreatures.length}`,
      tmp_power: this.enlarged.power,
      tmp_armor: this.enlarged.armor,
      tmp_wounds: 0,
      tmp_amber: 0
    });
    console.log(`${this.enlarged.id}:${this.playedCreatures.length}`);

    this.shrink();
  }

  get deck() {
    return store.getters.getViewDeck;
  }

  cards(house: House) {
    return this.deck.cards
      .filter((c: Card) => c.house === house.id)
      .map((c: Card, i: number) => ({ ...c, key: i }));
  }

  enlarge(card: Card) {
    this.enlarged = card;
  }

  shrink() {
    this.enlarged = <Card>{};
  }
}
</script>

<style lang="scss" scoped>
.deck {
  flex: 1 0 auto;
  max-height: 70vh;
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
  flex: 1;

  img {
    width: 2.5em;
  }
}

::-webkit-scrollbar {
  width: 12px;
  height: 12px;
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
  display: flex;
  flex-direction: column;
  height: 100vh;

  @media (max-width: 415px) {
    margin: 0;
  }
}
#enlarged {
  position: absolute;
  margin: auto;
  user-select: none;
}

.creature-play {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;

  button {
    margin: 205px auto 0;
    padding: 3px 35px;
    background-color: #f06c55;
    -webkit-box-shadow: 0px 0px 29px 1px #bd2428 inset;
    box-shadow: 0px 0px 29px 1px #bd2428 inset;
    color: #fff;
    text-shadow: 0px 2px 1px #600;
    font-weight: 600;
    border: 2px solid #000000;
    border-radius: 3px;
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    cursor: pointer;
  }
}

.played-creatures {
  height: 24vh;

  ul,
  li {
    height: 100%;
  }

  ul {
    display: flex;
    overflow-x: scroll;
    overflow-y: hidden;
    margin: 0;
  }

  li {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  img {
    height: 100%;
    width: auto;
  }
}
.selected-creature {
  z-index: 1000;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  color: #000;
  background-image: linear-gradient(#b82026, #fcd077);
  padding: 30px 40px;
  box-shadow: 0 5px 20px 5px rgba(43, 16, 12, 0.5) inset;

  img {
    box-shadow: 0 3px 10px 1px rgba(113, 46, 51, 0.5);
    border-radius: 23px;
    margin-bottom: 10px;
  }

  div {
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    width: 300px;
    margin: 0 auto;

    div,
    label {
      flex: 1 100%;
    }

    label {
      display: block;
      text-shadow: 0px 2px 1px #600;
      font-weight: 600;
      font-size: 16px;
    }

    button {
      padding: 5px 33px;
      background-color: #f06c55;
      -webkit-box-shadow: 0px 0px 29px 1px #bd2428 inset;
      box-shadow: 0px 0px 29px 1px #bd2428 inset;
      color: #fff;
      border: 2px solid #000000;
      border-radius: 3px;
      font-family: "Avenir", Helvetica, Arial, sans-serif;
      text-shadow: 0px 2px 1px #600;
      font-weight: 600;
      cursor: pointer;
      font-size: 20px;
    }

    &.stats {
      button {
        &:first-of-type {
          border-right: 0;
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
        }

        &:last-of-type {
          border-left: 0;
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
        }
      }
    }
  }

  button.close {
    position: absolute;
    top: 0;
    right: 0;
    padding: 10px 20px;
    color: #fff;
    text-shadow: 0px 2px 1px #600;
    font-weight: 600;
    font-size: 40px;
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    background-color: transparent;
    border: none;
  }

  input {
    text-align: center;
    border: 2px solid #000000;
    border-left: 0;
    border-right: 0;
    width: 145px;
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    font-weight: 600;
    font-size: 20px;
  }
}

.wounds {
  position: absolute;
  background-color: #d72129;
  text-shadow: 0px 2px 1px #600;
  font-weight: 600;
  color: #fff;
}

.played-creatures {
  .wounds {
    font-size: 14px;
    padding: 1px 5px;
    border-radius: 10px;
    border: 1px solid #000;
  }
}

.selected-creature {
  .wounds {
    font-size: 28px;
    width: 35px;
    height: 35px;
    border: 2px solid #000;
    border-radius: 20px;
    display: flex;
    align-items: center;
    transform: translate(0, 192px);

    &[hidden="hidden"] {
      display: none;
    }
  }
}

.pulse-enter-active {
  animation: pulse 0.5s;
}
@keyframes pulse {
  0% {
    opacity: 0;
    transform: scale(2) translate(0, 95px);
  }
  50% {
    opacity: 1;
  }
}
div.death {
  position: absolute;
  background-image: url("../assets/blood.jpg");
  width: 100vw;
  height: 547px;
  transition: height 0.5s ease;
  background-position-x: center;
  background-repeat: no-repeat;
  pointer-events: none;
  opacity: 0.9;

  &[hidden="hidden"] {
    height: 0;
  }
}
</style>

