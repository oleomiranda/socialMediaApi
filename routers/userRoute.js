const routes = require("express").Router()
const user = require("../models/users")
const bcrypt = require("bcryptjs")
const createJwt = require("../controllers/createJwt")


routes.post("/signup", async (req, res) => {
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
			let erros = { status: [] }
			if (User.username === username) {
				erros.status.push("Username já registrado")
			}
			if (User.email === email) {
				erros.status.push("Email já registrado")
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

routes.post("/login", (req, res) => {
	const { username, password } = req.body

	user.findOne({ username: username }).then((User) => {
		if (User) {
			bcrypt.compare(password, User.password, (err, User) => {
				if (User) {
					const token = createJwt(User._id)

					const maxAge = 2 * 24 * 60 * 60
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



module.exports = routes