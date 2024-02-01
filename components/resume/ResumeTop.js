import { Box, Flex, Heading, Link, Text } from "@chakra-ui/react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe, faPaperPlane, faPhone } from "@fortawesome/free-solid-svg-icons";

import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { useRouter } from "next/router";

const TextLink = (props) => (
  <Text fontSize={12} fontWeight={300} mx={2} onClick={(e) => props.onEdit?.(e)}>
    {props.icon && <FontAwesomeIcon icon={props.icon} />}
    <Link href={props.href} marginLeft={props.icon ? 2 : 0}>
      {props.children}
    </Link>
  </Text>
);

// if type is array, first one is default
const data = {
  email: ["matthew.allen2409@gmail.com"],
  phone: ["(224) 358-6621"],
  github: ["/matthew-allen2409", "github.com/matthew-allen2409"],
  linkedin: ["/in/matthew-allen-bb3408223", "linkedin.com/in/matthew-allen-bb3408223"],
  url: ["yok.dev", "www.yok.dev", "//yok.dev"],
};

const autoPrintIndices = {
  phone: 1,
};

export const ResumeTop = ({ isEditing }) => {
  const router = useRouter();

  const [dataIndices, setDataIndices] = useState({
    email: 0,
    phone: 0,
    github: 0,
    linkedin: 0,
    url: 0,
  });

  const cycleData = (prop) => {
    return (e) => {
      // prevent default if editing
      if (isEditing) {
        if (e) e.preventDefault();
        // cycle data indices of prop
        if (data[prop]) {
          setDataIndices((prev) => {
            const next = { ...prev };
            next[prop] = (next[prop] + 1) % data[prop].length;
            return next;
          });
        }
      }
    };
  };

  const getValue = (prop) => {
    if (router.query.hasOwnProperty("print") && autoPrintIndices.hasOwnProperty(prop)) {
      return data[prop][autoPrintIndices[prop]];
    }
    return data[prop][dataIndices[prop]];
  };

  return (
    <Box pt={6} px={2} textAlign={"center"}>
      <Heading size={"xl"} mb={1}>
        Matthew Allen
      </Heading>
      <Flex justifyContent={"center"}>
        <TextLink href={`mailto:${getValue("email")}`} onEdit={cycleData("email")} icon={faPaperPlane}>
          {getValue("email")}
        </TextLink>
        <TextLink href={`tel:${getValue("phone")}`} onEdit={cycleData("phone")} icon={faPhone}>
          {getValue("phone")}
        </TextLink>
        <TextLink href={"https://github.com/iCalculated"} onEdit={cycleData("github")} icon={faGithub}>
          {getValue("github")}
        </TextLink>
        <TextLink href={"https://linkedin.com/in/shydrie"} onEdit={cycleData("linkedin")} icon={faLinkedin}>
          {getValue("linkedin")}
        </TextLink>
      </Flex>
    </Box>
  );
};
