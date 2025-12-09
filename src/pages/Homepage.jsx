import {
  Box,
  Container,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";

const Homepage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      navigate("/chats");
    }
  }, [navigate]);

  return (
    <Container maxW="xl" centerContent>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        p={4}
        bg={"whiteAlpha.200"}
        backdropFilter="blur(10px)"
        w="100%"
        m="40px 0 20px 0"
        borderRadius="xl"
        borderWidth="2px"
        borderColor="whiteAlpha.300"
        boxShadow="2xl"
        transition="all 0.3s"
        _hover={{ transform: "translateY(-2px)", boxShadow: "dark-lg" }}
      >
        <Text 
          fontSize="5xl" 
          fontFamily="Work sans" 
          color="white"
          fontWeight="bold"
          bgGradient="linear(to-r, brand.300, brand.500, brand.300)"
          bgClip="text"
        >
          💬 Chit-Chat
        </Text>
      </Box>
      <Box
        bg="whiteAlpha.200"
        backdropFilter="blur(10px)"
        w="100%"
        p={6}
        borderRadius="xl"
        borderWidth="2px"
        borderColor="whiteAlpha.300"
        boxShadow="2xl"
      >
        <Tabs isFitted variant="soft-rounded" colorScheme="brand">
          <TabList mb="1.5em" gap={2}>
            <Tab 
              color="white" 
              _selected={{ color: "white", bg: "brand.500", boxShadow: "md" }}
              borderRadius="md"
              transition="all 0.2s"
              _hover={{ bg: "whiteAlpha.300" }}
            >
              Login
            </Tab>
            <Tab 
              color="white" 
              _selected={{ color: "white", bg: "brand.500", boxShadow: "md" }}
              borderRadius="md"
              transition="all 0.2s"
              _hover={{ bg: "whiteAlpha.300" }}
            >
              Sign Up
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Homepage;
