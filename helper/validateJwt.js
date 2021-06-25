const jwt = require("jsonwebtoken")

module.exports = function validate(jwtToken, userid=none) {
	answer = ''
	jwt.verify(jwtToken, process.env.JWT_SECRET, (err, decoded) => {
		if(userid !== none){
			if(decoded && decoded.id == userid){
				answer = true
			}else{
				answer = false
			}
		}else{
			if(decoded){
				answer = true
			}else{
				answer = false
			}
		}
	})
	return answer
}