# Voice Note Processing Service

## Overview

The Voice Note Processing Service is a Node.js application designed to automate the transcription, processing, and storage of audio files from Dropbox. The service transcribes audio files using OpenAI's Whisper model, processes the transcription with various prompts, and stores the results in Notion. 

The app [Easy Voice Recorder](https://play.google.com/store/apps/details?id=com.digipom.easyvoicerecorder.pro&hl=en_CA) paid is the one I use, so I set it up with that app in mind since it works with Bluetooth devices and auto syncs to dropbox or google drive.  

The program uses [this template](https://luxurious-carpenter-115.notion.site/c845ea2fb287499aa331f720144cfc20?v=c979de8ced4b4c9e82b83c42da8fc454&pvs=) in notion to display the notes.

## Features

- **Dropbox Integration**: Lists and downloads audio files from a specified Dropbox folder.
- **Audio Transcription**: Transcribes audio files using OpenAI's Whisper model.
- **Text Processing**: Processes transcriptions with predefined prompts using OpenAI's GPT model.
- **Notion Integration**: Creates detailed pages in Notion with transcription results and metadata.
- **File Management**: Manages downloaded files locally, ensuring cleanup after processing.

## Prerequisites

- Node.js (>=18.x)
- Dropbox API credentials
- OpenAI API key
- Notion API key and database ID

## Setup

1. **Clone the Repository**

   ```bash
   git clone <repository-url>
   cd <repository-directory>

   ```

2. Install Dependencies
   `npm install`

3. Configure Environment Variables
   Create a .env file in the root directory and add the following variables:

```
PORT=3000
DROPBOX_CLIENT_ID=<your-dropbox-client-id>
DROPBOX_CLIENT_SECRET=<your-dropbox-client-secret>
DROPBOX_REFRESH_TOKEN=<your-dropbox-refresh-token>
OPENAI_API_KEY=<your-openai-api-key>
NOTION_API_KEY=<your-notion-api-key>
NOTION_DATABASE_ID=<your-notion-database-id>
```

### Usage

1. Start the Server

`npm start`

2. Automatic Processing
   The server will check for new audio files in the specified Dropbox folder every 5 minutes (300,000 milliseconds). When new files are found, they are processed and the results are stored in Notion.

### Configuration

Located in config.js, this file defines the prompts used for processing transcriptions:

```js
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
```

### .env Sample

```
PORT=3000
DROPBOX_CLIENT_ID=<your-dropbox-client-id>
DROPBOX_CLIENT_SECRET=<your-dropbox-client-secret>
DROPBOX_REFRESH_TOKEN=<your-dropbox-refresh-token>
OPENAI_API_KEY=<your-openai-api-key>
NOTION_API_KEY=<your-notion-api-key>
NOTION_DATABASE_ID=<your-notion-database-id>
```

### Contributing

Contributions are welcome! Please open an issue or submit a pull request with your changes.

### License

This project is licensed under the MIT License. See the LICENSE file for details.
