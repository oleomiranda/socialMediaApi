const checkUserId = require("../helper/checkUserId")
const user = require("../models/users")

module.exports = {

	followUser: async (req, res) => {
		const { currentUserId } = req.params
		const { targetId } = req.body
		const token = req.cookies.jwt

		if (currentUserId == targetId) {
			return res.status(401).json({ 'status': 'targetId e currentUserId devem ser diferentes' })
		}

		if (token) {
			
			const isSameId = checkUserId(currentUserId, token)
			console.log(isSameId)
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

			}else{
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
			const isSameId = checkUserId(currentUserId, token)
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
			isSameId = checkUserId(currentUserId, token)
			if (isSameId) {
				try {
					user.findById(currentUserId, (err, User) => {
						User.name = name || User.name,
							User.username = username || User.username

						User.save()

						return res.status(200).json({ 'status': User })
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

		if (token) {
			try {
				user.findById(userId, (err, User) => {
					if (User) {
						const { name, username, followers, following } = User
						followersCount = followers.length
						followingCount = following.length
						return res.json({ 'user': { username, name, 'followers': followersCount, 'following': followingCount } })

					} else {
						return res.status(404).json({ 'status': 'Usuario não encontrado' })
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

		if (token) {
			isSameId = checkUserId(currentUserId, token)
			if (isSameId) {
				try {
					user.findById(req.params.currentUserId, (err, User) => {

						User.remove()
						res.cookie('jwt', '', { maxAge: 10 })
						res.status(200).json({ 'status': 'Sua conta foi deletada' })
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

}