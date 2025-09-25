import React from "react";
import { Route, Routes } from "react-router-dom";
import Game from "./pages/Game";
import Home from "./pages/Home";
import {Toaster} from "react-hot-toast"
const App = () => {
  return (
    <>
      <div className=" min-h-screen bg-black text-white">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
      </Routes>
      <Toaster position="top-center" />
      </div>
    </>
  );
};

export default App;
