const mongoose = require("mongoose")

const Course = new mongoose.Schema({
	createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	title: { type: String },
	desc: { type: String },
	price: { type: Number },
	media: { content: { type: String }, type: { type: String } },
	content: { type: String },
	medias: [{ type: mongoose.Schema.Types.ObjectId, ref: "Media" }],
	purchasedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
	popular: { type: Boolean },
	status: { type: String, enum: ["public", "private"], default: "private" }
}, { timestamps: true });

module.exports = mongoose.model("Course", Course)