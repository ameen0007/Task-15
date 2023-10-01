const express = require("express");
const app = express();
const cors = require("cors");
const multer = require("multer");

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const images = [];

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = file.originalname.split(".").pop();
    cb(null, file.fieldname + "-" + uniqueSuffix + "." + extension);
  },
});
const upload = multer({ storage: storage });

app.post("/upload", upload.single("image_file"), (req, res) => {
  images.push(req.file.filename);

  console.log(images, "image array");
  res.json({ massage: "image uploaded" });
});

app.get("/images/api", (req, res) => {
  res.json(images);
});

const PORT = 3000;
app.listen(PORT, console.log(`server started in port ${PORT}`));
