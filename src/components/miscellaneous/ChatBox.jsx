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
      p={3}
      bg="whiteAlpha.200"
      backdropFilter="blur(10px)"
      w={{ base: "100%", md: "68%" }}
      borderRadius="xl"
      borderWidth="1px"
      borderColor="whiteAlpha.300"
      boxShadow="2xl"
      transition="all 0.3s"
      _hover={{ boxShadow: "dark-lg" }}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default ChatBox;
