const express = require("express")
const app = express()
const mongoose = require("mongoose")
const user = require("./models/users")
const dotenv = require("dotenv").config()
const userRoute = require("./routers/userRoute")
mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true}, (err) => {
	if(err){
		console.log(`Error => ${err}`)
	}else{
		console.log(`Conectado ao mongodb`)
	}
})

app.use(express.json())

app.use("/", userRoute)


app.get("/", (req, res) => {
	res.send('lol')
})

app.listen(8081, console.log('rodando...'))
