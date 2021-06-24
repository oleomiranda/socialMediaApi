const routers = require("express").Router()
const authController = require("../controllers/auth")
const userController = require("../controllers/user")
const userInfoController = require("../controllers/userInfo")

routers.post("/signup", authController.signup)

routers.post("/login", authController.login)

routers.post("/:currentUserId/follow", userController.followUser)

routers.post("/:currentUserId/unfollow", userController.unfollowUser)

routers.put("/profile/edit/:currentUserId", userController.editProfile)

routers.put("/password/edit/:currentUserId", userInfoController.changePassword)



module.exports = routers