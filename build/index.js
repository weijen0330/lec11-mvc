"use strict";
//for CLI interactive
var readline = require('readline');
var io = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
/**
 * Represents a game of Tic Tac Toe.
 * Board size is hard-coded at 3.
 */
var Controller = (function () {
    function Controller(model, view) {
        this.model = model;
        this.view = view;
    }
    //starts the game
    Controller.prototype.play = function () {
        this.view.printBoard();
        this.takeTurn();
    };
    Controller.prototype.takeTurn = function () {
        var _this = this;
        this.view.printPrompt();
        io.question('> ', function (input) {
            try {
                var cell = input.split(',');
                //make a move!
                var result = _this.model.makeMove(Number(cell[0]), Number(cell[1]));
                if (result) {
                    _this.view.printBoard();
                    if (_this.model.getWinner() !== undefined) {
                        _this.model.printWinner(_this.model.getWinner());
                        io.close();
                        return; //end
                    }
                }
            }
            catch (e) { } //for parsing errors
            _this.takeTurn(); //recurse!
        });
    };
    return Controller;
}());
var Model = (function () {
    function Model() {
        this.currentPlayer = 0;
        this.winner = undefined;
        this.size = 3; //hard-coded for simplicity
        this.resetBoard(); //initialize board
    }
    //returns if sucessful or not
    Model.prototype.makeMove = function (x, y) {
        if (this.winner)
            return false; //don't move if won
        if (x < 0 || x > 2 || y < 0 || y > 2)
            return false; //out of bounds
        if (this.gameBoard[x][y] !== undefined)
            return false; //don't move if illegal
        this.gameBoard[x][y] = this.currentPlayer; //make move
        //check if we now have a winner
        var gb = this.gameBoard;
        //check row
        if (gb[x][0] == gb[x][1] && gb[x][1] == gb[x][2])
            this.winner = this.currentPlayer;
        //check col
        if (gb[0][y] == gb[1][y] && gb[1][y] == gb[2][y])
            this.winner = this.currentPlayer;
        //check diag
        if (gb[1][1] !== undefined && ((gb[0][0] == gb[1][1] && gb[1][1] == gb[2][2]) ||
            (gb[2][0] == gb[1][1] && gb[1][1] == gb[0][2])))
            this.winner = this.currentPlayer;
        this.currentPlayer = (this.currentPlayer + 1) % 2; //toggle
        return true;
    };
    Model.prototype.resetBoard = function () {
        this.gameBoard = [
            [undefined, undefined, undefined],
            [undefined, undefined, undefined],
            [undefined, undefined, undefined],
        ];
    };
    Model.prototype.getPiece = function (x, y) {
        if (x < 0 || x > 2 || y < 0 || y > 2)
            return undefined; //out of bounds
        return this.gameBoard[x][y];
    };
    Model.prototype.getBoard = function () {
        return this.gameBoard;
    };
    Model.prototype.getCurrentPlayer = function () {
        return this.currentPlayer;
    };
    Model.prototype.getWinner = function () {
        return this.winner;
    };
    return Model;
}());
var View = (function () {
    function View() {
        this.playerSymbols = [' ', 'X', 'O']; //for display
        this.size = 3; //hard-coded for simplicity
    }
    View.prototype.printBoard = function () {
        //print the board
        console.log("    0   1   2");
        for (var i = 0; i < this.size; i++) {
            var row = i + "   ";
            for (var j = 0; j < this.size; j++) {
                var player = this.getPiece(i, j);
                if (player === undefined)
                    player = -1;
                row += this.playerSymbols[player + 1];
                if (j < this.size - 1)
                    row += " | ";
            }
            console.log(row);
            if (i < this.size - 1)
                console.log("   -----------");
        }
        console.log("");
    };
    View.prototype.printWinner = function (winner) {
        var player = this.playerSymbols[winner + 1];
        console.log(player + " is the winner!");
    };
    View.prototype.printPrompt = function () {
        var player = this.playerSymbols[game.getCurrentPlayer() + 1];
        console.log(player + "'s turn. Pick a spot [row, col]");
    };
    return View;
}());
var model = new Model();
var view = new View();
var controller = new Controller(model, view);
controller.play();
