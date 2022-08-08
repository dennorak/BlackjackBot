const { createCanvas, loadImage } = require("canvas");
const fs = require("node:fs");
const { v4: uuidv4 } = require("uuid");

module.exports = {
  Hand: class {
    suits = ["hearts", "spades", "clubs", "diamonds"];
    denos = [
      "A",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "J",
      "Q",
      "K",
    ];

    constructor(uuid) {
      this.count = 2;
      this.uuid = uuidv4();
      this.cards = [this.getRandomCard(), this.getBlankCard()];
      this.dealer = [this.getRandomCard(), this.getRandomCard()];
    }

    getBlankCard() {
      return { suit: "b", deno: "b" };
    }

    getRandomCard() {
      return {
        suit: this.suits[Math.floor(Math.random() * this.suits.length)],
        deno: this.denos[Math.floor(Math.random() * this.denos.length)],
      };
    }

    async renderHand() {
      const canvas = createCanvas(64 * this.count, 64);
      const ctx = canvas.getContext("2d");
      for (var card in this.cards) {
        if (this.cards[card].suit === "b") {
          var image = await loadImage("./assets/card_back.png");
        } else {
          var image = await loadImage(
            `./assets/card_${this.cards[card].suit}_${this.cards[card].deno}.png`
          );
        }
        ctx.drawImage(image, 64 * card, 0, 64, 64);
      }
      const buffer = canvas.toBuffer("image/png");
      fs.writeFileSync(`./assets/temp/${this.uuid}.png`, buffer);
      return `http://beaconwire.com/temp/${this.uuid}.png`;
    }

    async renderDealer() {
      const canvas = createCanvas(64 * this.count, 64);
      const ctx = canvas.getContext("2d");
      for (var card in this.dealer) {
        var image = await loadImage(
          `./assets/card_${this.dealer[card].suit}_${this.dealer[card].deno}.png`
        );
        ctx.drawImage(image, 64 * card, 0, 64, 64);
      }
      const buffer = canvas.toBuffer("image/png");
      fs.writeFileSync(`./assets/temp/${this.uuid}_deal.png`, buffer);
      return `http://beaconwire.com/temp/${this.uuid}_deal.png`;
    }
  },
};
