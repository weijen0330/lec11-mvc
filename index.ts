//for CLI interactive
const readline = require('readline');
const io = readline.createInterface({ 
  input: process.stdin, 
  output: process.stdout
});

/**
 * Represents a game of Tic Tac Toe.
 * Board size is hard-coded at 3.
 */

class Controller {
  private model;
  private view;

  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  //starts the game
  play() {
    this.view.printBoard();
    this.takeTurn();
  }

  takeTurn() {
    this.view.printPrompt();
    io.question('> ', (input) => {
      try {
        let cell = input.split(',');
        //make a move!
        let result = this.model.makeMove(Number(cell[0]),Number(cell[1]));
        if(result){ //legal move
          this.view.printBoard();
          if(this.model.getWinner() !== undefined){
            this.model.printWinner(this.model.getWinner());
            io.close();
            return; //end
          }
        }
      } catch(e) {} //for parsing errors

      this.takeTurn(); //recurse!
    })
  }
}

class Model {
  private currentPlayer:number = 0;
  private winner:number = undefined;
  private gameBoard:number[][];
  public readonly size = 3; //hard-coded for simplicity

  constructor() {
    this.resetBoard(); //initialize board
  }

  //returns if sucessful or not
  makeMove(x:number, y:number):boolean {
    if(this.winner) return false; //don't move if won
    if(x <0 || x > 2 || y < 0 || y > 2) return false; //out of bounds
    if(this.gameBoard[x][y] !== undefined) return false; //don't move if illegal

    this.gameBoard[x][y] = this.currentPlayer; //make move

    //check if we now have a winner
    let gb = this.gameBoard;

    //check row
    if(gb[x][0] == gb[x][1] && gb[x][1] == gb[x][2]) this.winner = this.currentPlayer;

    //check col
    if(gb[0][y] == gb[1][y] && gb[1][y] == gb[2][y]) this.winner = this.currentPlayer;

    //check diag
    if( gb[1][1] !== undefined && (
        (gb[0][0] == gb[1][1] && gb[1][1] == gb[2][2]) ||
        (gb[2][0] == gb[1][1] && gb[1][1] == gb[0][2]) ))
      this.winner = this.currentPlayer;

    this.currentPlayer = (this.currentPlayer+1) % 2; //toggle

    return true;
  }

  resetBoard() {
    this.gameBoard = [
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
    ];
  }


  getPiece(x:number, y:number):number{
    if(x <0 || x > 2 || y < 0 || y > 2) return undefined; //out of bounds
    return this.gameBoard[x][y];
  }

  getBoard() {
    return this.gameBoard;
  }

  getCurrentPlayer():number {
    return this.currentPlayer;
  }

  getWinner():number {
    return this.winner;
  }
}

class View {
  private playerSymbols = [' ','X','O']; //for display
  public readonly size = 3; //hard-coded for simplicity

  printBoard() {
    //print the board
    console.log("    0   1   2");
    for(let i=0; i<this.size; i++) {
      let row = i+"   ";
      for(let j=0; j<this.size; j++) {

        let player = this.getPiece(i,j);
        if(player === undefined) player = -1;
        row += this.playerSymbols[player+1];

        if(j < this.size - 1)
          row += " | ";
      }
      console.log(row);
      if(i < this.size -1)
        console.log("   -----------");
    }
    console.log("");
  }

  printWinner(winner:number):void {
    let player = this.playerSymbols[winner+1];
    console.log(player+" is the winner!");
  }

  printPrompt() {
    let player = this.playerSymbols[game.getCurrentPlayer()+1];
    console.log(player+"'s turn. Pick a spot [row, col]");
  }
}

let model = new Model();
let view = new View();
let controller = new Controller(model, view);
controller.play();