const User = require("../models/user")
const Course = require("../models/course")
require("dotenv").config()
const jwt = require("jsonwebtoken");
const Media = require("../models/media");
const uuid = require("uuid").v4;

function generateAccessToken(data) {
	const access_token = jwt.sign(data, process.env.MY_SECRET_KEY, {
		expiresIn: "5d",
	});
	return access_token;
}

function generateRefreshToken(data) {

	const refresh_token = jwt.sign(data, process.env.MY_SECRET_KEY, {
		expiresIn: "10d",
	});
	return refresh_token;
}

exports.createuser = async (req, res) => {
	try {
		const { fullname, password, email, dp, role } = req.body

		const userExists = await User.findOne({ email });
		if (userExists) {
			return res.status(400).json({ success: false, message: "User with this email already exists." });
		}
		const user = new User({
			fullname, password, email, dp, role
		})
		const saved = await user.save()
		const data = { id: saved._id, fullname: saved.fullname, dp: saved.dp, role: user.role }
		const access_token = generateAccessToken(data)
		const refresh_token = generateRefreshToken(data)

		res.status(201).json({
			access_token, refresh_token, success: true, message: "User Created!"
		});
	} catch (error) {
		console.log(error)
		res.status(400).json({ success: false, message: "Something Went Wrong!" })
	}
}

exports.loguser = async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email, password })
		if (!user) {
			return res
				.status(203)
				.json({ message: "User not found", success: false, userexists: false });
		} else {
			const data = {
				fullname: user.fullname,
				dp: user.dp,
				id: user._id.toString(),
				role: user.role
			};
			const access_token = generateAccessToken(data);
			const refresh_token = generateRefreshToken(data);
			res.status(200).json({
				message: "Account exists",
				access_token,
				refresh_token,
				success: true,
				userexists: true,
			});
		}
	} catch (e) {
		console.log(e);
		res.status(400).json({
			message: "Something went wrong...",
			success: false,
		});
	}
}

exports.getUsers = async (req, res) => {
	try {
		const { id } = req.params
		const users = await User.find({ _id: { $ne: id } }).select("-password");
		// console.log(users)
		res.status(200).json({ success: true, users })
	} catch (error) {
		console.log(error)
		res.status(400).json({
			message: "Something went wrong...",
			success: false,
		});
	}
}

exports.createCourse = async (req, res) => {
	try {
		const { createdBy, title, desc, price, content } = req.body
		const image = req.file

		const currentDate = new Date(Date.now());
		const hours = currentDate.getHours();
		const minutes = currentDate.getMinutes();
		const objectName = `${image.originalname}`

		const course = new Course({
			createdBy, title, desc, price, content, media: { content: objectName, type: image.mimetype }
		})

		const savedCourse = await course.save()

		const user = await User.findById(createdBy)
		if (user.courseCreated && user.courseCreated.length > 0) {
			user.courseCreated.push(savedCourse._id)
		} else {
			user.courseCreated = [savedCourse._id]
		}
		await user.save()

		res.status(200).json({ success: true, message: "Course created!", id: savedCourse._id })

	} catch (error) {
		res.status(400).json({ success: false, message: "Something went wrong..." })
		console.log(error)
	}
}

exports.addcontenttoCourse = async (req, res) => {
	try {
		const { id } = req.params
		const { title, desc } = req.body
		const course = await Course.findById(id)
		const image = req.file
		const currentDate = new Date(Date.now());
		const hours = currentDate.getHours();
		const minutes = currentDate.getMinutes();
		const objectName = `${image.originalname}`
		if (!course) {
			return res.status(400).json({ success: false, message: "Course Not Found!" })
		}
		const media = new Media({
			title, desc, course: id,
			media: { type: image.mimetype, content: objectName }
		})
		const savedmedia = await media.save()

		if (course.medias && course.medias.length > 0) {
			course.medias.push(savedmedia._id)
		} else {
			course.medias = [savedmedia._id]
		}
		await course.save()
		res.status(200).json({ success: true, message: "Content Add!" })
	} catch (error) {
		res.status(400).json({ success: false, message: "Something went wrong..." })
		console.log(error)
	}
}

exports.deleteContentFromCourse = async (req, res) => {
	try {
		const { cid, mid } = req.params;
		await Media.findByIdAndDelete(mid);
		await Course.updateOne({ _id: cid }, { $pull: { medias: mid } });
		res.status(200).json({ success: true, message: "Media deleted successfully from course." });
	} catch (error) {
		res.status(400).json({ success: false, message: "Something went wrong..." });
		console.log(error);
	}
};

exports.fetchCourses = async (req, res) => {
	try {
		const courses = await Course.find()
		if (!courses) {
			return res.status(200).json({ success: true, courses: [] })
		}
		res.status(200).json({ success: true, courses })
	} catch (error) {
		res.status(400).json({ success: false, message: "Something went wrong..." });
		console.log(error)
	}
}

exports.fetchCoursesbyUser = async (req, res) => {
	try {
		const { id } = req.params
		const courses = await Course.find({ createdBy: id })
		if (!courses) {
			return res.status(200).json({ success: true, courses: [] })
		}
		res.status(200).json({ success: true, courses })
	} catch (error) {
		res.status(400).json({ success: false, message: "Something went wrong..." });
		console.log(error)
	}
}