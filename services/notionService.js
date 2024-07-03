require("dotenv").config();
const { Client } = require("@notionhq/client");
const { prompts } = require("../config");

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;

const chunkText = (text, chunkSize = 2000) => {
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  return chunks;
};

const createNotionPage = async (title, results, duration, cost, transcription) => {
  try {
    const children = [];
    // Add sections for each prompt result
    for (const prompt of prompts) {
      if (results[prompt.name]) {
        children.push({
          object: "block",
          type: "heading_2",
          heading_2: {
            rich_text: [
              {
                type: "text",
                text: {
                  content: prompt.notionHeader,
                },
              },
            ],
          },
        });

        const chunks = chunkText(results[prompt.name]);
        chunks.forEach((chunk) => {
          children.push({
            object: "block",
            type: "paragraph",
            paragraph: {
              rich_text: [
                {
                  type: "text",
                  text: {
                    content: chunk,
                  },
                },
              ],
            },
          });
        });
      }
    }
    children.push({
      object: "block",
      type: "heading_2",
      heading_2: {
        rich_text: [
          {
            type: "text",
            text: {
              content: "Transcription",
            },
          },
        ],
      },
    });

    const transcriptionChunks = chunkText(transcription);
    transcriptionChunks.forEach((chunk) => {
      children.push({
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [
            {
              type: "text",
              text: {
                content: chunk,
              },
            },
          ],
        },
      });
    });

    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        Title: {
          title: [
            {
              text: {
                content: title,
              },
            },
          ],
        },
        Type: {
          select: {
            name: "AI Transcription",
          },
        },
        Duration: {
          rich_text: [
            {
              text: {
                content: duration,
              },
            },
          ],
        },
        "AI Cost": {
          number: parseFloat(cost.replace("$", "")),
        },
        "Duration (Seconds)": {
          number: parseFloat(duration.split(":").reduce((acc, time) => 60 * acc + +time)),
        },
      },
      children,
    });

    console.log("Notion page created:", response.id);
    return response;
  } catch (error) {
    console.error("Failed to create Notion page:", error);
    return null;
  }
};

module.exports = { createNotionPage };
