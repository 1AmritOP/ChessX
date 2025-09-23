import React, { useEffect, useRef, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

const INIT_GAME = "init_game";
const MOVE = "move";
const GAME_OVER = "game_over";
const ERROR = "error";
const CHECK = "check";

const Game = () => {
  const [color, setColor] = useState(null);
  const [yourTurn, setYourTurn] = useState(false);
  const [game, setGame] = useState(new Chess());
  const wsRef = useRef(null);
  const colorRef = useRef(null);

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
          const { move, fen } = message.payload;

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

        case ERROR:{
          let error=message.payload;
          alert(error)
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
      alert("not your turn");
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
    <>
      <h1 className=" text-3xl font-bold"> Chess x </h1>
      <h1>{color}</h1>

      <Chessboard
        options={{
          position: game.fen(),
          onPieceDrop: peiceDrop,
          boardOrientation: color || "white",
        }}
      />
    </>
  );
};

export default Game;
