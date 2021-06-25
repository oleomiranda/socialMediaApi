const bcrypt = require("bcryptjs")
const user = require("../models/users")
const validateJwt = require("../helper/validateJwt")


module.exports = {
	changePassword: (req, res) => {
		const { currentUserId } = req.params
		const { oldPassword, newPassword, confNewPassword } = req.body
		const token = req.cookies.jwt
		validToken = validateJwt(token)
		if (validToken) {
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
								return res.status(200).json({ 'status': 'Sua senha foi alterada' })
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


}