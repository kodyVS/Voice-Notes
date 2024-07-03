// config.js
module.exports = {
  prompts: [
    {
      name: "generateTitle",
      system: "You are a helpful assistant that generates titles for text.",
      user: (text) =>
        `Please generate a title for the following text: ${text}. This title can be a maximum of 4 words.`,
      notionHeader: "Title",
    },
    {
      name: "summarizeText",
      system: "You are a helpful assistant that summarizes text.",
      user: (text) => `Please summarize the following text: ${text}`,
      notionHeader: "Summary",
    },
    {
      name: "extractKeyPoints",
      system: "You are a helpful assistant that extracts key points from text.",
      user: (text) => `Please extract key points from the following text: ${text}`,
      notionHeader: "Key Points",
    },
    {
      name: "ActionItems",
      system: "You are a helpful assistant that extracts actionable items from text.",
      user: (text) =>
        `Please extract actionable items from the following text. These items should be items that the speaker can do after: ${text}`,
      notionHeader: "Actionable Items",
    },
    {
      name: "Maxims",
      system: "You are a helpful assistant that extracts maxims from text.",
      user: (text) => `Please provide any maxims from the following text: ${text}`,
      notionHeader: "Maxims",
    },
  ],
};
