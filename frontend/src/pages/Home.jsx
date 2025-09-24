import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import boardImg from "../assets/chessBoard.jpg";
import { chessGameFacts } from "../utils/chessFacts";


const Home = () => {
  const [text, setText] = useState("");
  useEffect(() => {
    const randomFact =
      chessGameFacts[Math.floor(Math.random() * chessGameFacts.length)];
    setText(randomFact);
  }, []);

  return (
    <>
      <div className="hero w-full min-h-screen flex-wrap flex items-center justify-center gap-2 p-10">
        <div className="left w-[25rem] h-[25rem]  flex items-center justify-center">
          <img className="w-[90%] h-[90%]" src={boardImg} alt="boardImg" />
        </div>
        <div className="right  w-[25rem] h-[10rem]  flex items-center   gap-4 p-10">
        <div>
          <h1 className="text-3xl font-bold text-green-400">ChessX</h1>
          <h2>{text}</h2>
          <button className=" mt-6">
            <Link className="px-8 py-4 bg-green-800 rounded-xl " to={"/game"}>
              Start Game
            </Link>
          </button>

        </div>
        </div>
      </div>
    </>
  );
};

export default Home;
