const express = require("express");
const { listFiles, downloadFile } = require("./services/dropboxService");
const { transcribeAudio, getAudioDuration } = require("./services/whisperService");
const { processTextWithPrompts } = require("./services/summaryService");
const { saveFile, deleteFile, loadDatabase, saveDatabase } = require("./services/fileService");
const { createNotionPage } = require("./services/notionService");

const app = express();
const port = process.env.PORT || 3000;

const checkDropboxFiles = async (folderPath = "/Test") => {
  try {
    const files = await listFiles(folderPath);
    const database = loadDatabase();

    const newFiles = files.filter((file) => !database.includes(file.name));
    if (newFiles.length > 0) {
      for (const file of newFiles) {
        const fileData = await downloadFile(file);
        if (fileData) {
          const localPath = saveFile(file.name, fileData);
          if (localPath) {
            const durationInSeconds = await getAudioDuration(localPath); // Get the audio duration
            const transcription = await transcribeAudio(localPath); // Transcribe the audio file
            if (transcription) {
              console.log("Transcription:", transcription); // Log the transcription
              const results = await processTextWithPrompts(transcription); // Process the transcription with all prompts

              if (results.summarizeText && results.generateTitle && results.extractKeyPoints) {
                const duration = new Date(durationInSeconds * 1000).toISOString().substr(11, 8); // Convert to HH:mm:ss
                const cost = `$${(durationInSeconds * 0.00125).toFixed(2)}`; // Example cost calculation

                // Create a new Notion page with the transcription and all generated content
                await createNotionPage(
                  results.generateTitle,
                  results,
                  duration,
                  cost,
                  transcription
                );

                deleteFile(localPath); // Delete the local file after successful transcription
                saveDatabase([...database, file.name]); // Update the database
              }
            }
          }
        }
      }
    } else {
      console.log("No new audio files found.");
    }
  } catch (error) {
    console.error("Error checking Dropbox files:", error);
  }
};

// Set an interval to run the Dropbox file check every 60 seconds
setInterval(() => {
  console.log("Checking for new files in Dropbox...");
  checkDropboxFiles("/VoiceNotes"); // Adjust the folder path as needed
}, 300000); // 60000 milliseconds = 60 seconds

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log("Initial check for new Dropbox files...");
  checkDropboxFiles("/VoiceNotes");
});
