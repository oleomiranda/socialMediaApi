const bcrypt = require("bcryptjs")
const user = require("../models/users")
const validateJwt = require("../helper/validateJwt")


module.exports = {
	changePassword: (req, res) => {
		const { currentUserId } = req.params
		const { oldPassword, newPassword, confNewPassword } = req.body
		const token = req.cookies.jwt
		
		if (token) {
			isSameId = validateJwt(token, currentUserId)

			if (isSameId) {
				if (newPassword !== confNewPassword) { return res.status(400).json({ 'status': 'A nova senha e a confirmação não são iguais' }) }

				try {
					user.findById(req.params.currentUserId, (err, User) => {
						bcrypt.compare(oldPassword, User.password, async (err, success) => {
							if (success) {
								hashedPass = await bcrypt.hash(newPassword, 10)
								User.password = hashedPass
								User.save()
								return res.status(200).json({ 'status': 'Sua senha foi alterada com sucesso' })
							} else {
								return res.status(400).json({ 'status': 'Senha atual incorreta' })
							}
						})
					})


				} catch (error) {
					return res.status(500).json({ 'status': 'Houve um erro ao tentar completar esta ação' })
				}

			} else {
				return res.status(401).json({ 'status': 'Houve um erro ao tentar completar esta ação' })
			}
		} else {
			return res.status(400).json({ 'status': 'Você precisa estar logado' })
		}

	},

	changeEmail: (req, res) => {
		const token = req.cookies.jwt
		const { currentUserId } = req.params
		const { password, newEmail, confNewEmail } = req.body

		

		if (token) {
			isSameId = validateJwt(token, currentUserId)

			if (isSameId) {
				if (newEmail === confNewEmail) {
					user.findById(currentUserId, (err, User) => {
						if (User) {
							bcrypt.compare(password, User.password, (err, success) => {
								if (success) {
									User.email = newEmail
									User.save()
									return res.status(200).json({ 'status': 'Seu email foi alterado com sucesso' })
								} else {
									return res.status(400).json({ 'status': 'Senha incorreta' })
								}
							})
						} else {
							return res.status(500).json({ 'status': 'Houve um erro ao tentar completar esta ação' })
						}
					})

				} else {
					return res.status(400).json({ 'status': 'O novo email e a confirmação não são iguais' })
				}
			} else {
				return res.status(401).json({ 'status': 'Houve um erro ao tentar completar esta ação' })
			}
		} else {
			return res.status(401).json({ 'status': 'Você precisa estar logado' })
		}


	}

}