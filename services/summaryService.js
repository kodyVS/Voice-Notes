require("dotenv").config();
const OpenAI = require("openai");
const { prompts } = require("../config");

const openai = new OpenAI(process.env.OPENAI_API_KEY);

const processTextWithPrompts = async (text) => {
  const combinedPrompt = prompts
    .map((prompt) => {
      return {
        role: "system",
        content: prompt.system,
      };
    })
    .concat({
      role: "user",
      content: prompts.map((prompt) => prompt.user(text)).join("\n\n"),
    });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: combinedPrompt,
    });

    const resultText = response.choices[0].message.content.trim();
    const results = {};
    const sections = resultText.split("\n\n");

    prompts.forEach((prompt, index) => {
      const section = sections[index]
        ? sections[index].replace(`${prompt.notionHeader}:`, "").trim()
        : null;
      // Remove stars from the section if present
      results[prompt.name] = section ? section.replace(/\*+/g, "").trim() : null;
    });

    return results;
  } catch (error) {
    console.error("Failed to process prompts:", error);
    const results = {};
    prompts.forEach((prompt) => {
      results[prompt.name] = null;
    });
    return results;
  }
};

module.exports = { processTextWithPrompts };
