require("dotenv").config()
const Message = require("../models/message")
const Conversation = require("../models/conversation");
const { getReceiverUserIdSocket, io } = require("../config");
const uuid = require("uuid").v4;

exports.sendMessage = async (req, res) => {
	console.log(req.body, req.file)
	try {
		const { senderId, receiverId } = req.params
		const { msg } = req.body

		let message
		let savedMessage

		if (req.file) {
			const currentDate = new Date(Date.now());
			const hours = currentDate.getHours();
			const minutes = currentDate.getMinutes();
			const objectName = `${req.file.originalname}`
			message = new Message({
				senderId, receiverId, content: { type: req.file.mimetype, content: objectName }
			})
			savedMessage = await message.save()
		} else {
			message = new Message({
				senderId, receiverId, message: msg
			})
			savedMessage = await message.save()
		}
		let conversation
		let savedConversation

		conversation = await Conversation.findOne({
			participants: { $all: [senderId, receiverId] }
		});
		if (!conversation) {
			conversation = new Conversation({
				participants: [
					senderId, receiverId
				],
				message: [savedMessage._id]
			})
			savedConversation = await conversation.save()
		} else {
			conversation.message.push(savedMessage._id)
			savedConversation = await conversation.save()
		}

		const receiverSocket = getReceiverUserIdSocket(receiverId)
		const senderSocket = getReceiverUserIdSocket(senderId)

		if (receiverSocket) {
			io.to(receiverSocket).emit('chat-message', savedMessage);
		}

		if (senderSocket) {
			io.to(senderSocket).emit('chat-message', savedMessage);
		}
		res.status(200).json({ success: true, message: "Message Sent!" })
	} catch (error) {
		console.log(error)
		res.status(400).json({ success: false, message: "Something Went Wrong!" })
	}
}

exports.getMessage = async (req, res) => {
	try {
		const { senderId, receiverId } = req.params
		if (!senderId || !receiverId) {
			return res.status(400).json({ success: false, message: "SenderId ReceiverId not found!" })
		}
		const conversation = await Conversation.findOne({
			participants: { $all: [senderId, receiverId] }

		}).populate("message");

		if (!conversation || !conversation.message || conversation.message.length === 0) {
			return res.status(200).json({ success: true, data: [] });
		}

		res.status(200).json({ success: true, data: conversation.message });
	}
	catch (e) {
		console.log(e)
		res.status(400).json({ success: false, message: "Something Went Wrong!" })
	}
}

exports.deleteMessage = async (req, res) => {
	try {
		const { userId, messageId } = req.params
		const message = await Message.findById(messageId)
		if (!message) {
			return res.status(400).json({ success: false, message: "Message not found!" })
		}
		if (message.senderId.toString() === userId) {
			await Message.findByIdAndDelete(message._id)
			return res.status(200).json({ success: true, message: "Message Deleted!" })
		} else {
			return res.status(400).json({ success: false, message: "You are not allowed to delete Message" })
		}
	} catch (error) {
		console.log(error)
		res.status(400).json({ success: false, message: "Something Went Wrong!" })
	}
}

