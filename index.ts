import {TTTGame as Game, Observer} from "./model";
import * as $ from 'jquery';

class View {
  private playerSymbols = [' ','X','O'];
  constructor(private game:Game, private ctrl:Controller){}

  display() {
    console.log("displaying...");

    let gamebox = $('#game-box');
    gamebox.empty(); //clear old display

    // make grid of buttons
    for(let i=0; i<this.game.size; i++){ //row
      let row = $('<div>'); //a row for the button
      for(let j=0; j<this.game.size; j++) {
        let player = this.game.getPiece(i,j);
        if(player === undefined) player = -1;

        let button = $('<button class="btn btn-default">'+this.playerSymbols[player+1]+'</button>')
        button.click((e) => this.handleClick(i,j)); //closure!!
        row.append(button);
      }
      gamebox.append(row);
    }

    //show winner, if any
    let winner = game.getWinner();
    if(winner !== undefined){
      this.showWinner(winner)
      $('button').attr('disabled','disabled'); //disable all the buttons
    }
    else {
      this.showPrompt(); //show prompt for next move
    }
  }

  //callback for clicking
  handleClick(row, col) {
    this.ctrl.takeTurn(row, col); //tell controller what to do
  }

  showPrompt():void {
    let player = this.playerSymbols[game.getCurrentPlayer()+1]
    $('#message').html('<p class="lead">'+player+"'s turn. Pick a spot!"+'</p>')
  }

  showWinner(winner:number):void {
    let player = this.playerSymbols[winner+1]
    $('#message').html('<p class="lead">'+player+" is the winner!"+'</p>')
  }

  //observer
  notify() {
    this.display();
  }
}

class Controller {
  private view:View;
  constructor(private game:Game){
    this.view = new View(game, this);
    this.game.register(this.view); //connect game and view
    this.view.display(); //show the initial view
  }

  //when told what to do, pass it along to the game
  takeTurn(row:number, col:number):void{
    if(this.game.getWinner() === undefined)
      this.game.makeMove(row, col);
  }
}

//run the program!
let game:Game = new Game();

// game.makeMove(0,0); //x //debugging
// game.makeMove(0,1); //o
// game.makeMove(1,0); //x
// game.makeMove(1,1); //o
// game.makeMove(2,0); //x

let ctrl:Controller = new Controller(game); //will create the View