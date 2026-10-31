import { Box, Skeleton, Stack } from "@chakra-ui/react";

const ChatLoading = () => {
  return (
    <Stack spacing={3}>
      {[1, 2, 3, 4, 5].map((item) => (
        <Box key={item} p={3} borderRadius="14px" bg="whiteAlpha.50">
          <Skeleton height="14px" width={item % 2 ? "70%" : "52%"} />
          <Skeleton height="10px" width="38%" mt={2} />
        </Box>
      ))}
    </Stack>
  );
};

export default ChatLoading;
