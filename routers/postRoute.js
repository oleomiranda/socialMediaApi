const routers = require("express").Router()
const jwt = require("jsonwebtoken")
const post = require("../models/posts")
const checkUserId = require("../helper/checkUserId")

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
	if (errors.status.length > 0) {
		return res.status(400).json(errors)
	}

	try {
		const token = req.cookies.jwt
		if (token) {
			const sameId = checkUserId(author, token)
			//verifica se o id que foi passado como autor é o msm que esta no cookie jwt 
			if (sameId) { 
				newPost = new post({
					content: content,
					author: author
				})
				newPost.save().then(() => {
					res.status(200).json({ 'status': 'Post criado com sucesso' })
				}).catch((err) => {
					res.status(400).json({ 'status': err })
				})
			} else {
				res.status(401).json({ 'status': 'Você só pode criar post na sua propria conta' })
			}

		}
	} catch (err) {
		res.status(500).json({ 'status': 'Houve um erro ao tentar criar o post' })
	}
})

routers.delete("/:postId/delete", (req, res) => {
	const {author} = req.body
	const {postId} = req.params
	const token = req.cookies.jwt

	if(token){ //Verifica se existe o Cookie (se o usuario esta logado)
		const sameId = checkUserId(author, token)
		if(sameId){ //Verifica se o id no cookie é o mesmo que foi passado no body
			try {
				post.findById(req.params.postId, (err, Post) => {
					if(Post){ //Verifica se o post existe
						if(Post.author == author){ //Verifica se o id passado no body é o id do autor do post
							Post.remove((err, success) => {
								if(success){
									return res.status(200).json({'status': 'Post deletado com sucesso'})
								}else{
									return res.status(500).json({'status':'Não foi possivel deletar esse post'})
								}
							})
					}else{
						return res.status(401).json({'status':'Você não tem permissão para deletar este post'})
					}
					}else{
						return res.status(500).json({'status':'Não foi possivel encontrar o post'})
					}
				})
			} catch (err) {
				return res.status(500).json({'status': 'Houve um erro'})
			}
		}else{
			return res.status(401).json({'status':'Você não tem permissão para deletar este post'})
		}

	}else{
		return res.status(401).json({'status':'Faça login antes de tentar executar esta ação'})
	}
	


})



module.exports = routers