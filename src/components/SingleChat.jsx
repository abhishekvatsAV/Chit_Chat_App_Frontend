import {
  Avatar,
  Button,
  Flex,
  FormControl,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputRightAddon,
  InputRightElement,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { ChatState } from "../context/ChatProvider";
import {
  getSender,
  getSenderFull,
  getSenderDetails,
} from "../config/ChatLogics";
import ProfileModal from "../components/miscellaneous/ProfileModal";
import UpdateGroupChatModel from "./miscellaneous/UpdateGroupChatModel";
import { useEffect, useState } from "react";
import axios from "../config/axios";
import "./styles.css";
import ScrollableChat from "./ScrollableChat";
import Lottie from "lottie-react";
import animationData from "../animations/typing.json";

import io from "socket.io-client";
import { endpoint } from "../helper";
const ENDPOINT = endpoint;
let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const {
    user,
    selectedChat,
    setSelectedChat,
    notification,
    setNotification,
    latestMessage,
    setLatestMessage,
  } = ChatState();
  const toast = useToast();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const { data } = await axios.get(
        `/api/message/` + selectedChat._id
      );
      // console.log(messages);
      setMessages(data);
      // console.log(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  const sendMessage = async (event) => {
    if (newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const { data } = await axios.post(
          `/api/message`,
          {
            content: newMessage,
            chatId: selectedChat._id,
          }
        );
        // // console.log(data);
        setLatestMessage(data);
        setNewMessage("");

        socket.emit("new message", data);

        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        // for notification
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setLatestMessage(newMessageRecieved);
        setMessages([...messages, newMessageRecieved]);
      }
    });

    return () => {
      socket.off("message recieved");
    };
  }, [messages, notification, fetchAgain]);

  let sender;
  if (selectedChat) {
    sender = getSenderDetails(user, selectedChat.users);
  }

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    // typing indicator logic here
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    let timerLength = 3000;

    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {selectedChat.isGroupChat ? (
              <>
                <Image
                  borderRadius="full"
                  boxSize="55px"
                  src="https://res.cloudinary.com/dudoss6ih/image/upload/v1668261314/onePiece_wxbog4.jpg"
                  alt="One Piece"
                  style={{ cursor: "pointer" }}
                />
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModel
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            ) : (
              <>
                <Avatar
                  size="lg"
                  cursor="pointer"
                  name={sender.name}
                  src={sender.pic}
                />
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            )}
          </Text>
          <Flex
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="whiteAlpha.100"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
            gap={2}
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div
                className="messages"
                src="https://res.cloudinary.com/dudoss6ih/image/upload/v1668275950/chatBg_o3y4t6.webp"
              >
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl
              onKeyDown={(e) => {
                e.key === "Enter" && sendMessage(e);
              }}
              isRequired
              mt={3}
            >
              {isTyping && (
                <div>
                  <Lottie
                    options={defaultOptions}
                    // height={50}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              )}
              <InputGroup size="lg">
                <Input
                  variant="filled"
                  bg="whiteAlpha.200"
                  placeholder="Type a message.."
                  onChange={typingHandler}
                  value={newMessage}
                  _hover={{ bg: "whiteAlpha.300" }}
                  _focus={{ bg: "whiteAlpha.300", borderColor: "brand.500" }}
                  borderRadius="full"
                  pr="60px"
                />
                <InputRightAddon
                  bg="brand.500"
                  _hover={{ bg: "brand.600" }}
                  cursor="pointer"
                  onClick={sendMessage}
                  borderRadius="full"
                  px={4}
                  transition="all 0.2s"
                >
                  <img 
                    src="https://img.icons8.com/ios-glyphs/30/ffffff/paper-plane.png" 
                    alt="Send"
                  />
                </InputRightAddon>
              </InputGroup>
            </FormControl>
          </Flex>
        </>
      ) : (
        <Flex alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Flex>
      )}
    </>
  );
};

export default SingleChat;
