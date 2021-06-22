const mongoose = require("mongoose")
const Schema = mongoose.Schema
const postSchema = new Schema({
	content: {
		type: String,
		max: 140,
		required: true
	},
	img:{
		type: String
	},
	likes: {
		type: Array,
		default: []
	},
	author: {
		type: Schema.Types.ObjectId
	}
})

module.exports = mongoose.model("post", postSchema)