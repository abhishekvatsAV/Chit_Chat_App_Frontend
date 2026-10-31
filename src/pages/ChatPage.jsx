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
    <Box w="100%" h="100vh" display="flex" flexDirection="column" p={{ base: 0, md: 3 }}>
      {user && <SideDrawer />}
      <Flex 
        justifyContent="space-between" 
        w="100%" 
        h={{ base: "calc(100vh - 72px)", md: "calc(100vh - 84px)" }}
        p={{ base: 2, md: 3 }}
        gap={{ base: 2, md: 4 }}
        maxW="1500px"
        mx="auto"
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
