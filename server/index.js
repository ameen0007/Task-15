const express = require("express");
const app = express();
const cors = require("cors");
const multer = require("multer");

app.use(cors(
  
  {
  origin : ["https://gallery-nine-kohl.vercel.app"],
      methods : ["GET","POST"],
      credentials : true
}


));
app.use(express.json());


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
const uploading = multer({ storage: storage });

app.post("/upload", uploading.single("image_file"), (req, res) => {
  images.push(req.file.filename);
  console.log(images, "image array");
  res.send("this is upload page")
});

app.get("/images/api", (req, res) => {
  res.json(images);
  res.json({message : "hello"})
});



const PORT = 3000;
app.listen(PORT, console.log(`server started in port ${PORT}`));
