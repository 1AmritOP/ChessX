import React, { useEffect, useRef, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import toast from "react-hot-toast";

const INIT_GAME = "init_game";
const MOVE = "move";
const GAME_OVER = "game_over";
const ERROR = "error";
const DRAW = "draw";
const CHECK = "check";
const KING = "k";
const BLACK = "b";
const WHITE = "w";

const Game = () => {
  const [color, setColor] = useState(null);
  const [yourTurn, setYourTurn] = useState(false);
  const [game, setGame] = useState(new Chess());
  const [moves, setMoves] = useState([]);
  const [squareStyles, setSquareStyles] = useState({});
  const [checkedKingSquare, setCheckedKingSquare] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  const wsRef = useRef(null);
  const colorRef = useRef(null);


  useEffect(() => {
    if (game.isCheck()) {
      setSquareStyles({
        [checkedKingSquare]: {
          backgroundColor: "rgba(255, 0, 0, 0.6)",
        },
      });
    } else {
      setSquareStyles({});
    }
  }, [game, checkedKingSquare]);

  useEffect(() => {
    if (!wsRef.current) {
      wsRef.current = new WebSocket(import.meta.env.VITE_BACKEND_URL);

      wsRef.current.onopen = () => {
        console.log("Connected to WebSocket server");
        wsRef.current.send(JSON.stringify({ type: INIT_GAME }));
      };
    }

    wsRef.current.onmessage = (msg) => {
      const message = JSON.parse(msg.data);
      console.log("server message", message);

      switch (message.type) {
        case INIT_GAME: {
          const serverColor = message.payload.color;
          setColor(serverColor);
          colorRef.current = serverColor;
          setYourTurn(serverColor === "white");
          break;
        }

        case MOVE: {
          const { move, fen, moves } = message.payload;
          setMoves(moves);

          const newGame = new Chess(fen);
          setGame(newGame);

          const nextTurnWhite = newGame.turn() === "w";
          const amWhite = colorRef.current === "white";

          setYourTurn(
            (nextTurnWhite && amWhite) || (!nextTurnWhite && !amWhite)
          );

          console.log("Applied server move:", move);
          break;
        }

        case GAME_OVER: {
          let winner = message.payload.winner;
          toast(`Checkmate, winner is : ${winner}`);
          setGameOver(true);
          break;
        }

        case DRAW: {
          toast("Game Draw");
          break;
        }
        case CHECK: {
          const data = message.payload.checkKingSquare;
          setCheckedKingSquare(data);
          break;
        }
        case ERROR: {
          let error = message.payload;
          toast.error(error);
          break;
        }
      }
    };

    wsRef.current.onclose = () => console.log("❌ Disconnected from server");
    wsRef.current.onerror = (err) => console.error("⚠️ WebSocket error:", err);
    return () => {
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, []);

  const peiceDrop = ({ sourceSquare, targetSquare }) => {
    if (!yourTurn) {
      console.log("not your turn");
      toast("not your turn");
      return;
    }
    const move = {
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    };

    // false return karne ka code likhna hai jab move invalid ho, frontend se check karke
    // agar move sahi hua to backend ko send karo

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: MOVE, move }));
      console.log("move sent");
    }

    return true;
  };
  return (
    <div className=" p-5 min-h-screen w-full">
      <h1 className=" text-3xl font-bold text-center "> ChessX </h1>
      {color === null ? (
        <h1 className="font-bold text-xl">Searching for Opponets...</h1>
      ) : (
        <>
          <h1 className="font-bold text-xl text-center my-2">
            You are {color}
          </h1>
          <div className=" flex gap-2 justify-center max-sm:flex-col max-sm:items-center ">
            <div className="w-[40%] max-md:w-[75%] max-sm:w-[90%] max-[400px]:w-[100%] ">
              <Chessboard
                options={{
                  position: game.fen(),
                  onPieceDrop: peiceDrop,
                  boardOrientation: color || "white",
                  allowDragOffBoard: false,
                  darkSquareStyle: { backgroundColor: "rgb(2, 74, 2)" },
                  allowDragging: !game.isGameOver(),
                  squareStyles,
                  // boardStyle: {
                  //   height: "100%",
                  //   width: "100%",
                  // },
                }}
              />
            </div>
            <div
              className="
              moves h-80 w-fit p-6 overflow-y-auto
              [&::-webkit-scrollbar]:w-2
              [&::-webkit-scrollbar-track]:rounded-full
            [&::-webkit-scrollbar-track]:bg-gray-100
              [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:bg-gray-300"
            >
              {gameOver && (
                <>
                  <h1 className="font-bold text-3xl text-red-500">Game Over</h1>
                  <button
                    type="button"
                    className=" px-4 py-2 bg-green-800 rounded-xl text-xl font-bold cursor-pointer my-2"
                    onClick={() => {
                      window.location.reload();
                    }}
                  >
                    New Game
                  </button>
                </>
              )}
              <h1 className=" font-bold text-xl">Moves :</h1>
              {moves.map((move, index) => (
                <p
                  key={index}
                  className={`${
                    index % 2 === 0 ? "text-white" : "text-green-400"
                  }`}
                >
                  {" "}
                  {index + 1}. {move}
                </p>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Game;
