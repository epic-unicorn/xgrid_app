const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const dbConnect = require("./db/dbConnect");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./db/userModel");
const auth = require("./auth");
const xvideos = require('xvideosx');


dbConnect();

// Curb Cores Error by adding a header here
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (request, response, next) => {
  response.json({ message: "Hey! This is your server response!" });
  next();
});

app.post("/register", (request, response) => {
  bcrypt
    .hash(request.body.password, 10)
    .then((hashedPassword) => {
      const user = new User({
        email: request.body.email,
        password: hashedPassword,
      });

      user
        .save()
        .then((result) => {
          response.status(201).send({
            message: "User Created Successfully",
            result,
          });
        })
        .catch((error) => {
          response.status(500).send({
            message: "Error creating user",
            error,
          });
        });
    })
    .catch((e) => {
      response.status(500).send({
        message: "Password was not hashed successfully",
        e,
      });
    });
});

app.post("/login", (request, response) => {
  User.findOne({ email: request.body.email })
    .then((user) => {
      bcrypt
        .compare(request.body.password, user.password)

        .then((passwordCheck) => {
          if (!passwordCheck) {
            return response.status(400).send({
              message: "Passwords does not match",
              error,
            });
          }

          const token = jwt.sign(
            {
              userId: user._id,
              userEmail: user.email,
            },
            "RANDOM-TOKEN",
            { expiresIn: "24h" }
          );

          response.status(200).send({
            message: "Login Successful",
            email: user.email,
            token,
          }); 
        })
        .catch((error) => {
          response.status(400).send({
            message: "Passwords does not match",
            error,
          });
        });
    })
    .catch((e) => {
      response.status(404).send({
        message: "Email not found",
        e,
      });
    });
});

app.get("/home-endpoint", (request, response) => {
  response.json({ message: "Home!" });
});

app.get("/get-video-url", auth, async (request, response) => {

  const videoUrls = [];
  const page = request.query.page;
  const videopath = request.query.path;

  const fresh = await xvideos.videos.fresh({ page: page });
  for await (const v of fresh.videos) {
    if(v.path == videopath) {
      let videodetail = await xvideos.videos.details({url: v.url}).then(video => {
          videoUrls.push(video.files.high);
      });
    }
  };

  response.json(videoUrls);
});

app.get("/get-videos", auth, async (request, response) => {

  const videoUrls = [];
  const filter = request.query.filter;

  for (let i = 1; i < 10; i++) {
    const freshList = await xvideos.videos.fresh({ page: i });
    for await (const v of freshList.videos) {
      try{

        videoUrls.push({page: i, path: v.path});
      }
      catch (err){
        console.log(err);
      }
    }
  }

  console.log('Total videos found: ' + videoUrls.length)
  response.json(videoUrls);
  
});


module.exports = app;
