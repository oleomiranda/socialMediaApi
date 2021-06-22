const routers = require("express").Router()
const user = require("../models/users")
const bcrypt = require("bcryptjs")
const createJwt = require("../controllers/createJwt")


routers.post("/signup", async (req, res) => {
	const { username, email, password } = req.body
	errors = 0
	if (username == undefined || username == null || !username) { errors++ }
	if (email == undefined || email == null || !email) { errors++ }
	if (password == undefined || password == null || !password || password.length < 6) { errors++ }

	if (errors > 0) {
		return res.status(400).json({ 'status': 'Todos os dados precisam ser preenchidos e a senha deve conter 6 ou mais caracteres' })
	}

	user.findOne({ $or: [{ username: username }, { email: email }] }).then(async (User) => {
		if (User) {
			let errors = { status: [] }
			if (User.username === username) {
				errors.status.push("Username já registrado")
			}
			if (User.email === email) {
				errors.status.push("Email já registrado")
			}
			return res.status(400).json(erros)

		} else {

			const hashedPassword = await bcrypt.hash(password, 10)
			newUser = new user({
				username: username,
				email: email,
				password: hashedPassword
			})

			newUser.save()
				.then(() => { return res.status(200).json({ 'status': 'Usuario criado com sucesso' }) })
				.catch((err) => {
					console.log(err)
					return res.status(500).json({ 'status': 'Houve um erro ao tentar criar o usuario' })
				})

		}
	})
})

routers.post("/login", (req, res) => {
	const { username, password } = req.body

	user.findOne({ username: username }).then((User) => {
		if (User) {
			bcrypt.compare(password, User.password, async (err, user) => {
				if (User) {
					const token = await createJwt(User._id)
					const maxAge = 30 * 24 * 60 * 60 * 1000
					res.cookie('jwt', token, { maxAge: maxAge, httpOnly: true, secure: true })
					res.status(200).json({ 'status': 'Logado com sucesso' })
				} else {
					res.json({ 'status': 'Usuario ou senha incorreta' })
				}
			})
		} else {
			res.status(400).json({ 'status': 'Usuario ou senha incorreta' })
		}
	})
})



module.exports = routers