const routers = require("express").Router()
const authController = require("../controllers/auth")
const userActionsController = require("../controllers/userActions")
const userInfoController = require("../controllers/userInfo")
const checkUserId = require("../helper/checkUserId")
const user = require("../models/users")
routers.post("/signup", authController.signup)

routers.post("/login", authController.login)

routers.post("/:currentUserId/follow", userActionsController.followUser)

routers.post("/:currentUserId/unfollow", userActionsController.unfollowUser)

routers.put("/profile/edit/:currentUserId", userActionsController.editProfile)

routers.put("/password/edit/:currentUserId", userInfoController.changePassword)

routers.get("/:userId", userActionsController.profileInfo)

routers.delete("/delete/:currentUserId", userActionsController.deleteProfile)



module.exports = routers