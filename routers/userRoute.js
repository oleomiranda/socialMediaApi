const routes = require("express").Router()
const user = require("../models/users")
const bcrypt = require("bcryptjs")


routes.post("/login", (req, res) => {

})

routes.post("/signup", async (req, res) => {
	const {username, email, password} = req.body
	const hashPass = await bcrypt.hash(password, 10)

	user.create({
		username: username,
		email: email,
		password: hashPass
	}, (err, success) => {
		if(err){
			res.status(500).json({'status': `Houve um erro: ${err}`})
		}if(success){
			res.status(200).json({'status': 'Usuario criado com sucesso'})
		}
	})
})


module.exports = routes