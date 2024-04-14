import express from 'express'
import { auth } from '../middleware/auth.js'
import { checkFollowStatus, fetchPosts, followUser } from '../controllers/userRelation.js'

const relationRoute=express.Router()


relationRoute.post("/:followedId",auth,followUser)
relationRoute.get("/:followedId",auth,checkFollowStatus,fetchPosts)
// relationRoute.post("/:followedId",auth,unfollowUser)



export default relationRoute