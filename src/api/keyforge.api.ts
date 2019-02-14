import { Observable, of } from "rxjs";
import Vue from "vue";

import { Cardfactory, Deckfactory, Housefactory } from "./factory";
import httpMock from "./mock/mockHttp";

export class KeyforgeApi {
  get http() {
    return process.env.NODE_ENV === "development"
      ? new httpMock()
      : new Vue().$http;
  }
  search(q: string) {
    return this.http
      .get(`https://www.keyforgegame.com/api/decks/?search=${q}&links=cards`)
      .then(
        r => {
          if (!r.data || !r.data.data) {
            console.log(r);
            return;
          }
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
