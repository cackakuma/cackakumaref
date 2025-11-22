import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// Add new post
app.post("/api/posts", upload.array("pics", 10), (req, res) => {
  const { title, description, typper, category } = req.body;
  const pics = req.files.map(file => ({ link: `/uploads/${file.filename}` }));
  // save post to DB with pics[]
});

// Update post
app.put("/api/posts/:id", upload.array("pics", 10), (req, res) => {
  // similar handling
});