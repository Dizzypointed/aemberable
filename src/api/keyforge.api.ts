import Vue from "vue";

import rx, { Observable, of } from "rxjs";
import { map, filter, tap } from "rxjs/operators";
import { Deckfactory, Housefactory, Cardfactory } from "./factory";

export class KeyforgeApi {
  get http() {
    return new Vue().$http;
  }

  // , {
  //   headers: {
  //     "Access-Control-Allow-Origin": "localhost:8080"
  //   }
  // }
  search(q: string) {
    const obs = new Observable();
    // return of(
    return this.http
      .get(`https://www.keyforgegame.com/api/decks/?search=${q}&links=cards`)
      .then(
        r => {
          return {
            decks: r.data.data.map((d: any) => Deckfactory.deck(d)),
            houses: r.data._linked.houses.map((h: any) =>
              Housefactory.house(h)
            ),
            cards: r.data._linked.cards.map((c: any) => Cardfactory.card(c))
          };
        },
        r => {
          console.log("ERROR LIKSOM!", r);

          throw new Error(`ERROR LIKSOM! ${r}`);
        }
      );
  }
  getDeck(id: string): Observable<any> {
    return of(
      this.http.get(`https://www.keyforgegame.com/api/decks/${id}/?links=cards`)
    ).pipe();
  }
}
export default new KeyforgeApi();
