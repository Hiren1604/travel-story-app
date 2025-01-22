require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose");
const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities");
const upload = require("./multer");
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
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and Password required!" });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid Credentials" })
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
});

//Get User
app.get("/get-user", authenticateToken, async (req, res) => {
    const { userId } = req.user;

    const isUser = await User.findOne({ _id: userId });

    if (!isUser) {
        return res.sendStatus(401);
    }

    return res.json({
        user: isUser,
        message: ""
    });
});

//Add Travel Story
app.post("/add-travel-story", authenticateToken, async (req, res) => {
    const { title, story, visitedLocation, visitedDate, imageUrl } = req.body;

    if (!title || !story || !visitedLocation || !visitedDate || !imageUrl) {
        return res.status(400).json({ message: "All Fields are required" });
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
        res.status(200).json({ story: travelStory, message: "Story added Succesfully" });
    } catch (err) {
        res.status(400).json({ error: true, message: err.message });
    }

});

//Get all travel stories 
app.get("/get-all-travel-stories", authenticateToken, async (req, res) => {
    const { userId } = req.user;

    try {
        const travelStories = await TravelStory.find({ userId: userId }).sort({ isFavorite: -1 });
        res.status(200).json({ stories: travelStories });
    } catch (err) {
        res.status(500).json({ error: true, message: err.message });
    }
});

//Post an Image
app.post("/image-upload", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res
                .status(400)
                .json({ error: true, message: error.message });
        }
        const imageUrl = `http://localhost:8000/uploads/${req.file.filename}`;
        res.status(200).json({ imageUrl });
    } catch (err) {
        res.status(400).json({ error: true, message: err.message });
    }
});

//Serve static files and upload assets in the directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

//Delete an image from the uploads folder
app.delete("/delete-image", async (req, res) => {
    const { imageUrl } = req.query;

    if (!imageUrl) {
        return res.status(400).json({ error: true, message: "imageUrl is required" });
    }

    try {
        // Define filename and path
        const filename = path.basename(imageUrl);
        const filepath = path.join(__dirname, "uploads", filename);

        // Check if the file exists
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
            return res.status(200).json({ message: "Image deleted successfully" });
        } else {
            return res.status(404).json({ error: true, message: "File not found" });
        }
    } catch (err) {
        return res.status(500).json({ error: true, message: err.message });
    }
});

//Edit Travel Story
app.put("/edit-story/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { title, story, visitedLocation, visitedDate, imageUrl } = req.body;
    const { userId } = req.user;

    if (!title || !story || !visitedLocation || !visitedDate) {
        return res.status(400).json({ message: "All Fields are required" });
    }

    const parsedVisitedDate = new Date(parseInt(visitedDate));

    try {
        const travelStory = await TravelStory.findOne({ _id: id, userId: userId });
        if (!travelStory) {
            return res.status(404).json({ error: true, message: "Travel Story not found" });
        }
        const placeholderUrl = `http://localhost:8000/assets/placeholder.png`;
        travelStory.title = title;
        travelStory.story = story;
        travelStory.visitedLocation = visitedLocation;
        travelStory.imageUrl = imageUrl || placeholderUrl;
        travelStory.visitedDate = visitedDate;

        await travelStory.save();

        res.status(200).json({ story: travelStory, message: "Update Sucessful" });
    }
    catch (err) {
        return res.status(400).json({ error: true, message: err.message });
    }
});

//Delete Travel Story
app.delete("/delete-story/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { userId } = req.user;
    try {
        const travelStory = await TravelStory.findOne({ _id: id, userId: userId });
        if (!travelStory) {
            return res.status(404).json({ error: true, message: "Travel Story not found" });
        }

        await travelStory.deleteOne({_id: id, userId: userId});

        //extract the filename from the url
        const imageUrl = travelStory.imageUrl;
        const filename = path.basename(imageUrl);

        //define file path
        const filepath = path.join(__dirname, "uploads", filename);

        fs.unlink(filepath, (err)=> {
            if(err) {
                console.error("Failed to delete image file: ", err);
            }

        })
    } catch(err) {
        return res.status(400).json({ error: true, message: err.message });
    }
    res.status(200).json({message: "Story Deleted Succesfully"})
});

//Update isFavorite
app.put("/update-fav/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { userId } = req.user;
    const { isFavorite } = req.body;
  
    try {
      const travelStory = await TravelStory.findOne({ _id: id, userId: userId });
      if (!travelStory) {
        return res.status(404).json({ error: true, message: "Travel Story not found" });
      }
  
      travelStory.isFavourite = isFavorite;
      await travelStory.save();
  
      res.status(200).json({ story: travelStory, message: "Update Successful" });
    } catch (err) {
      console.error("Error updating favorite status:", err.message);
      return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  });
  

//Search Travel Stories
app.get("/search", authenticateToken, async(req,res)=> {
    const {query} = req.query;
    const {userId} = req.user;

    if(!query) {
        return res.status(404).json({error: true, message: "query is required"});
    }

    try {
        const searchResults = await TravelStory.find({
            userId: userId,
            $or: [
                {title: { $regex: query, $options: "i"}},
                {story: { $regex: query, $options: "i"}},
                {visitedLocation: {$regex: query, $options: "i"}},
            ],
        }).sort({isFavorite: -1});
        return res.status(200).json({stories: searchResults})
    }
    catch (err) {
        res.status(404).json({error: true, message: err.message})
    }
});

//Filter Stories by Date Range 
app.get("/filter", authenticateToken, async (req, res)=> {
    const {startDate, endDate} = req.query;
    const {userId} = req.user;

    try {
       const start = new Date(parseInt(startDate));
       const end = new Date(parseInt(endDate));

       //Finding stories withtin start and end
       const filteredStories = await TravelStory.find({
        userId: userId,
        visitedDate: {$gte: start, $lte: end},
       }).sort({isFavorite: -1});
       res.status(200).json({stories: filteredStories});
    }
    catch (err) {
        res.status(404).json({error: true, message: err.message})
    }
});


app.listen(8000, () => {
    console.log("Server is running on port 8000");
});

module.exports = app;
