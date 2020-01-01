const http = require("http");
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const multer = require("multer");

const express = require('express');
const app = express();
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 3000;

httpServer.listen(3000, () => {
  console.log(`Server is listening on port ${PORT}`);
});

const handleError = (err, res) => {
  res
    .status(500)
    .contentType("text/plain")
    .end("Oops! Something went wrong!");
};

const upload = multer({
  location: "/pic/"
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", express.static(path.join(__dirname, "./views")));

app.post('/upload', upload.single("image"), (req,res) => {
    const tempPath = req.file.path;
    const targetPath = path.join(__dirname, "./pic/image.png");

    if (path.extname(req.file.originalname).toLowerCase() === ".png") {
      fs.rename(tempPath, targetPath, err => {
        if (err) return handleError(err, res);

        res
          .status(200)
          .contentType("text/plain")
          .end("File uploaded!");
      });
    } else {
      fs.unlink(tempPath, err => {
        if (err) return handleError(err, res);

        res
          .status(403)
          .contentType("text/plain")
          .end("Only .png files are allowed!");
      });
    }
});

app.get('/image.png', (req,res) => {
	res.sendFile(path.join(__dirname, "./uploads/image.png"));
});
