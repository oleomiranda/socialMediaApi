const jwt = require("jsonwebtoken")

module.exports = function validin(userid, jwtToken) {
	answer = ''
	jwt.verify(jwtToken, process.env.JWT_SECRET, (err, decoded) => {
		if(decoded && decoded.id == userid){
			answer = true
		}else{
			answer = false
		}
	})
	return answer
}