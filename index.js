const express = require('express');
const cors = require("cors")
const mongoose = require("mongoose")
const morgan = require("morgan")
const userRoutes = require("./routes/user")
const chatRoutes = require("./routes/chat");
const { app, server } = require('./config');
require("dotenv").config()


app.use(cors())
app.use(morgan("dev"))
app.use(express.json())
app.use(express.static("uploads"))
app.use("/api", userRoutes)
app.use("/api/chats", chatRoutes)

const LANGUAGE_MODEL_API_KEY = process.env.LANGUAGE_MODEL_API_KEY;
const LANGUAGE_MODEL_URL = `https://generativelanguage.googleapis.com/v1beta1/models/chat-bison-001:generateMessage?key=${LANGUAGE_MODEL_API_KEY}`;

app.get("/prompt/:text", async (req, res) => {
	try {
		const text = req.params.text;

		const payload = {
			prompt: { messages: [{ content: text }] },
			temperature: 0.1,
			candidate_count: 1,
		};
		const response = await fetch(LANGUAGE_MODEL_URL, {
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
			method: "POST",
		});
		const data = await response.json();
		console.log(data);
		res.send(data);
	} catch (error) {
		console.log(error)
	}
});

const connectDB = async () => {
	try {
		mongoose
			.connect(
				"mongodb+srv://fsayush100:shreyansh7@cluster0.mrnejwh.mongodb.net/chat?retryWrites=true&w=majority"
			)
			.then(() => {
				console.log("DB is connected");
			});
	} catch (err) {
		console.log(err);
	}
};

connectDB();


server.listen(8000, () => {
	console.log('Server started on port 5000');
});
