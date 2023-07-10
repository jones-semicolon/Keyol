const express = require("express");
const dotenv = require('dotenv');
const { google } = require("googleapis");
const cors = require('cors');
const PORT = process.env.PORT || 5174;
const app = express();
// app.use(cors());
app.use(express.json());
dotenv.config();
const allowed_origins = [
  'https://jonestly-source.github.io',
  'http://localhost:5173'
]
app.use((req,res,next)=>{
    // res.setHeader('Access-Control-Allow-Origin','https://jonestly-source.github.io');
  if (req.headers.origin) {
    if (allowed_origins.indexOf(req.headers.origin) > -1) {
      res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    }
  }
    next(); 
})

let responseSent = false;

const auth = new google.auth.JWT(
  process.env.GOOGLE_CLIENT_EMAIL,
  null,
  process.env.PRIVATE_KEY,
  ['https://www.googleapis.com/auth/drive']
);

app.get("/image", async (req, res) => {
  const url = req.query.url;
  if (!url) {
    res.status(400).send('Missing required parameter: url');
    return;
  }

  try {
    const fetch = (await import('node-fetch')).default
    const response = await fetch(url);
    const contentType = response.headers.get('content-type');
    res.set('Content-Type', contentType);
    response.body.pipe(res);
  } catch (err) {
    console.log(err);
    res.status(500).send('Error fetching image');
  }
});


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

async function getFolderId(parentFolder, folderPath) {
  const drive = google.drive({ version: 'v3', auth });
  let currentFolder = parentFolder;
  const folders = folderPath.split('/');
  for (const folderName of folders) {
    const res = await exponentialBackoff(drive, {
      q: `'${currentFolder.id}' in parents and mimeType='application/vnd.google-apps.folder' and trashed = false and name='${folderName}'`,
      fields: 'files(id, name)',
    });
    if (res.data.files.length > 0) {
      currentFolder = {id: res.data.files[0].id, name: res.data.files[0].name};
    } else {
      console.log('No folders found with that name.');
      return null;
    }
  }
  return currentFolder;
}

async function readDriveRecursive(folderId, range) {
  let result = { name: '', files: [], folders: [] };
  const drive = google.drive({ version: 'v3', auth });
  const query = `'${folderId}' in parents and trashed = false`;
  const res = await exponentialBackoff(drive, { q: query, fields: 'files(id, name, mimeType, imageMediaMetadata, fileExtension, modifiedTime, thumbnailLink, webContentLink, webViewLink)' });
  const files = res.data.files;
  if (files.length) {
    const folderPromises = [];
    for (const file of files) {
      if (file.mimeType === 'application/vnd.google-apps.folder') {
        folderPromises.push(
          readDriveRecursive(file.id, range).then(res => {
            res.name = file.name;
            result.folders.push(res);
          })
        );
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
        if (['mp4', 'mov', 'avi', 'flv', 'wmv'].includes(ext) && !range) {
          result.files.push({
            src: file.webViewLink,
            fileType: ext,
            name: file.name,
            modifiedTime: new Date(file.modifiedTime),
            thumbnailLink: src,
            width: 16,
            height: 9
          });
        } else if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) {
          result.files.push({
            src,
            fileType: ext,
            name: file.name,
            modifiedTime: new Date(file.modifiedTime),
            thumbnailLink: src,
            width: file.imageMediaMetadata.width,
            height: file.imageMediaMetadata.height
          });
        }
      }
    }
    await Promise.all(folderPromises);
    result.files.sort((a, b) => b.modifiedTime - a.modifiedTime);
    if (range) {
      result.files = result.files.slice(0, range);
    }
  } else {
    console.log('No files found.');
  }
  return result;
}

app.get("/images", async (req, res) => {
  const folderId = req.query.folderId;
  const folderPath = req.query.folderPath;
  const range = parseInt(req.query.range);
  if (!folderId && !folderPath) {
    res.status(400).send('Missing required parameter: folderId or folderPath');
    return;
  }

  try {
    let currentFolder = {id: folderId, name: 'root'}
    if (currentFolder.id && folderPath) {
      currentFolder = await getFolderId(currentFolder, folderPath);
      if (!currentFolder.id) {
        res.status(404).send('Folder not found');
        return;
      }
    }

    const result = await readDriveRecursive(currentFolder.id, range);
    result.name = currentFolder.name
    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).send('Error reading drive');
  }
});

app.listen(PORT);
module.exports = app;
