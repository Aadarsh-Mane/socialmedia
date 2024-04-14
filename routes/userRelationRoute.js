import express from 'express'
import { auth } from '../middleware/auth.js'
import { followUser } from '../controllers/userRelation.js'

const relationRoute=express.Router()


relationRoute.post("/:followedId",auth,followUser)
// relationRoute.post("/:followedId",auth,unfollowUser)



export default relationRoute