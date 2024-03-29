import Head from "next/head";
import { Box, chakra, Flex, Text, useDisclosure } from "@chakra-ui/react";
import { Footer } from "../components/footer";
import Navigation from "../components/Navigation";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { ResumeHeading } from "../components/resume/ResumeHeading";
import fs from "fs";
import { load } from "js-yaml";
import { join } from "path";
import { ExperienceItem } from "../components/resume/ExperienceItem";
import { ResumeTop } from "../components/resume/ResumeTop";
import { useState } from "react";
import { joinStrings } from "../utils";
import dynamic from "next/dynamic";

const ResumeEditor = dynamic(import("../components/resume/ResumeEditor"), { ssr: false });

export default function Resume({ resumeData }) {
  const { isOpen: isEditing, onOpen, onClose } = useDisclosure({ defaultIsOpen: false });

  const [selectedTags, setSelectedTags] = useState(resumeData.defaultTags);

  const textItem = (item) => {
    const isSelected = !item.tags || selectedTags.some((tag) => item.tags.includes(tag));
    return isSelected ? item.name : null;
  };

  const itemsToText = (items) =>
    items
      ?.map(textItem)
      .filter((t) => t !== null)
      .join(", ");

  const MiscSection = [
    { name: "Achievements", items: itemsToText(resumeData.awards) },
    { name: "Interests", items: itemsToText(resumeData.interests) },
    { name: "Languages", items: itemsToText(resumeData.languages) },
    { name: "Tools", items: itemsToText(resumeData.technologies) },
  ].filter((s) => s.items?.length > 0);

  const MiscTitle = "Skills";

  return (
    <chakra.div bg={"#F0F0F0"} minHeight={"100vh"}>
      <Head>
        <title>Matthew Allen</title>
        <meta
          name="description"
          content="Hey! I'm Matthew Allen, a coder in the midwest. Here's my resumé :)"
        />
        <meta property="og:url" content="https://yok.dev/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Matthew Allen: My resumé" />
        <meta
          property="og:description"
          content="Hey! I'm Matthew Allen, an incompetent undergraduate. Here's my resumé :)"
        />
        <meta property="og:image" content="https://bcdn.samyok.us/api/ogimage?url=/resume&wait=0" />
      </Head>

      <main>
        <Navigation />
        <style>{`
        @media print {
          html, body {
            background-color: #fff;
            max-height: 100vh;
            overflow: hidden;
          }
        }
        `}</style>
        <Flex justifyContent={"center"}>
          <Box px={8} pb={20} w={1000} maxW={"100%"}>
            <ResumeEditor
              data={resumeData}
              tags={[selectedTags, setSelectedTags]}
              isEditing={isEditing}
              onOpen={onOpen}
              onClose={onClose}
            />
            <ResumeTop isEditing={isEditing} />
            <ResumeHeading as={"h2"}>Education</ResumeHeading>
            {resumeData.education.map((item, index) => (
              <ExperienceItem
                selectedTags={selectedTags}
                item={item}
                key={"education-" + index}
                isEditing={isEditing}
              />
            ))}
            <ResumeHeading as={"h2"}>Experience</ResumeHeading>
            {resumeData.work.map((item, index) => (
              <ExperienceItem
                selectedTags={selectedTags}
                item={item}
                key={"work-" + index}
                isEditing={isEditing}
              />
            ))}
            <ResumeHeading as={"h2"}>Projects</ResumeHeading>
            {resumeData.projects.map((item, index) => (
              <ExperienceItem
                selectedTags={selectedTags}
                item={item}
                key={"work-" + index}
                isEditing={isEditing}
              />
            ))}
            <ResumeHeading as={"h2"}>{MiscTitle}</ResumeHeading>
            {MiscSection.map((s) => (
              <Text fontSize={12} pt={0.5} fontWeight={300} key={s.items}>
                <Text as={"span"} fontWeight={500}>
                  {s.name}:
                </Text>{" "}
                {s.items}
              </Text>
            ))}
          </Box>
        </Flex>
      </main>
      <Footer />
    </chakra.div>
  );
}

export const getStaticProps = () => {
  const yaml = fs.readFileSync(join(process.cwd(), "./data/resume.yaml"), "utf8");
  const resumeData = load(yaml);
  return {
    props: { resumeData },
  };
};
