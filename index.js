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


server.listen(5000, () => {
	console.log('Server started on port 5000');
});
