const express = require("express")
const { upload } = require("../middleware/multer")
const { sendMessage, getMessage, deleteMessage } = require("../controllers/chat")

const router = express.Router()

router.post("/sendmessage/:senderId/:receiverId", upload.single("image"), sendMessage)
router.get("/getmessage/:senderId/:receiverId", getMessage)
router.delete("/deleteMessage/:userId/:messageId", deleteMessage)

module.exports = router