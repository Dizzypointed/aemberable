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
  searchForDeck = "searchForDeck",
  selectDeck = "selectDeck"
}

export enum mutations {
  setQuery = "searchForDeck",
  storeDecks = "storeDecks",
  storeHouses = "storeHouses",
  storeCards = "storeCards",
  storeQueryResult = "queryResult",
  setSelectedDeck = "setSelectedDeck"
}

export default new Vuex.Store({
  state: {
    decks: <any>{},
    houses: <any>{},
    cards: <any>{},
    query: {
      selected: "",
      data: <any>{}
    },
    selectedDeck: ""
  },
  getters: {
    getViewDecks: state =>
      (state.query.data[state.query.selected] || []).map((id: string) =>
        Deckfactory.viewDeck(
          state.decks[id],
          Object.values(state.houses),
          Object.values(state.cards)
        )
      ),
    getViewDeck: state =>
      Deckfactory.viewDeck(
        state.decks[state.selectedDeck],
        Object.values(state.houses),
        Object.values(state.cards)
      ),
    isQueryStored: state => !!state.query.data[state.query.selected],
    isDeckStored: state => !!state.decks[state.selectedDeck]
  },
  mutations: {
    [mutations.setQuery]: (state, query) => {
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
    },
    [mutations.storeQueryResult]: (state, payload: Deck[]) => {
      state.query.data = {
        ...state.query.data,
        ...{ [state.query.selected]: payload.map(d => d.id) }
      };
    },
    [mutations.setSelectedDeck]: (state, payload: string) => {
      state.selectedDeck = payload;
    }
  },
  actions: {
    [actions.searchForDeck]: (context, query) => {
      const _query = query.toLowerCase();
      context.commit(mutations.setQuery, _query);
      !context.getters.isQueryStored &&
        keyforgeApi.search(_query).then(r => {
          if (!r) {
            return;
          }

          context.commit(mutations.storeQueryResult, r.decks);
          context.commit(mutations.storeDecks, r.decks);
          context.commit(mutations.storeHouses, r.houses);
          context.commit(mutations.storeCards, r.cards);
        });
    },
    [actions.selectDeck]: (context, id) => {
      context.commit(mutations.setSelectedDeck, id);
      !context.getters.isDeckStored &&
        keyforgeApi.getDeck(id).then(r => {
          if (!r) {
            return;
          }

          context.commit(mutations.storeDecks, [r.deck]);
          context.commit(mutations.storeHouses, r.houses);
          context.commit(mutations.storeCards, r.cards);
        });
    }
  }
});
