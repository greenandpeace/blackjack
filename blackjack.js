"use strict";
class Card {
  constructor(suit,num) {
    this.suit = suit;
    this.num = num;
  }
  get toString(){
      switch (this.num) {
        case 1:
          return "A";
          break;
        case 11:
          return "J"
        case 12:
          return "Q";
          break;
        case 13:
          return "K";
        default:return this.num.toString();
      }
  }
  get point(){
      //J、Q、Kならば点数は１０。それいがいはそのまま
      return  this.num >= 10 ? 10 : this.num;
  }

}
class Deck {
  //山札の初期化
  constructor() {
    //山札にあるカードのリスト
    this.list = [];
    //使うスートのリスト
    const suits = ["ハート","スペード","クラブ","ダイヤ"]
    //スートごとに１〜１３のカードを作成
    suits.forEach(suit =>{
        for (var i = 1; i <=13 ; i++) {
            this.list.push(new Card(suit,i))
        };
      }
    )
  };
  shuffle() {
    //カードをシャッフル()
    let m = this.list.length;
    while (m) {
        const i = Math.floor(Math.random()*m--);
        [this.list[m],this.list[i]] = [this.list[i],this.list[m]];
    }
    return this.list;
  }
  //山札のカード
  get cards() {
    return this.list
  }
  drawn() {
    return this.list.shift()
  }
}

const deck = new Deck
deck.shuffle()
let tos = deck.list[0]
//console.log(tos.toString);

class Hand {
  constructor() {
      //手札内のカードのリスト
      this.list = [];
  }
  push(card) {
    this.list.push(card)
  }
  //点数の取得 (プレイヤ＾は これを２１に近くしていく)
  //手札がからの時使うとerror
  get point() {
    return this.list.reduce((sum,card) => sum + card.point,0);
  }
}


class User {
  constructor() {
    this.hand = new Hand();
  }
  draw(deck) {
    this.hand.push(deck.drawn())
  }
}
const user = new User()
for (var i = 1; i < 3; i++) {
  user.draw(deck)
  console.log(user.hand,user.hand.point);
}
//console.log(user.hand,deck.cards.length)
