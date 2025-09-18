import { Chess } from "chess.js";
import { ERROR, INIT_GAME, MOVE } from "./message.js";

export class Game {
  constructor(player1, player2) {
    this.player1 = player1;
    this.player2 = player2;
    this.board = new Chess();
    this.moves = [];
    this.startTime = new Date();
    this.player1.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          color: "white",
        },
      })
    );
    this.player2.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          color: "black",
        },
      })
    );
  }

  makeMove(socket, move) {
    // validate, isPlayerMove ??
    let turn = this.board.turn(); // return -> "w" or "b"
    if (
      (turn === "w" && socket !== this.player1) ||
      (turn === "b" && socket !== this.player2)
    ) {
      console.log("Not Your Turn");
      return;
    }
    // is valid move ??

    let result;
    try {
      result = this.board.move(move);
    } catch (error) {
      console.log("Invalid move (error):", error);
      socket.send(
        JSON.stringify({
          type: ERROR,
          payload: "Invalid Move",
        })
      );
      return;
    }

    if (!result) {
      socket.send(
        JSON.stringify({
          type: ERROR,
          payload: "Invalid Move",
        })
      );
      return;
    }


    //check isGameOver ??
    // i have to write some code


    const update= JSON.stringify({
      type : MOVE,
      payload:{
        move : result,
        fen : this.board.fen()
      }
    })

    this.player1.send(update);
    this.player2.send(update);

  }
}
