const multer = require("multer");
const uuid = require("uuid").v4;

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "uploads");
	},
	filename: function (req, file, cb) {
		const currentDate = new Date(Date.now());
		const hours = currentDate.getHours();
		const minutes = currentDate.getMinutes();


		const uniqueFilename = `${file.originalname}`
		cb(null, uniqueFilename);
	},
});

const upload = multer({ storage: storage });


module.exports = { upload }