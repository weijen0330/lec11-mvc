import {TTTGame as Game} from "./Model";

//for CLI interactiv
const readline = require('readline');
const io = readline.createInterface({ 
  input: process.stdin, 
  output: process.stdout
});


class Controller {
  constructor(private game:Game, private view:View){}

  start() {
    this.view.display();
    this.takeTurn();
  }

  takeTurn() {
    this.view.showPrompt();
    io.question('> ', (input) => {
      try {
        let cell = input.split(',');
        //make a move!
        let result = game.makeMove(Number(cell[0]),Number(cell[1]));
        if(result){ //legal move
          this.view.display();
          if(game.getWinner() !== undefined){
            this.view.showWinner(game.getWinner());
            io.close()
            return; //end
          }
        }
      } catch(e) {} //for parsing errors

      this.takeTurn(); //recurse!
    })
  }
}

class View {
  private playerSymbols = [' ','X','O'];
  constructor(private game:Game){}

  //draw the game board
  display() {
    console.log("    0   1   2")
    for(let i=0; i<this.game.size; i++) {
      let row = i+"   ";
      for(let j=0; j<this.game.size; j++) {

        let player = this.game.getPiece(i,j);
        if(player === undefined) player = -1;
        row += this.playerSymbols[player+1];

        if(j < this.game.size - 1) 
          row += " | ";
      }
      console.log(row);
      if(i < this.game.size -1)
        console.log("   -----------");
    }
    console.log("");
  }

  showPrompt():void {
    let player = this.playerSymbols[game.getCurrentPlayer()+1]
    console.log(player+"'s turn. Pick a spot [row, col]");
  }

  showWinner(winner:number):void {
    let player = this.playerSymbols[winner+1]
    console.log(player+" is the winner!");
  }
}


//run the program!
let game:Game = new Game();
let view:View = new View(game);
let ctrl:Controller = new Controller(game, view);
ctrl.start();