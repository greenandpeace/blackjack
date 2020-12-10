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
    const suits = ["スペード","クラブ","ハート","ダイヤ"]
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
    //カードがAでかつ10点タスとバーストするかどうか
    return this.list.reduce((sum,card) => card.num == 1 && sum+11<21? sum+11 :sum + card.point,0);
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
      is_visible ?  $("body").append($(`<p class=${this.constructor.name}>`).append(`<p>${this.constructor.name}の引いたカードは${drawn_card.suit}の${drawn_card.toString}です`)) :
                    $("body").append($(`<p class=${this.constructor.name}>`).append(`<p>${this.constructor.name}の引いたカードはわかりません`))
      this.hand.push(drawn_card);
      let point = this.hand.point;
      if (is_visible) $("body").append($(`<p class=${this.constructor.name}>`).append(`<p>${this.constructor.name}の現在の得点は${point}です`))
      //console.log(this.hand, this.hand.is_burst());
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
        game.compare_score()
        break;

      }
      else {
        this.hit(1,true)
        //もし引いた後に手札がバーストしたら
        //ディーラーの負けでゲーム終わり
        if (this.hand.is_burst()) {
          $("body").append($("<p>").append("ディーラーがバースト！"))
           game.end(this)
           console.log("dealer負け",this.hand.point);
           break;
        }
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
        game.dealer.act()
        //game.compare_score()
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
  compare_score(){
     const p_point = game.player.hand.point;
     const d_point = game.dealer.hand.point;
     $("body").append($(`<p class=${this.constructor.name}>`).append(`あなたの得点は${p_point}です`))
     $("body").append($(`<p class=${this.constructor.name}>`).append(`Dealerの得点は${d_point}です`))
     if (p_point < d_point) {
         game.end(this.player)
     }
     else if (p_point > d_point) {
        game.end(this.dealer)
     }
     //ディーラーとプレイヤーのスコアが同じ＝引き分けの時
     else {
       game.end(null)
     }

  }
  //ゲーム終了loser : 敗者(object)
// 引き分けの時はloser === null
  end(loser) {
      if (loser === this.player) {
          $("body").append($("<p>").append("あなたの負けです！"))
      }
      else if (loser === this.dealer) {
                    $("body").append($("<p>").append("あなたの勝ち！"))
      }
      //nullが渡された＝引き分けの時
      else {
          $("body").append($("<p>").append("引き分け！"))
      }
  }


}
//gambler:手札を表示する持ち主
function show_cards(gambler) {
  //const canvas = $("#canvas")
  const canvas = document.getElementById("canvas")
  const ctx = canvas.getContext("2d");
  const img = document.getElementById("cards");
  const hands = gambler.hand.list;
  console.log(hands);
  //プレイヤーのカードなら手前にディーラーのカードならオクに出すように
  let vertical_padding = gambler==game.dealer? 0 : 64*3;
  hands.forEach((card,index)=>{
    console.log(card.suit,index);
    const suits = ["スペード","クラブ","ハート","ダイヤ"];
    //スペードなら画像の０列目、クラブなら１番目・・というふうに参照する
    let column = suits.findIndex(elem=>elem==card.suit);
    //console.log(column);
        ctx.drawImage(img,(card.num-1)*32,column*64,32,64,index*32,vertical_padding,32,64);
  });
  //ctx.drawImage(img,0,0,32,64,0,0,32,64);
};

const game = new Game()
game.play()
show_cards(game.dealer);
