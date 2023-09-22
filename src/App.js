import "./App.css";

import { Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import ChatPage from "./pages/ChatPage";

import { useCallback } from "react";
import Particles from "react-particles";
import { loadFull } from "tsparticles";
import options from "./animations/particles.json";

function App() {
  const particlesInit = useCallback(async (engine) => {
    // // console.log(engine);
    await loadFull(engine);
  }, []);

  return (
    <div className="App">
      <Particles id="tsparticles" init={particlesInit} options={options} />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/chats" element={<ChatPage />} />
      </Routes>
    </div>
  );
}

export default App;
