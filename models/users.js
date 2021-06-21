const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
	username: {
		type: String,
		required: true,
		min: 1,
		max: 20,
		unique: true
	},
	name:{
		type: String,
		default: function(){
			const _t = this;
			return _t.username
		}
		
	},
	email: {
		type: String,
		required: true, 
		max: 70,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	profilePicture: {
		type: String,
		default: '',
	},
	coverPicture: {
		type: String,
		default: ''
	},
	followers: {
		type: Array,
		default: []
	},
	following:{
		type: Array,
		default: []
	},
	likedPosts: {
		type: Array,
		default: []
	},
	isAdmin:{
		type: Boolean,
		default: false
	}
})



module.exports = mongoose.model('user', userSchema)