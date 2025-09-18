import React from "react";
import { Route, Routes } from "react-router-dom";
import Game from "./pages/Game";
import Home from "./pages/Home";
const App = () => {
  return (
    <>
      <div className=" h-screen bg-black text-white">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
      </Routes>
      </div>
    </>
  );
};

export default App;
