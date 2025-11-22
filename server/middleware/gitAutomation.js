const { exec } = require('child_process');
const path = require('path');
const fsExtra = require('fs-extra');

const uploadDir = path.join(__dirname, '../uploads');
const gitClientImageDir = path.join(__dirname, '../../client/public/images');

async function pushUploadedImagesToGitHub() {
  try {
    await fsExtra.copy(uploadDir, gitClientImageDir, { overwrite: false });

    exec(`git add ${gitClientImageDir}`, (addErr) => {
      if (addErr) throw addErr;

      exec(`git commit -m "Add uploaded images"`, (commitErr) => {
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
  } catch (err) {
    console.error('Git automation error:', err);
  }
}

module.exports = { pushUploadedImagesToGitHub };
