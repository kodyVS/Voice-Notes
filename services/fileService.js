const fs = require("fs");
const path = require("path");

const downloadsPath = path.join(__dirname, "../downloads");
const databasePath = path.join(__dirname, "../fileDatabase.json");

const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const saveFile = (fileName, data) => {
  try {
    ensureDirectoryExists(downloadsPath);
    const localPath = path.join(downloadsPath, fileName);
    fs.writeFileSync(localPath, data, "binary");
    console.log(`Saved file '${fileName}' to '${localPath}'`);
    return localPath;
  } catch (error) {
    console.error(`Failed to save file '${fileName}':`, error);
    return null;
  }
};

const deleteFile = (filePath) => {
  try {
    fs.unlinkSync(filePath);
    console.log(`Deleted local file '${filePath}'`);
  } catch (error) {
    console.error(`Failed to delete local file '${filePath}':`, error);
  }
};

const loadDatabase = () => {
  if (!fs.existsSync(databasePath)) {
    fs.writeFileSync(databasePath, JSON.stringify([]));
  }
  return JSON.parse(fs.readFileSync(databasePath, "utf8"));
};

const saveDatabase = (data) => {
  fs.writeFileSync(databasePath, JSON.stringify(data, null, 2));
};

module.exports = { saveFile, deleteFile, loadDatabase, saveDatabase };
