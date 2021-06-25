const routers = require("express").Router()
const authController = require("../controllers/auth")
const userActionsController = require("../controllers/userActions")
const userInfoController = require("../controllers/userInfo")
const validateJwt = require("../helper/validateJwt")
const user = require("../models/users")
const post = require("../models/posts")
routers.post("/signup", authController.signup)

routers.post("/login", authController.login)

routers.post("/:currentUserId/follow", userActionsController.followUser)

routers.post("/:currentUserId/unfollow", userActionsController.unfollowUser)

routers.put("/profile/edit/:currentUserId", userActionsController.editProfile)

routers.put("/password/edit/:currentUserId", userInfoController.changePassword)

routers.get("/:userId", userActionsController.profileInfo)

routers.delete("/delete/:currentUserId", userActionsController.deleteProfile)

routers.get("/timeline/:userId", userActionsController.timeline)

routers.get("/search/:username", userActionsController.searchUser)
module.exports = routers