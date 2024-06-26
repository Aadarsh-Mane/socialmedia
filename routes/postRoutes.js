import express from 'express'
import { auth } from '../middleware/auth.js'
import { createPost, deletePost, getAllTags, getPosts, getTrendingTags, updatePost, upload } from '../controllers/postCrud.js'

const postRouter=express.Router()


postRouter.get("/",getPosts)
postRouter.get("/tags",getAllTags)
postRouter.get("/trending",getTrendingTags)
postRouter.post("/add",auth,upload.single('image'),createPost)
postRouter.put("/update/:id",auth,upload.single('image'),updatePost)
postRouter.delete("/:id",auth,deletePost)

postRouter.post("signin",(req,res)=>{
res.send("note post request")
})


export default postRouter