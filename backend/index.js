require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose");
const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const {authenticateToken} = require("./utilities");
const multer = require("multer");
const upload = require("multer");
const fs = require("fs");
const path = require("path");


const User = require("./models/user.models"); 
const TravelStory = require("./models/travelStory.models"); 

mongoose.connect(config.connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));

// Create Account
app.post("/create-account", async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        return res.status(400).json({ error: true, message: "All fields are required" });
    }

    const isUser = await User.findOne({ email });
    if (isUser) {
        return res.status(400).json({ error: true, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ fullName, email, password: hashedPassword });

    await newUser.save();

    const accessToken = jwt.sign(
        { userId: newUser._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "72h" }
    );

    return res.status(201).json({
        error: false,
        user: { fullName: newUser.fullName, email: newUser.email },
        accessToken,
        message: "Registration Successful"
    });
});

//Login
app.post("/login", async (req, res)=> {
    const {email, password} = req.body;

    if(!email || !password) {
        return res.status(400).json({message: "Email and Password required!"});
    }

    const user = await User.findOne({email});
    if(!user) {
        return res.status(400).json({message: "User not found"});
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid) {
        return res.status(400).json({message: "Invalid Credentials"})
    }

    const accessToken = jwt.sign(
        { userId: user._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "72h" }
    );

    return res.status(201).json({
        error: false,
        user: { fullName: user.fullName, email: user.email },
        accessToken,
        message: "Login Successful"
    });
})

//Get User
app.get("/get-user", authenticateToken, async (req, res)=> {
    const {userId} = req.user;

    const isUser = await User.findOne({_id: userId });

    if(!isUser) {
        return res.sendStatus(401);
    }

    return res.json({
        user: isUser,
        message: ""
    });
})

//Add Travel Story
app.post("/add-travel-story", authenticateToken, async (req, res)=> {
    const {title, story, visitedLocation, visitedDate, imageUrl} = req.body;

    if(!title || !story || !visitedLocation || !visitedDate || !imageUrl) {
        return res.status(400).json({message: "All Fields are required"});
    }

    const parsedVisitedDate = new Date(parseInt(visitedDate));

    try {
        const travelStory = new TravelStory({
            title,
            story,
            visitedLocation,
            visitedDate: parsedVisitedDate,
            imageUrl,
            userId: req.user.userId,
        });
        await travelStory.save();
        res.status(200).json({story: travelStory, message: "Story added Succesfully"} );
    }catch (err) {
        res.status(400).json({error: true, message: err.message});
    }
    
})

//Get all travel stories 
app.get("/get-all-travel-stories", authenticateToken, async (req, res)=> {
    const {userId} = req.user;

    try {
        const travelStories = await TravelStory.find({userId: userId}).sort({isFavorite: -1}); 
        res.status(200).json({stories: travelStories});
    }catch (err) {
        res.status(500).json({error: true, message: err.message});
    }
})

app.post("/image-upload", upload.single("image"), async (req, res)=> {
   try {
    if(!req.file) {
        return res
        .status(400)
        .json({error: true, message: error.message});
    }
    const imageUrl = `http://localhost:8000/uploads/${req.file.filename}`;
    res.status(200).json({imageUrl});
   }catch(err) {
    res.status(400).json({error: true, message: err.message});
   }
})



app.listen(8000, () => {
    console.log("Server is running on port 8000");
});

module.exports = app;
