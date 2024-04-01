const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	fullname: { type: String },
	username: { type: String },
	phone: { type: String },
	password: { type: String },
	email: { type: String },
	dp: { type: String },
	role: { type: String, enum: ["student", "teacher"], default: "student" },
	savedMessages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
	courseCreated: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
	courseJoined: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }]
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema)