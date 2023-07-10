const express = require("express");
const dotenv = require('dotenv');
const { google } = require("googleapis");
const cors = require('cors');
const PORT = process.env.PORT || 5174;
const app = express();
// app.use(cors());
app.use(express.json());
dotenv.config();
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','https://jonestly-source.github.io');
    next(); 
})

let responseSent = false;

const auth = new google.auth.JWT(
  process.env.GOOGLE_CLIENT_EMAIL,
  null,
  process.env.PRIVATE_KEY,
  ['https://www.googleapis.com/auth/drive']
);


async function exponentialBackoff(drive, options, retries = 3) {
  try {
    const res = await drive.files.list(options);
    return res;
  } catch (err) {
    if (err.code === 403 && retries > 0) {
      // Exponential backoff
      const delay = Math.pow(2, 5 - retries) * 1000;
      console.log(`Rate limit error, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return exponentialBackoff(drive, options, retries - 1);
    } else {
      throw err;
    }
  }
}

async function getFolderId(parentFolderId, folderPath) {
  const drive = google.drive({ version: 'v3', auth });
  let currentFolderId = parentFolderId;
  const folders = folderPath.split('/');
  for (const folderName of folders) {
    const res = await exponentialBackoff(drive, {
      q: `'${currentFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed = false and name='${folderName}'`,
      fields: 'files(id, name)',
    });
    if (res.data.files.length > 0) {
      currentFolderId = res.data.files[0].id;
    } else {
      console.log('No folders found with that name.');
      return null;
    }
  }
  return currentFolderId;
}

async function readDriveRecursive(folderId, range, callback) {
  let result = { name: '', files: [], folders: [] };
  const drive = google.drive({ version: 'v3', auth });
  const query = `'${folderId}' in parents and trashed = false`;
  const res = await exponentialBackoff(drive, { q: query, fields: 'files(id, name, mimeType, imageMediaMetadata, fileExtension, modifiedTime, thumbnailLink, webContentLink, webViewLink)' });
  const files = res.data.files;
  if (files.length) {
    let pending = files.length;
    for (const file of files) {
      if (file.mimeType === 'application/vnd.google-apps.folder') {
        readDriveRecursive(file.id, range, function(err, res) {
          res.name = file.name;
          result.folders.push(res);
          if (!--pending) {
            result.files.sort((a, b) => b.modifiedTime - a.modifiedTime);
            if (range) {
              result.files = result.files.slice(0, range);
            }
            callback(null, result);
          }
        });
      } else {
        const ext = file.fileExtension.toLowerCase();
        let src = '';
        if (file.thumbnailLink) {
          src = `${file.thumbnailLink.split('=')[0]}=s1280`;
        } else if (file.webContentLink) {
          src = file.webContentLink;
        } else if (file.webViewLink) {
          src = file.webViewLink;
        }
        if (['mp4', 'mov', 'avi', 'flv', 'wmv'].includes(ext)) {
          result.files.push({
            src: file.webContentLink,
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
          if (range) {
            result.files = result.files.slice(0, range);
          }
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
  const folderPath = req.query.folder;
  const range = req.query.range;
  let folderName = '';
  if (!parentFolderId) {
    res.status(400).send('Missing required parameter: folderId');
    return;
  }

  let folderId = parentFolderId;
  if (folderPath) {
    folderId = await getFolderId(parentFolderId, folderPath);
    if (!folderId) {
      res.status(404).send('Folder not found');
      return;
    }
    folderName = folderPath.split('/').pop();
  }

  readDriveRecursive(folderId, range, (err, result) => {
    if (err) {
      res.sendStatus(400).send("Unable to scan directory");
      return console.log('Unable to scan directory: ' + err);
    }
    if (!responseSent && result.files.length || result.folders.length) {
      result.name = folderName
      res.json(result);
      responseSent = true;
    }
  });
});

app.listen(PORT);
module.exports = app;
