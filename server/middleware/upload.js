const express = require('express');
const router = express.Router();
const upload = require('./path/to/your/multerConfig'); // Adjust to your Multer config path
const fsExtra = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');

const uploadDir = path.join(__dirname, '../uploads');
const gitClientImageDir = path.join(__dirname, '../../client/public/images');

// Function to copy images and push to GitHub
async function pushUploadedImagesToGitHub() {
  try {
    // Copy uploaded files to client images folder tracked by Git
    await fsExtra.copy(uploadDir, gitClientImageDir, { overwrite: false });

    // Check for changes before committing
    exec(`git diff --quiet`, (diffErr) => {
      if (diffErr) {
        exec(`git add ${gitClientImageDir}`, (addErr) => {
          if (addErr) throw addErr;

          exec(`git commit -m "Add uploaded images"`, (commitErr) => {
            // Handle case with no changes to commit
            if (commitErr && commitErr.message.includes('nothing to commit')) {
              console.log('No new images to commit');
              return;
            } else if (commitErr) throw commitErr;

            exec(`git push origin main`, (pushErr) => {
              if (pushErr) throw pushErr;
              console.log('Images pushed to GitHub successfully');
            });
          });
        });
      } else {
        console.log('No changes detected, skipping commit.');
      }
    });
  } catch (error) {
    console.error('GitHub push automation error:', error);
  }
}

// Route for uploading multiple images using your Multer config
router.post('/upload-images', upload.uploadMultiple, async (req, res) => {
  try {
    // Multer has saved files locally at this point

    // Automate pushing files to GitHub repo
    await pushUploadedImagesToGitHub();

    res.status(200).json({ message: 'Images uploaded and pushed to GitHub.' });
  } catch (error) {
    console.error('Error during upload or GitHub push:', error);
    res.status(500).json({ error: 'Upload or GitHub push failed' });
  }
});

module.exports = router;

