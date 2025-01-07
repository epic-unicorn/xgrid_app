const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const dbConnect = require("./db/dbConnect");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./db/userModel");
const auth = require("./auth");
const xvideos = require("xvideosx");
const xnxx = require('xnxx-scraper');

dbConnect();

function getRandomNumber() {
  return Math.floor(Math.random() * 20) + 1;
}

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

app.get("/xnxx", auth, async (request, response) => {
  const videoUrls = [];
  const filter = request.query.filter || 'new';

  let test = await xnxx.search(filter);

  try {
    await Promise.all(
      test.result.map(async (v) => {
        let info = await xnxx
          .info( v.link)
          .then((video) => {
            
            const videoData = {
              tags: video.result.tags.split(',').map(tag => tag.trim()),
              title: video.result.title,
              duration: video.result.duration
            };

            videoUrls.push({"url": video.result.files.high, "data": videoData});
          });
      })
    );
    
    response.json(videoUrls);
  } catch (error) {
    console.log("Error: " + error);
    response.json("");
  }

});


app.get("/get-videos", auth, async (request, response) => {
  const videoUrls = [];
  const filter = request.query.filter;
  const page = getRandomNumber();

  const freshList = await xvideos.videos.fresh({ page: page });

  try {
    await Promise.all(
      freshList.videos.map(async (v) => {
        let videodetail = await xvideos.videos
          .details({ url: v.url , k: 'lesbian'})
          .then((video) => {

            const videoData = {
              tags: ['apple', 'banana', 'orange'],
              title: video.title,
              duration: video.duration
            };

            videoUrls.push({"url": video.files.high, "data": videoData});
          });
      })
    );    

    console.log("Page Number: " + page);
    console.log("Total videos found: " + videoUrls.length);
    response.json(videoUrls);
  } catch (error) {
    console.log("Error: " + error);
  }
});

module.exports = app;
