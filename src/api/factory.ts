import Deck from "@/model/deck";
import House from "@/model/house";
import Card from "@/model/card";
import ViewDeck from "@/model/viewDeck";

class _Deckfactory {
  viewDeck(deck: Deck, houses: House[], cards: Card[]): ViewDeck {
    return {
      id: deck.id,
      name: deck.name,
      houses: deck.houses
        .map(id => houses.find(h => h.id === id))
        .filter(h => h),
      cards: deck.cards.map(id => cards.find(c => c.id === id)).filter(c => c)
    };
  }

  deck(data: any): Deck {
    return {
      id: data.id,
      name: data.name,
      houses: data._links.houses,
      cards: data._links.cards
    };
  }

  //   houses(data: any): House[] {
  //     console.log(data);
  //     if (!data._linked || !data._linked.houses || !data._links.houses) return [];

  //     return data._linked.houses
  //       .filter((h: { id: string }) =>
  //         data._links.houses.some((f: string) => f === h.id)
  //       )
  //       .map((h: any) => Housefactory.house(h));
  //   }

  //   cards(data: any): Card[] {
  //     if (!data._linked || !data._linked.cards || !data._links.cards) return [];

  //     return data._links.cards.map((id: string) =>
  //       Cardfactory.card(
  //         data._linked.cards.find((c: { id: string }) => c.id === id)
  //       )
  //     );
  //   }
}
class _Housefactory {
  house(data: any): House {
    return { id: data.id, name: data.name, image: data.image };
  }
}

class _Cardfactory {
  card(data: any): Card {
    return {
      id: data.id,
      card_title: data.card_title,
      house: data.house,
      card_type: data.card_type,
      front_image: data.front_image,
      card_text: data.card_text,
      traits: data.traits,
      amber: data.amber,
      power: data.power,
      armor: data.armor,
      rarity: data.rarity,
      flavor_text: data.flavor_text,
      card_number: data.card_number,
      expansion: data.expansion,
      is_maverick: data.is_maverick
    };
  }
}

export const Deckfactory = new _Deckfactory();
export const Housefactory = new _Housefactory();
export const Cardfactory = new _Cardfactory();
