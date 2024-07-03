require("dotenv").config();
const { Dropbox } = require("dropbox");

const dbx = new Dropbox({
  clientId: process.env.DROPBOX_CLIENT_ID,
  clientSecret: process.env.DROPBOX_CLIENT_SECRET,
  refreshToken: process.env.DROPBOX_REFRESH_TOKEN,
});

const listFiles = async (folderPath = "/Test") => {
  try {
    const response = await dbx.filesListFolder({ path: "/Apps/Easy Voice Recorder" });
    console.log(response.result.entries);
    return response.result.entries;
  } catch (error) {
    console.error("Error listing Dropbox files:", error);
    return [];
  }
};

const downloadFile = async (file) => {
  try {
    const response = await dbx.filesDownload({ path: file.path_lower });
    return response.result.fileBinary; // Assuming binary data is available
  } catch (error) {
    console.error(`Failed to download '${file.name}':`, error);
    return null;
  }
};

module.exports = { listFiles, downloadFile };
