const express = require("express")
const dotenv = require('dotenv')
const { google } = require("googleapis")
const PORT = process.env.PORT || 5174;
const app = express();
app.use(express.json());
dotenv.config()

const auth = new google.auth.JWT(
  process.env.GOOGLE_CLIENT_EMAIL,
  null,
  process.env.PRIVATE_KEY,
  ['https://www.googleapis.com/auth/drive']
)

async function getWebContentLink(folderId) {
  const drive = google.drive({
    version: "v3",
    auth
  })
  const query = `'${folderId}' in parents`
  const res = await drive.files.list({ q: query, fields: 'files(webContentLink)' })
  const files = res.data.files;
  if (files.length) {
    console.log(files)
  }
}

app.get("/images", async (req, res) => {
  await getWebContentLink('1niuqlNhCYpvSjuIAopDBSm9sc_qkGTap')
  res.json({ "hello": "tae" })
  console.log("hello tae")
})
app.listen(PORT);
module.exports = app;
