const jwt = require("jsonwebtoken")

module.exports = function validin(userid, jwtToken){
	decoded = jwt.verify(jwtToken, process.env.JWT_SECRET)
	if(decoded.id == userid){
		return true
	}else{
		return false
	}
}