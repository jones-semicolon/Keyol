const express = require("express");
const dotenv = require('dotenv');
const { google } = require("googleapis");
const cors = require('cors');
const PORT = process.env.PORT || 5174;
const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

const auth = new google.auth.JWT(
  process.env.GOOGLE_CLIENT_EMAIL,
  null,
  process.env.PRIVATE_KEY,
  ['https://www.googleapis.com/auth/drive']
);

async function getFolderId(parentFolderId, folderName) {
  const drive = google.drive({ version: 'v3', auth });
  const res = await drive.files.list({
    q: `'${parentFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed = false and name='${folderName}'`,
    fields: 'files(id, name)',
  });
  if (res.data.files.length > 0) {
    return res.data.files[0].id;
  } else {
    console.log('No folders found with that name.');
  }
}

async function readDriveRecursive(folderId, range, callback) {
  let result = { name: '', files: [], folders: [] };
  const drive = google.drive({ version: 'v3', auth });
  const query = `'${folderId}' in parents and trashed = false`;
  const res = await drive.files.list({ q: query, fields: 'files(id, name, mimeType, imageMediaMetadata, fileExtension, modifiedTime, thumbnailLink)' });
  const files = res.data.files;
  if (files.length) {
    let pending = files.length;
    for (const file of files) {
      if (range > 0 && result.files.length >= range) {
        break;
      }
      if (file.mimeType === 'application/vnd.google-apps.folder') {
        readDriveRecursive(file.id, range, function(err, res) {
          res.name = file.name;
          result.folders.push(res);
          if (!--pending) {
            result.files.sort((a, b) => b.modifiedTime - a.modifiedTime);
            callback(null, result);
          }
        });
      } else {
        const ext = file.fileExtension.toLowerCase();
        if (['mp4', 'mov', 'avi', 'flv', 'wmv'].includes(ext)) {
          result.files.push({
            src: `${file.thumbnailLink.split('=')[0]}=s1280`,
            fileType: "video",
            width: 16,
            height: 9,
            modifiedTime: file.modifiedTime,
          });
        } else if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext)) {
          result.files.push({
            src: `${file.thumbnailLink.split('=')[0]}=s1280`,
            fileType: "image",
            width: file.imageMediaMetadata.width,
            height: file.imageMediaMetadata.height,
            modifiedTime: file.modifiedTime,
          });
        } else {
          // Ignore other file types
        }
        if (!--pending) {
          result.files.sort((a, b) => b.modifiedTime - a.modifiedTime);
          callback(null, result);
        }
      }
    }
    if (pending === files.length) {
      callback(null, result);
    }
  } else {
    callback(null, result);
  }
}

app.get("/images", async (req, res) => {
  const parentFolderId = req.query.folderId
  const folderName = req.query.folder;
  const range = req.query.range;
  if (!parentFolderId) {
    res.status(400).send('Missing required parameter: folderId');
    return;
  }

  let folderId = parentFolderId;
  if (folderName) {
    folderId = await getFolderId(parentFolderId, folderName);
    if (!folderId) {
      res.status(404).send('Folder not found');
      return;
    }
  }
  
  readDriveRecursive(folderId, range, (err, result) => {
    if (err) {
      res.sendStatus(400);
      return console.log('Unable to scan directory: ' + err);
    }
    res.json(result);
  });
});

app.listen(PORT);
module.exports = app;
