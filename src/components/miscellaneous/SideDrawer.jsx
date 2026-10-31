import {
  Avatar,
  Button,
  Box,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import React, { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import axios from "../../config/axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../userAvatar/UserListItem";
import { getSender } from "../../config/ChatLogics";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";
import { endpoint } from "../../helper";
import { FiBell, FiLogOut, FiSearch } from "react-icons/fi";
import { GiCompass } from "react-icons/gi";
import CrewAvatar from "../CrewAvatar";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const toast = useToast();

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.get(
        `/api/user?search=${encodeURIComponent(search)}`
      );
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const { data } = await axios.post(`/api/chat`, { userId });

      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }

      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.response?.data?.message || error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        bg="rgba(16, 24, 32, .88)"
        backdropFilter="blur(10px)"
        w="100%"
        px={{ base: 4, md: 7 }}
        py={3}
        borderBottom="1px solid"
        borderColor="whiteAlpha.200"
        boxShadow="0 10px 30px rgba(0,0,0,.16)"
        position="sticky"
        top={0}
        zIndex={10}
      >
        <Tooltip label="Find a crew mate" hasArrow placement="bottom-end">
          <Button
            variant="ghost"
            onClick={onOpen}
            borderRadius="12px"
            leftIcon={<FiSearch />}
            color="whiteAlpha.800"
            _hover={{ bg: "whiteAlpha.100", color: "brand.200" }}
          >
            <Text display={{ base: "none", md: "flex" }}>
              Find a crew mate
            </Text>
          </Button>
        </Tooltip>
        <Flex align="center" gap={2}>
          <Flex
            align="center"
            justify="center"
            w="38px"
            h="38px"
            borderRadius="12px"
            bg="brand.500"
            color="white"
            boxShadow="0 6px 18px rgba(209,73,91,.3)"
          >
            <GiCompass size={23} />
          </Flex>
          <Box display={{ base: "none", sm: "block" }}>
            <Text fontSize="lg" fontWeight="800" letterSpacing="-0.03em" lineHeight={1}>
              Sea Chat
            </Text>
            <Text fontSize="10px" color="brand.200" letterSpacing="0.14em" fontWeight="bold">
              FIND YOUR CREW
            </Text>
          </Box>
        </Flex>
        <Flex align="center" gap={{ base: 1, md: 3 }}>
          <Menu>
            <MenuButton
              as={Button}
              variant="ghost"
              p={2}
              minW="42px"
              borderRadius="12px"
              position="relative"
              _hover={{ bg: "whiteAlpha.100" }}
            >
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <FiBell size={20} />
            </MenuButton>
            <MenuList
              p={2}
              bg="#18242d"
              borderColor="whiteAlpha.200"
              borderRadius="16px"
              zIndex={10}
              boxShadow="0 20px 50px rgba(0,0,0,.35)"
            >
              {!notification.length && (
                <Text px={3} py={2} color="whiteAlpha.600" fontSize="sm">
                  No new messages
                </Text>
              )}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  borderRadius="10px"
                  bg="transparent"
                  _hover={{ bg: "whiteAlpha.100" }}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton
              as={Button}
              variant="ghost"
              rightIcon={<ChevronDownIcon />}
              borderRadius="14px"
              px={2}
              _hover={{ bg: "whiteAlpha.100" }}
            >
              <CrewAvatar size="sm" name={user.name} src={user.pic} isOnline />
            </MenuButton>
            <MenuList bg="#18242d" borderColor="whiteAlpha.200" borderRadius="16px" zIndex={10} p={2}>
              <ProfileModal user={user}>
                <MenuItem borderRadius="10px" bg="transparent" _hover={{ bg: "whiteAlpha.100" }}>
                  My Profile
                </MenuItem>
              </ProfileModal>
              <MenuDivider borderColor="gray.700" />
              <MenuItem
                borderRadius="10px"
                bg="transparent"
                icon={<FiLogOut />}
                _hover={{ bg: "whiteAlpha.100", color: "red.200" }}
                onClick={logoutHandler}
              >
                LogOut
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent bg="#14212a">
          <DrawerHeader borderBottom="1px solid" borderColor="whiteAlpha.200">
            <Text fontSize="lg">Find your next crew mate</Text>
            <Text fontSize="xs" color="whiteAlpha.600" fontWeight="normal" mt={1}>
              Search by name or email to start a private chat.
            </Text>
          </DrawerHeader>
          <DrawerBody>
            <Flex pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Flex>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => {
                return (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChat(user._id)}
                  />
                );
              })
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
