const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads dir if missing
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) cb(null, true);
  else cb(new Error('Only image files are allowed!'));
};

// Multer instance
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter
});

// Export existing multer configurations
module.exports = {
  uploadMultiple: upload.array('pics', 10),
  uploadLogo: upload.array('logo', 1),
  uploadMixed: upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'pics', maxCount: 10 }
  ])
};
