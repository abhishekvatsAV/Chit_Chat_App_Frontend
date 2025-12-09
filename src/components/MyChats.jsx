import {
  Avatar,
  Box,
  Button,
  Flex,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import axios from "../config/axios";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import { getSender, getSenderDetails } from "../config/ChatLogics";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { AiOutlineUser } from "react-icons/ai";
import { endpoint } from "../helper";

const MyChats = ({ fetchAgain }) => {
  const {
    selectedChat,
    setSelectedChat,
    user,
    chats,
    setChats,
    latestMessage,
    setLatestMessage,
  } = ChatState();
  const [loggedUser, setLoggedUser] = useState();
  const toast = useToast();

  const fetchChats = async () => {
    // // console.log(user._id);
    try {
      const { data } = await axios.get("/api/chat");
      // console.log(data);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain, latestMessage]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="whiteAlpha.200"
      backdropFilter="blur(10px)"
      w={{ base: "100%", md: "31%" }}
      borderRadius="xl"
      borderWidth="1px"
      borderColor="whiteAlpha.300"
      boxShadow="2xl"
      transition="all 0.3s"
      _hover={{ boxShadow: "dark-lg" }}
    >
      <Flex
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <Avatar size="lg" cursor="pointer" name={user.name} src={user.pic} />
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Flex>
      <Flex
        flexDir="column"
        p={3}
        bg="blackAlpha.200"
        w="100%"
        h="100%"
        borderRadius="xl"
        overflowY="hidden"
        gap={2}
      >
        {chats ? (
          <Stack overflowY="scroll" spacing={2} w="100%">
            {chats?.map((chat) => (
              <Flex
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "brand.500" : "whiteAlpha.100"}
                color={selectedChat === chat ? "white" : "whiteAlpha.900"}
                px={3}
                py={3}
                borderRadius="lg"
                key={chat._id}
                _hover={{ 
                  bg: selectedChat === chat ? "brand.600" : "whiteAlpha.300",
                  transform: "translateX(5px)"
                }}
                transition="all 0.2s"
                align="center"
                gap={3}
              >
                {!chat.isGroupChat ? (
                  <Avatar
                    size="lg"
                    cursor="pointer"
                    name={getSenderDetails(loggedUser, chat.users).name}
                    src={getSenderDetails(loggedUser, chat.users).pic}
                  />
                ) : (
                  <Avatar
                    size="lg"
                    cursor="pointer"
                    src="https://res.cloudinary.com/dudoss6ih/image/upload/v1668261314/onePiece_wxbog4.jpg"
                  />
                )}
                <Text as="b" margin={5} mt={0}>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}

                  {chat?.latestMessage?.sender?.name === user.name ? (
                    <Text
                      fontSize={{ base: "14px", md: "16px" }}
                      color="gray.500"
                      fontWeight="normal"
                    >
                      {chat?.latestMessage && (
                        <>You : {chat?.latestMessage?.content}</>
                      )}
                    </Text>
                  ) : (
                    <Text
                      fontSize={{ base: "14px", md: "16px" }}
                      color="gray.500"
                      fontWeight="normal"
                    >
                      {chat.latestMessage?.sender?.name && (
                        <>
                          {chat?.latestMessage?.sender?.name} :{" "}
                          {chat?.latestMessage?.content}
                        </>
                      )}
                    </Text>
                  )}
                </Text>
              </Flex>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Flex>
    </Box>
  );
};

export default MyChats;
