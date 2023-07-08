const express = require("express")
const fs = require("fs")
const sizeOf = require('image-size');
const PORT = process.env.PORT || 5174;
const app = express();
app.use(express.json());
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));

function readDirRecursive(dir, baseUrl, range, callback) {
  let result = { name: path.basename(dir), files: [], folders: [] };
  fs.readdir(dir, function(err, files) {
    if (err) return callback(err);
    let pending = files.length;
    if (!pending) {
      result.files.sort((a, b) => b.modifiedTime - a.modifiedTime);
      return callback(null, result);
    }
    files.forEach(function(file) {
      const filePath = path.resolve(dir, file);
      fs.stat(filePath, function(err, stat) {
        if (stat && stat.isDirectory()) {
          readDirRecursive(filePath, baseUrl, range, function(err, res) {
            result.folders.push(res);
            if (!--pending) {
              result.files.sort((a, b) => b.modifiedTime - a.modifiedTime);
              callback(null, result);
            }
          });
        } else {
          const ext = path.extname(filePath).slice(1).toLowerCase();
          if (range > 0 && result.files.length > range) return
          if (['mp4', 'mov', 'avi', 'flv', 'wmv'].includes(ext)) {
            result.files.push({
              src: `${baseUrl}/${path.relative(path.join(__dirname, 'public'), filePath)}`,
              fileType: "video",
              width: 3,
              height: 2,
              modifiedTime: stat.mtime
            });
          } else if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext)) {
            const dimensions = sizeOf(filePath);
            result.files.push({
              src: `${baseUrl}/${path.relative(path.join(__dirname, 'public'), filePath)}`,
              fileType: "image",
              width: dimensions.width,
              height: dimensions.height,
              modifiedTime: stat.mtime
            });
          } else {
            // Ignore other file types
          }
          if (!--pending) {
            result.files.sort((a, b) => b.modifiedTime - a.modifiedTime);
            callback(null, result);
          }
        }
      });
    });
  });
}

app.post("/images", async (req, res) => {
  const folder = await req.body.folder
  const range = await req.body.range
  const directoryPath = path.join(__dirname, 'public');
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const directory = `${directoryPath}/${folder}`

  readDirRecursive(folder ? directory : directoryPath, baseUrl, range, (err, result) => {
    if (err) {
      res.sendStatus(400)
      return console.log('Unable to scan directory: ' + err);
    }
    res.json(result)
  });
});

app.listen(PORT);
module.exports = app;
