const validateJwt = require("../helper/validateJwt")
const user = require("../models/users")
const post = require("../models/posts")
const bcrypt = require("bcryptjs")
module.exports = {

	followUser: async (req, res) => {
		const { currentUserId } = req.params
		const { targetId } = req.body
		const token = req.cookies.jwt

		if (currentUserId == targetId) {
			return res.status(401).json({ 'status': 'targetId e currentUserId devem ser diferentes' })
		}

		if (token) {

			const isSameId = validateJwt(token, currentUserId)
			if (isSameId) {

				//CRIAR REQUEST DO BANCO DE DADOS 
				try {
					targetUser = await user.findById(req.body.targetId)
					currentUser = await user.findById(req.params.currentUserId)
					if (currentUser.following.includes(targetUser._id)) {
						return res.status(400).json({ 'status': 'Você já segue este usuario' })
					}
				} catch (err) {
					return res.status(500).json({ 'status': 'Houve um erro' })
				}

				try {
					await user.bulkWrite([{ updateOne: { filter: { _id: currentUserId }, update: { $push: { following: targetId } } } }])//add target no array "following" do usuario
					await user.bulkWrite([{ updateOne: { filter: { _id: targetId }, update: { $push: { followers: currentUserId } } } }])//add id do usuario no array "followers" do targetId

					return res.status(200).json({ 'status': 'Você seguiu este usuario' })
				} catch (err) {
					return res.status(500).json({ 'status': 'Houve um erro ao tentar completar esta ação' })
				}

			} else {
				return res.status(401).json({ 'status': 'Houve um erro ao tentar completar esta ação' })
			}
		} else {

			res.status(401).json({ 'status': 'Você precisa estar logado' })
		}

	},

	unfollowUser: async (req, res) => {
		const { currentUserId } = req.params
		const { targetId } = req.body
		const token = req.cookies.jwt

		if (currentUserId == targetId) {
			return res.status(401).json({ 'status': 'TargetId e currentUserId devem ser diferentes' })
		}


		if (token) {
			const isSameId = validateJwt(token, currentUserId)
			if (isSameId) {
				try {
					targetUser = await user.findById(req.body.targetId)
					currentUser = await user.findById(req.params.currentUserId)

					if (!currentUser.following.includes(targetUser._id)) {
						return res.status(401).json({ 'status': 'Você não segue este usuario' })
					}
				} catch (err) {
					return res.status(500).json({ 'status': 'Houve um erro ao tentar completar esta ação' })
				}

				try {

					await user.bulkWrite([{ updateOne: { filter: { _id: currentUserId }, update: { $pull: { following: targetId } } } }])//remove target no array "following" do usuario
					await user.bulkWrite([{ updateOne: { filter: { _id: targetId }, update: { $pull: { followers: currentUserId } } } }])//remove target no array "following" do usuario
					return res.status(200).json({ 'status': 'Você deixou de seguir este usuario' })

				} catch (err) {
					return res.status(500).json({ 'status': 'Houve um erro ao tentar completar esta ação' })
				}
			} else {
				return res.status(401).json({ 'status': 'Houve um erro ao tentar completar esta ação' })
			}
		} else {
			return res.status(400).json({ 'status': 'Você precisa estar logado' })
		}

	},

	editProfile: (req, res) => {
		const { currentUserId } = req.params
		const { name, username } = req.body
		const token = req.cookies.jwt

		if (token) {
			isSameId = validateJwt(token, currentUserId)
			if (isSameId) {
				try {
					user.findById(currentUserId, (err, User) => {
						User.name = name || User.name,
							User.username = username || User.username

						User.save()

						return res.status(200).json({ 'status':'Seu perfil foi editado com sucesso'})
					})
				} catch (err) {
					return res.status(500).json({ 'status': 'Houve um erro ao tentar completar esta ação' })
				}
			} else {
				return res.status(401).json({ 'status': 'Houve um erro ao tentar completar esta ação' })
			}
		} else {
			return res.status(400).json({ 'status': 'Você precisa estar logado' })
		}

	},
	profileInfo: (req, res) => {
		const token = req.cookies.jwt
		const { userId } = req.params
		const validToken = validateJwt(token)
		if (validToken) {
			try {
				user.findById(userId, (err, User) => {
					if (User) {
						const { name, username, followers, following } = User
						followersCount = followers.length
						followingCount = following.length
						return res.json({ 'user': { username, name, 'followers': followersCount, 'following': followingCount } })

					} else {
						return res.status(404).json({ 'status': 'Houve um erro ao tentar completar esta ação' })
					}

				})

			} catch (err) {
				return res.json({ 'status': 'Houve um erro ao tentar completar esta ação' })
			}
		} else {
			return res.status(401).json({ 'status': 'Você precisa estar logado' })
		}

	},
	deleteProfile: (req, res) => {
		const token = req.cookies.jwt
		const { currentUserId } = req.params
		const {password} = req.body
		if (token) {
			isSameId = validateJwt(token, currentUserId)
			if (isSameId) {
				try {
					user.findById(req.params.currentUserId, (err, User) => {
						bcrypt.compare(password, User.password, (err, success) => {
							if(success){
								User.remove()
								res.cookie('jwt', '', { maxAge: 10 })
								res.status(200).json({ 'status': 'Sua conta foi deletada' })
							}else{
								return res.status(401).json({'status': 'Senha incorreta'})
							}
						})

					})
				} catch (err) {
					return res.status(500).json({ 'status': 'Houve um erro ao tentar completar esta ação' })
				}

			} else {
				return res.status(401).json({ 'status': 'Houve um erro ao tentar completar esta ação' })
			}
		} else {
			return res.status(401).json({ 'status': 'Você precisa estar logado' })
		}

	},

	timeline: (req, res) => {
		const token = req.cookies.jwt
		const { userId } = req.params
		validToken = validateJwt(token)

		if (validToken) {
			var fields = { __v: false, _id: false, author: false, likes: false }
			post.find({ author: req.params.userId }, fields).then((Posts) => {
				const { } = Posts
				return res.json({ 'posts': Posts })
			}).catch((err) => {
				return res.status(500).json({ 'status': 'Houve um erro' })
			})
		} else {
			return res.status(401).json({ 'status': 'Você precisa estar logado ' })
		}
	},
	searchUser: (req, res) => {
		const { username } = req.params
		const token = req.cookies.jwt
		const validToken = validateJwt(token)

		if (validToken) {
			var fields = { __v: false, _id: false, author: false, likes: false, followers: false, following: false, isAdmin: false, likedPosts: false, email: false, password: false, coverPicture: false, profilePicture: false }
			user.find({ username: { $regex: username, $options: 'i' } }, fields).then((Users) => {
				return res.status(200).json({ 'users': Users })
			}).catch((err) => {
				return res.status(400).json({ 'status': 'Houve um erro ao tentar executar esta ação' })
			})
		} else {
			return res.status(401).json({ 'statu': 'Você precisa estar logado' })
		}
	}

}