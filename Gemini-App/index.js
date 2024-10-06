require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const { HarmBlockThreshold, HarmCategory } = require("@google/generative-ai");
const express = require("express");


const apikey = process.env.GEMINI_API;
const genAl = new GoogleGenerativeAI(apikey);
const app = express();
app.use(express.json())

 
const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
  ];

  const model = genAl.getGenerativeModel({ model: "gemini-1.5-flash"});
 

app.post("/generate", async(req,res)=>{
  const {userRequest} = req.body;
  try {
    const prompt = `write an email about ${userRequest}`
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  res.status(200).send(text);
  } catch (error) {
    res.status(500).json({error: error.message, message: "An error occured while generating content"})
  }
})

// run();

app.listen(3000, ()=>{
  console.log("Server is running on port 3000")
})