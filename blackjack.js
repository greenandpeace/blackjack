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
          return "K";
        default:return this.num;
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
        //カードをシャッフル()
        let m = this.list.length;
        while (m) {
            const i = Math.floor(Math.random()*m--);
            [this.list[m],this.list[i]] = [this.list[i],this.list[m]];
        }
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
}
const deck = new Deck
console.log(deck.shuffle());
