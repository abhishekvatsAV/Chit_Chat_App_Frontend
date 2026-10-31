import { Box } from "@chakra-ui/react";
import { ChatState } from "../../context/ChatProvider";
import SingleChat from "../SingleChat";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();
  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={{ base: 3, md: 5 }}
      bg="rgba(20, 31, 40, .62)"
      backdropFilter="blur(18px)"
      w={{ base: "100%", md: "calc(100% - 376px)" }}
      borderRadius="24px"
      border="1px solid"
      borderColor="whiteAlpha.200"
      boxShadow="0 20px 60px rgba(0,0,0,.24)"
      transition="all 0.3s"
      _hover={{ boxShadow: "dark-lg" }}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default ChatBox;
