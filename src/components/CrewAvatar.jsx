import { Avatar, AvatarBadge, Box, Flex, Icon } from "@chakra-ui/react";
import { GiAnchor, GiCompass, GiPirateFlag, GiShipWheel } from "react-icons/gi";

const crewIcons = [GiAnchor, GiCompass, GiPirateFlag, GiShipWheel];
const crewColors = ["#d1495b", "#2a9d8f", "#e9c46a", "#457b9d"];

const CrewAvatar = ({ name, src, isOnline, isGroup, size = "md" }) => {
  const index = [...(name || "crew")].reduce(
    (total, character) => total + character.charCodeAt(0),
    0
  ) % crewIcons.length;
  const CrewIcon = crewIcons[index];

  return (
    <Box position="relative" flexShrink={0}>
      <Avatar
        size={size}
        name={name}
        src={isGroup ? undefined : src}
        bg={crewColors[index]}
        color="white"
        border="2px solid"
        borderColor="whiteAlpha.300"
        icon={
          isGroup ? (
            <Icon as={GiPirateFlag} boxSize="55%" />
          ) : (
            <Flex
              align="center"
              justify="center"
              w="100%"
              h="100%"
              fontSize="0"
              bg={crewColors[index]}
            >
              <Icon as={CrewIcon} boxSize="45%" />
            </Flex>
          )
        }
      >
        {isOnline && (
          <AvatarBadge
            boxSize="0.8em"
            bg="#55c878"
            borderColor="#101820"
          />
        )}
      </Avatar>
    </Box>
  );
};

export default CrewAvatar;
