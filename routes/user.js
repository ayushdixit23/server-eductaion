const express = require("express")
const { createuser, loguser, getUsers, createCourse, addcontenttoCourse, deleteContentFromCourse, fetchCourses, fetchCoursesbyUser, fetchCoursesbyId, fetchVideos, deleteCourse } = require("../controllers/user")
const { upload } = require("../middleware/multer")

const router = express.Router()

router.post("/createuser", upload.single("image"), createuser)
router.post("/login", loguser)
router.get("/v1/getUsers/:id", getUsers)
router.post("/createCourse", upload.single("image"), createCourse)
router.post("/addcontenttoCourse/:id", upload.single("image"), addcontenttoCourse)
router.delete("/deleteContentFromCourse/:cid/:mid", deleteContentFromCourse)
router.get("/v1/allcourses", fetchCourses)
router.get("/getcourses/:id", fetchCoursesbyUser)
router.get("/fetchCoursesbyId/:id", fetchCoursesbyId)
router.get("/fetchVideos/:id", fetchVideos)
router.delete("/deleteCourse/:id", deleteCourse)

module.exports = router