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
    this.shuffle()
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

//const deck = new Deck
//deck.shuffle()

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
  is_burst() {
    return this.point > 21 ? true : false
  }
}


class Gambler {
  constructor() {
    this.hand = new Hand();
  }
  //num 引く枚数 number
  //is_visible 引いたカードを表示するかどうか boolean
  hit(num,is_visible) {
    for (var i = 1; i <= num; i++) {
      let drawn_card = game.deck.drawn()
      is_visible ?  $("body").append($("<p>").append(`<p>${this.constructor.name}の引いたカードは${drawn_card.suit}の${drawn_card.toString}です`)) :
                    $("body").append($("<p>").append(`<p>${this.constructor.name}の引いたカードはわかりません`))
      this.hand.push(drawn_card)
      let point = this.hand.point;
      if (is_visible) $("body").append($("<p>").append(`<p>${this.constructor.name}の現在の得点は${point}です`))
      console.log(this.hand, this.hand.is_burst());
    }

  }
}

//操作する側
class Player extends Gambler {
  act() {
    $("body").append($("<p>").append("<p>hitしますか?引く場合はY、引かない場合はNを押してください</p>"))
    $("body").keydown(quest_y_n)
  }
}
//対戦相手（コンピューター）
class Dealer extends Gambler {
  act(){
    while (true) {
      if (this.hand.point >= 17) {
        console.log("dealerのhit終わり");
        break;

      }
      else {
        this.hit(1,true)
        console.log(this.hand.point);
      }
    }
  }
}
function quest_y_n(e) {
  //document.addEventListener("keydown",quest_y_n)
    switch (e.code) {
      case "KeyY":
        console.log("yes",this);
        game.player.hit(1,true)
        $("body").off("keydown");
        if (game.player.hand.is_burst()) {
            $("body").append($("<p>").append("あなたの得点が21を超えました"))
                        game.end(game.player)
        }
        else {
          //game.user_act()
          game.player.act()
        }
        break;
      case "KeyN":
        console.log("no");
        $("body").off("keydown");
        game.dealer.act(1,true)
        return;
        break;
    }
}
class Game {
  constructor() {
      this.deck = new Deck();
      this.player = new Player();
      this.dealer = new Dealer();
      console.log(this.deck,this.player);
  }
  play() {
    this.dealer.hit(1,true)
    this.dealer.hit(1,false)
    this.player.hit(2,true)
    this.player.act();
  }
  //ゲーム終了loser : 敗者(object)
  end(loser) {
      if (loser === this.player) {
          $("body").append($("<p>").append("あなたの負け！"))
      }
  }

}
const game = new Game()
game.play()
