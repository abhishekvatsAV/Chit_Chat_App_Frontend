import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import React from "react";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <Flex
      onClick={handleFunction}
      cursor="pointer"
      bg="whiteAlpha.200"
      _hover={{
        background: "brand.500",
        color: "white",
        transform: "translateX(5px)",
      }}
      w="100%"
      alignItems="center"
      color="white"
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
      transition="all 0.2s"
    >
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={user.name}
        src={user.pic}
      />
      <Box>
        <Text>{user.name}</Text>
        <Text fontSize="xs">
          <b>Email : </b>
          {user.email}
        </Text>
      </Box>
    </Flex>
  );
};

export default UserListItem;
