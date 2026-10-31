import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import axios from "../config/axios";
import { AddIcon, SearchIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import { getSender, getSenderDetails } from "../config/ChatLogics";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import CrewAvatar from "./CrewAvatar";
import { GiSailboat } from "react-icons/gi";

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
  const [loggedUser, setLoggedUser] = useState(user);
  const [filter, setFilter] = useState("");
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
    setLoggedUser(user);
    fetchChats();
  }, [fetchAgain, latestMessage, user]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      p={{ base: 4, md: 5 }}
      bg="rgba(20, 31, 40, .78)"
      backdropFilter="blur(18px)"
      w={{ base: "100%", md: "360px" }}
      minW={{ md: "320px" }}
      borderRadius="24px"
      border="1px solid"
      borderColor="whiteAlpha.200"
      boxShadow="0 20px 60px rgba(0,0,0,.24)"
      overflow="hidden"
    >
      <Flex align="center" justify="space-between" mb={5}>
        <Flex align="center" gap={3}>
          <CrewAvatar name={user.name} src={user.pic} size="md" isOnline />
          <Box>
            <Text fontSize="xs" color="brand.200" fontWeight="bold" letterSpacing="0.12em">
              YOUR CREW
            </Text>
            <Heading size="sm" mt={1}>{user.name}</Heading>
          </Box>
        </Flex>
        <GroupChatModal>
          <Button
            aria-label="Create group"
            title="Create group"
            size="sm"
            borderRadius="full"
            colorScheme="brand"
            leftIcon={<AddIcon />}
          >
            Create
          </Button>
        </GroupChatModal>
      </Flex>
      <InputGroup mb={4}>
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="whiteAlpha.500" />
        </InputLeftElement>
        <Input
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          placeholder="Search your conversations"
          bg="blackAlpha.300"
          border="1px solid"
          borderColor="whiteAlpha.200"
          borderRadius="14px"
          _focus={{ borderColor: "brand.300", boxShadow: "0 0 0 1px #f4a261" }}
        />
      </InputGroup>
      <Flex
        flexDir="column"
        w="100%"
        h="100%"
        overflowY="hidden"
      >
        <Flex align="center" justify="space-between" mb={3}>
          <Text color="whiteAlpha.600" fontSize="xs" fontWeight="bold" letterSpacing="0.12em">
            MESSAGES
          </Text>
          <Text color="whiteAlpha.500" fontSize="xs">{chats?.length || 0} voyages</Text>
        </Flex>
        {chats ? (
          <Stack overflowY="auto" spacing={2} w="100%" pr={1}>
            {chats.filter((chat) => {
              const label = chat.isGroupChat
                ? chat.chatName
                : getSender(loggedUser, chat.users);
              return label?.toLowerCase().includes(filter.toLowerCase());
            }).map((chat) => (
              <Flex
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat?._id === chat._id ? "brand.500" : "whiteAlpha.50"}
                color={selectedChat?._id === chat._id ? "white" : "whiteAlpha.900"}
                px={3}
                py={3}
                borderRadius="16px"
                key={chat._id}
                _hover={{
                  bg: selectedChat?._id === chat._id ? "brand.600" : "whiteAlpha.300",
                  transform: "translateY(-2px)",
                  borderColor: "whiteAlpha.300",
                }}
                border="1px solid transparent"
                transition="all 0.2s"
                align="center"
                gap={3}
              >
                <CrewAvatar
                  size="md"
                  isGroup={chat.isGroupChat}
                  name={chat.isGroupChat ? chat.chatName : getSenderDetails(loggedUser, chat.users).name}
                  src={chat.isGroupChat ? undefined : getSenderDetails(loggedUser, chat.users).pic}
                />
                <Box minW={0} flex={1}>
                  <Flex justify="space-between" align="center" gap={2}>
                    <Text fontWeight="bold" noOfLines={1}>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                    </Text>
                    <Text fontSize="10px" color="whiteAlpha.500" flexShrink={0}>
                      {chat.latestMessage ? new Date(chat.latestMessage.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                    </Text>
                  </Flex>
                  {chat?.latestMessage?.sender?.name === user.name ? (
                    <Text
                      fontSize="sm"
                      color={selectedChat?._id === chat._id ? "whiteAlpha.800" : "whiteAlpha.500"}
                      fontWeight="normal"
                      noOfLines={1}
                    >
                      You: {chat.latestMessage.content}
                    </Text>
                  ) : (
                    <Text
                      fontSize="sm"
                      color={selectedChat?._id === chat._id ? "whiteAlpha.800" : "whiteAlpha.500"}
                      fontWeight="normal"
                      noOfLines={1}
                    >
                      {chat.latestMessage
                        ? `${chat.latestMessage.sender?.name || "Crew"}: ${chat.latestMessage.content}`
                        : "Start a new conversation"}
                    </Text>
                  )}
                </Box>
              </Flex>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
        {chats?.length === 0 && (
          <Flex direction="column" align="center" textAlign="center" py={12} px={5}>
            <Icon as={GiSailboat} boxSize={12} color="brand.200" mb={3} />
            <Text fontWeight="bold">Your inbox is an open sea</Text>
            <Text color="whiteAlpha.600" fontSize="sm" mt={1}>Search for someone or create a group to begin.</Text>
          </Flex>
        )}
      </Flex>
    </Box>
  );
};

export default MyChats;
