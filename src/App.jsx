import { Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import ChatPage from "./pages/ChatPage";
import { Box } from "@chakra-ui/react";

function App() {
  return (
    <Box
      w="100vw"
      h="100vh"
      bgGradient="linear(to-br, gray.900, gray.800, brand.900)"
      overflowY="hidden"
      position="relative"
    >
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/chats" element={<ChatPage />} />
      </Routes>
    </Box>
  );
}

export default App;
