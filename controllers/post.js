
const post = require("../models/posts")
const checkUserId = require("../helper/checkUserId")

module.exports = {
	create: (req, res) => {
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
				const isSameId = checkUserId(author, token)
				//verifica se o id que foi passado como autor é o msm que esta no cookie jwt 
				if (isSameId) {
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
	},
	delete: (req, res) => {
		const { author } = req.body
		const { postId } = req.params
		const token = req.cookies.jwt

		if (token) { //Verifica se existe o Cookie (se o usuario esta logado)
			const isSameId = checkUserId(author, token)
			if (isSameId) { //Verifica se o id no cookie é o mesmo que foi passado no body
				try {
					post.findById(req.params.postId, (err, Post) => {
						if (Post) { //Verifica se o post existe
							if (Post.author == author) { //Verifica se o id passado no body é o id do autor do post
								Post.remove((err, success) => {
									if (success) {
										return res.status(200).json({ 'status': 'Post deletado com sucesso' })
									} else {
										return res.status(500).json({ 'status': 'Não foi possivel deletar esse post' })
									}
								})
							} else {
								return res.status(401).json({ 'status': 'Você não tem permissão para deletar este post' })
							}
						} else {
							return res.status(500).json({ 'status': 'Não foi possivel encontrar o post' })
						}
					})
				} catch (err) {
					return res.status(500).json({ 'status': 'Houve um erro' })
				}
			} else {
				return res.status(401).json({ 'status': 'Você não tem permissão para deletar este post' })
			}

		} else {
			return res.status(401).json({ 'status': 'Faça login antes de tentar executar esta ação' })
		}
	},
	like: async (req, res) => {
		const token = req.cookies.jwt
		const { postId } = req.params
		const { userId } = req.body

		if (token) {
			Post = await post.findById(req.params.postId)
			currentUser = await user.findById(req.body.userId)

			if (!Post.likes.includes(currentUser._id)) {
				try {
					await Post.updateOne({ $push: { likes: currentUser._id } })
					await currentUser.updateOne({ $push: { likedPosts: Post._id } })

					return res.status(200).json({ 'status': 'Você curtiu este post' })
				} catch (err) {
					return res.status(400).json({ 'status': 'houve um erro' })
				}
			} else {
				return res.status(401).json({ 'status': 'Você já curtiu este post' })
			}
		} else {
			return res.status(401).json({ 'status': 'Você precisa estar logado' })
		}

	},

	unlike: async (req, res) => {
		const token = req.cookies.jwt
		const { postId } = req.params
		const { userId } = req.body

		if (token) {
			Post = await post.findById(req.params.postId)
			currentUser = await user.findById(req.body.userId)

			if (Post.likes.includes(currentUser._id)) {
				try {
					await Post.updateOne({ $pull: { likes: currentUser._id } })
					await currentUser.updateOne({ $pull: { likedPosts: Post._id } })

					return res.status(200).json({ 'status': 'Você dexiou de curtir este post' })
				} catch (err) {
					return res.status(400).json({ 'status': 'houve um erro' })
				}
			} else {
				return res.status(401).json({ 'status': 'Você ainda não curtiu este post' })
			}
		} else {
			return res.status(401).json({ 'status': 'Você precisa estar logado' })
		}

	}

}