// library of a blackjack game
const { createCanvas, loadImage } = require("canvas");
const { getEmbed } = require("./BJ_DiscordCompat.js");

class BlackjackManager {
  constructor() {
    this.sessions = {};
  }

  hit(id) {
    let state = this.sessions[id].hit();
    return getEmbed(
      id,
      state,
      this.sessions[id].score.d,
      this.sessions[id].score.p
    );
  }

  stand(id) {
    let state = this.sessions[id].stand();
    return getEmbed(
      id,
      state,
      this.sessions[id].score.d,
      this.sessions[id].score.p
    );
  }

  reset(id, bet) {
    this.sessions[id] = new Blackjack(bet);
    // return `You: ${this.sessions[id].score.p} | Dealer: ${this.sessions[id].score.d}`;
    return getEmbed(
      id,
      this.sessions[id].state,
      this.sessions[id].score.d,
      this.sessions[id].score.p
    );
  }

  get(id) {
    return {
      state: this.sessions[id].state,
      score: this.sessions[id].score,
    };
  }

  getBet(id) {
    console.log(id);
    console.log(this.sessions[id].bet);
    return this.sessions[id].bet;
  }

  state(id) {
    try {
      return this.sessions[id].state;
    } catch {
      return "none";
    }
  }
}

class Blackjack {
  suits = ["hearts", "spades", "clubs", "diamonds"];
  constructor(bet) {
    this.bet = bet;
    this.state = "playing";
    this.score = {
      p: 0,
      d: 0,
    };
    this.cards = {
      p: [],
      d: [],
    };
    this.getCard("p");
    this.getCard("p");
    this.getCard("d");
  }

  getCard(player) {
    if (this.state !== "playing") {
      return false;
    }
    const deno = Math.floor(Math.random() * (11 - 1) + 1);
    console.log("draw:", deno);
    const suit = this.suits[Math.floor(Math.random() * this.suits.length)];
    const img = `./assets/card_${suit}_${deno}.png`;
    this.score[player] += deno;
    this.cards[player].push({
      deno: deno,
      suit: suit,
      img: img,
    });
    if (this.score.d >= 21) {
      if (this.score.d == 21) {
        this.state = "House Wins!";
        // this.reset();
      } else {
        this.state = `You Win ${this.bet} XWC!`;
        // this.reset();
      }
    } else if (this.score.p >= 21) {
      if (this.score.p === 21) {
        this.state = `You Win ${this.bet} XWC!`;
        // this.reset(false);
      } else {
        this.state = "House Wins!";
        // this.reset(false);
      }
    }
  }

  hit() {
    this.getCard("p");
    console.log(this.state, this.score);
    return this.state;
  }

  stand() {
    while (this.state === "playing") {
      if (this.score.d > this.score.p) {
        this.state = "House Wins!";
        console.log(this.state, this.score);
      } else if (this.score.d < 17) {
        this.getCard("d");
        console.log(this.state, this.score);
      } else if (this.score.d === this.score.p) {
        this.state = "draw";
        console.log(this.state, this.score);
      } else {
        this.state = `You Win ${this.bet} XWC!`;
        console.log(this.state, this.score);
      }
    }
    return this.state;
  }

  /*
  reset(state = true) {
    this.score.d = 0;
    this.score.p = 0;
    this.cards.p = [];
    this.cards.d = [];
    if (state === true) {
      this.state = "playing";
      this.getCard("p");
      this.getCard("p");
      this.getCard("d");
      this.getCard("d");
      console.log(
        "state reset",
        this.state,
        this.score,
        this.bet,
        typeof this.bet
      );
    }
  } */
}

module.exports = {
  Blackjack: class {
    static getManager() {
      if (!Blackjack.manager) {
        Blackjack.manager = new BlackjackManager();
      }
      return Blackjack.manager;
    }
  },
};
