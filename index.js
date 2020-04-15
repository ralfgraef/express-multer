const express = require("express");
const multer = require("multer");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");

// create express app
const app = express();

// disk storage
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./upload");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// configure multer
var upload = multer({
  storage: storage,
});

// enable CORS
app.use(cors());

// add other middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

// start the app
const port = process.env.PORT || 3000;

app.post("/upload-avatar", upload.single("avatar"), async (req, res) => {
  try {
    const avatar = req.file;

    // make sure file is available
    if (!avatar) {
      res.status(400).send({
        status: false,
        data: "No file is selected.",
      });
    } else {
      // send response
      res.send({
        status: true,
        message: "File is uploaded.",
        data: {
          name: avatar.originalname,
          mimetype: avatar.mimetype,
          size: avatar.size,
        },
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(port, () => console.log(`App is listening on port ${port}.`));
