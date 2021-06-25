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

routers.get("/timeline/:userId", (req, res) => {
	const token = req.cookies.jwt
	const {userId} = req.params
	validToken = validateJwt(token)

	if(validToken){
		var fields = {__v: false, _id: false, author: false, likes:false}
		post.find({author: req.params.userId}, fields).then((Posts) => {
			const {} = Posts
			return res.json({'posts': Posts})
		}).catch((err) => {
			return res.status(500).json({'status':'Houve um erro'})
		})
	}else{
		return res.status(401).json({'status': 'Você precisa estar logado '})
	}


})

module.exports = routers