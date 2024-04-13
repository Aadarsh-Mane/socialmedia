import express from 'express'
import { generateqrCode, signin, signup, userPosts, userProfile } from '../controllers/userController.js'
import { auth } from '../middleware/auth.js'

const userRouter=express.Router()


userRouter.post("/signup",signup)
userRouter.post("/signin",signin)
userRouter.get("/generateqr",auth,generateqrCode)  
userRouter.get("/viewProfile",auth,userProfile)  
userRouter.get("/viewProfile/posts",auth,userPosts)  
userRouter.get("/viewProfile",auth,userProfile)  


export default userRouter