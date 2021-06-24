const routers = require("express").Router()
const post = require("../models/posts")
const checkUserId = require("../helper/checkUserId")
const postController = require("../controllers/post")
const user = require("../models/users")
routers.post("/create", postController.create)

routers.delete("/:postId/delete", postController.delete)

routers.post("/:postId/like", postController.like)

routers.post("/:postId/unlike", postController.unlike)

module.exports = routers