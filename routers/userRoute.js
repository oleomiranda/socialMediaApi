const routers = require("express").Router()
const user = require("../models/users")
const bcrypt = require("bcryptjs")
const createJwt = require("../helper/createJwt")
const checkUserId = require("../helper/checkUserId")
const authController = require("../controllers/auth")
const userController = require("../controllers/user")

routers.post("/signup", authController.signup)

routers.post("/login", authController.login)

routers.post("/:currentUserId/follow", userController.followUser)

routers.post("/:currentUserId/unfollow", userController.unfollowUser)

routers.put("/profile/edit/:currentUserId", userController.editProfile)

routers.put("/password/edit/:currentUserId", (req, res) => {
	const {currentUserId} = req.params
	const {oldPassword, newPassword, confNewPassword} = req.body
	const token = req.cookies.jwt 



	if(token){
		isSameId = checkUserId(currentUserId, token)

		if(isSameId){
			if(newPassword !== confNewPassword){return res.status(400).json({'status': 'A nova senha e a confirmação não são iguais'})}
			
			try {
				user.findById(req.params.currentUserId, (err, User) => {
					bcrypt.compare(oldPassword, User.password, async (err, success) => {
						if(success){
							hashedPass = await bcrypt.hash(newPassword, 10)
							User.password = hashedPass
							User.save()
							return res.status(200).json({'status':'Sua senha foi alterada'})
						}else{
							return res.status(400).json({'status': 'Senha atual incorreta'})
						}
					})
				})


			} catch (error) {
				return res.status(500).json({'status':'Houve um erro ao tentar completar esta ação'})
			}

		}else{
			return res.status(401).json({'status':'Houve um erro ao tentar completar esta ação'})
		}
	}else{
		return res.status(400).json({'status':'Você precisa estar logado'})
	}

})



module.exports = routers