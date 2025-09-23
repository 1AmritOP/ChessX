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
      <div className="hero w-full h-screen flex items-center justify-center p-5">
        <div className="left w-1/2 h-full  flex items-center">
          <img className="w-full h-[90%]" src={boardImg} alt="boardImg" />
        </div>
        <div className="right w-1/2 h-full flex flex-col gap-4 p-10">
          <h1 className="text-3xl font-bold text-green-400">ChessX</h1>
          <h2>{text}</h2>
          <button className=" mt-2">
            <Link className="px-4 py-2 bg-green-400 rounded-2xl " to={"/game"}>
              Play
            </Link>
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
