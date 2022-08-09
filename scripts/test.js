const { Blackjack } = require("../src/services/Blackjack");
const prompt = require("prompt-sync")();

const game = new Blackjack();

console.log(game);

let loop = true;

while (loop) {
  const move = prompt("move: ");

  switch (move) {
    case "q":
      loop = false;
      break;
    case "h":
      game.hit();
      break;
    case "s":
      game.stand();
      break;
    case "r":
      game.reset();
      break;
    default:
      console.log("not a valid command.");
      break;
  }
}
