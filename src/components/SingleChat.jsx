import {
  Avatar,
  Flex,
  FormControl,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputRightAddon,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { ChatState } from "../context/ChatProvider";
import { getSender, getSenderFull, getSenderDetails } from "../config/ChatLogics";
import ProfileModal from "../components/miscellaneous/ProfileModal";
import UpdateGroupChatModel from "./miscellaneous/UpdateGroupChatModel";
import axios from "../config/axios";
import "./styles.css";
import ScrollableChat from "./ScrollableChat";
import { endpoint } from "../helper";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeout = useRef();
  const socketRef = useRef();
  const selectedChatRef = useRef();
  const { user, selectedChat, setSelectedChat, setNotification, setLatestMessage } =
    ChatState();
  const toast = useToast();

  useEffect(() => {
    if (!user?._id) return undefined;
    const socket = io(endpoint, {
      auth: { token: user.token },
    });
    socketRef.current = socket;
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
    socket.on("message recieved", (message) => {
      if (selectedChatRef.current?._id === message.chat._id) {
        setLatestMessage(message);
        setMessages((current) =>
          current.some((item) => item._id === message._id)
            ? current
            : [...current, message]
        );
      } else {
        setNotification((current) =>
          current.some((item) => item._id === message._id)
            ? current
            : [message, ...current]
        );
        setFetchAgain((current) => !current);
      }
    });

    return () => {
      socket.disconnect();
      socketRef.current = undefined;
    };
  }, [user, setFetchAgain, setLatestMessage, setNotification]);

  useEffect(() => {
    selectedChatRef.current = selectedChat;
    if (!selectedChat || !socketRef.current) return;
    socketRef.current.emit("join chat", selectedChat._id);
  }, [selectedChat]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChat) return;
      setLoading(true);
      try {
        const { data } = await axios.get(`/api/message/${selectedChat._id}`);
        setMessages(data);
        socketRef.current?.emit("join chat", selectedChat._id);
      } catch (error) {
        toast({
          title: "Unable to load messages",
          description: error.response?.data?.message || error.message,
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [selectedChat, toast]);

  const sendMessage = async () => {
    const content = newMessage.trim();
    if (!content || !selectedChat) return;
    socketRef.current?.emit("stop typing", selectedChat._id);
    try {
      const { data } = await axios.post("/api/message", {
        content,
        chatId: selectedChat._id,
      });
      setLatestMessage(data);
      setNewMessage("");
      setMessages((current) => [...current, data]);
      socketRef.current?.emit("new message", data);
    } catch (error) {
      toast({
        title: "Unable to send message",
        description: error.response?.data?.message || error.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const typingHandler = (event) => {
    setNewMessage(event.target.value);
    if (!socketConnected || !selectedChat) return;
    socketRef.current?.emit("typing", selectedChat._id);
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socketRef.current?.emit("stop typing", selectedChat._id);
    }, 1200);
  };

  if (!selectedChat) {
    return (
      <Flex alignItems="center" justifyContent="center" h="100%" px={8} textAlign="center">
        <Text fontSize={{ base: "xl", md: "3xl" }} color="whiteAlpha.700">
          Choose a crew mate or create a group to set sail.
        </Text>
      </Flex>
    );
  }

  const sender = getSenderDetails(user, selectedChat.users);
  return (
    <>
      <Flex
        w="100%"
        align="center"
        gap={3}
        pb={3}
        px={2}
        borderBottom="1px solid"
        borderColor="whiteAlpha.200"
      >
        <IconButton
          display={{ base: "flex", md: "none" }}
          icon={<ArrowBackIcon />}
          onClick={() => setSelectedChat(undefined)}
          aria-label="Back to chats"
        />
        {selectedChat.isGroupChat ? (
          <>
            <Image
              borderRadius="full"
              boxSize="48px"
              src="/logo192.png"
              alt="Group"
            />
            <Text fontWeight="bold" flex={1} noOfLines={1}>
              {selectedChat.chatName}
            </Text>
            <UpdateGroupChatModel
              fetchAgain={fetchAgain}
              setFetchAgain={setFetchAgain}
              fetchMessages={() => {}}
            />
          </>
        ) : (
          <>
            <Avatar size="md" name={sender?.name} src={sender?.pic} />
            <Text fontWeight="bold" flex={1} noOfLines={1}>
              {getSender(user, selectedChat.users)}
            </Text>
            <ProfileModal user={getSenderFull(user, selectedChat.users)} />
          </>
        )}
      </Flex>
      <Flex flexDir="column" justifyContent="flex-end" p={3} w="100%" h="100%" overflow="hidden">
        {loading ? (
          <Spinner size="xl" alignSelf="center" m="auto" />
        ) : (
          <div className="messages">
            <ScrollableChat messages={messages} />
          </div>
        )}
        {isTyping && <Text color="brand.200" fontSize="sm" mb={1}>A crew mate is typing...</Text>}
        <FormControl
          mt={3}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              sendMessage();
            }
          }}
        >
          <InputGroup size="lg">
            <Input
              variant="filled"
              bg="whiteAlpha.100"
              placeholder="Send a message to the crew..."
              value={newMessage}
              onChange={typingHandler}
              borderRadius="full"
            />
            <InputRightAddon
              bg="brand.500"
              color="white"
              cursor="pointer"
              onClick={sendMessage}
              borderRadius="full"
              px={5}
            >
              Send
            </InputRightAddon>
          </InputGroup>
        </FormControl>
      </Flex>
    </>
  );
};

export default SingleChat;
