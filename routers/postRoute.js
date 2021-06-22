const routers = require("express").Router()
const jwt = require("jsonwebtoken")
const post = require("../models/posts")
routers.post("/create", (req, res) => {
	const { content, img, author } = req.body
	let errors = { status: [] }
	
	//Checa se conteudo e autor nao estao indefinidos
	if (content == undefined || content == null || !content) {
		errors.status.push('Adicione um conteudo ao post')
	}
	if (author == undefined || author == null || !author) {
		errors.status.push('Autor não definido')
	}

	//retorna erro caso conteudo ou autor nao foram enviados
	if(errors.status.length > 0){
		return res.status(400).json(errors)
	}

	try {
		const token = req.cookies.jwt
		if (token) {
			jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
				const userToken = decodedToken.id 
				if (userToken == author) { //verifica se o id que foi passado como autor é o msm que esta no cookie jwt 
					newPost = new post({
						content: content,
						author: author
					})
					newPost.save().then(() => {
						res.status(200).json({ 'status': 'Post criado com sucesso' })
					}).catch((err) => {
						res.status(400).json({'status': err})
					})
				}
			})
		}
	} catch (err) {
		res.status(500).json({ 'status': 'Houve um erro ao tentar criar o post' })
	}
})

module.exports = routers