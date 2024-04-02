const mongoose = require("mongoose")

const Media = new mongoose.Schema({
	title: { type: String },
	desc: { type: String },
	media: { content: { type: String }, type: { type: String } },
	ytlink: { type: String },
	isExternalLink: { type: Boolean },
	course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
}, { timestamps: true });

module.exports = mongoose.model("Media", Media)