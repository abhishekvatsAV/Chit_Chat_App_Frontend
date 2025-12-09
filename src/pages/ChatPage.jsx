import { Box, Flex } from "@chakra-ui/react";
import ChatBox from "../components/miscellaneous/ChatBox";
import MyChats from "../components/MyChats";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import { ChatState } from "../context/ChatProvider";
import { useState } from "react";

const ChatPage = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);
  return (
    <Box w="100%" h="100vh" display="flex" flexDirection="column">
      {user && <SideDrawer />}
      <Flex 
        justifyContent="space-between" 
        w="100%" 
        h="calc(100vh - 60px)" 
        p="10px"
        gap="10px"
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Flex>
    </Box>
  );
};

export default ChatPage;
