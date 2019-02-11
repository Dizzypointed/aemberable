import Vue from "vue";
import Vuex from "vuex";
import KeyforgeApi from "./api/keyforge.api";
import keyforgeApi from "./api/keyforge.api";
import { tap } from "rxjs/operators";
import House from "./model/house";
import Card from "./model/card";
import Deck from "./model/deck";
import { Deckfactory } from "./api/factory";

Vue.use(Vuex);

export enum actions {
  searchForDeck = "searchForDeck"
}

export enum mutations {
  searchForDeck = "searchForDeck",
  storeDecks = "storeDecks",
  storeHouses = "storeHouses",
  storeCards = "storeCards"
}

export default new Vuex.Store({
  state: {
    decks: {},
    houses: {},
    cards: {},
    query: {
      selected: "",
      data: {}
    }
  },
  getters: {
    getViewDecks: state => {
      return Object.values(state.decks).map(d =>
        Deckfactory.viewDeck(
          d,
          Object.values(state.houses),
          Object.values(state.cards)
        )
      );
    }
  },
  mutations: {
    [mutations.searchForDeck]: (state, query) => {
      state.query.selected = query;
    },
    [mutations.storeDecks]: (state, payload: Deck[]) => {
      state.decks = {
        ...state.decks,
        ...(() => {
          const result: any = {};
          payload.forEach(d => {
            if (!result[d.id]) result[d.id] = { ...d };
          });
          return result;
        })()
      };
    },
    [mutations.storeHouses]: (state, payload: House[]) => {
      state.houses = {
        ...state.houses,
        ...(() => {
          const result: any = {};
          payload.forEach(d => {
            if (!result[d.id]) result[d.id] = { ...d };
          });
          return result;
        })()
      };
    },
    [mutations.storeCards]: (state, payload: Card[]) => {
      state.cards = {
        ...state.cards,
        ...(() => {
          const result: any = {};
          payload.forEach(d => {
            if (!result[d.id]) result[d.id] = { ...d };
          });
          return result;
        })()
      };
    }
  },
  actions: {
    [actions.searchForDeck]: (context, query) => {
      context.commit(mutations.searchForDeck, query);
      keyforgeApi.search(query).then(r => {
        context.commit(mutations.storeDecks, r.decks);
        context.commit(mutations.storeHouses, r.houses);
        context.commit(mutations.storeCards, r.cards);
        console.log(r);
      });
    }
  }
});
