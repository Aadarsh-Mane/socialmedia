import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import userModel from '../models/user.js'
import postsModel from "../models/posts.js";

const SECRET='NOTESAPI'
import QRCode from "qrcode";


export const signup=async(req,res)=>{

    const {username,email,password,usertype,college}=req.body
    try {
        const existingUser=await userModel.findOne({email:email})
        if(existingUser){
            return res.status(400).json({message:"user alred"})
        }
    
        const hashedPassword=await bcrypt.hash(password,10)
        const result=await userModel.create({
            email:email,
            password:hashedPassword,
            username:username,
            usertype:usertype,
            college:college
        })
        const token=jwt.sign({email:result.email,id:result._id},SECRET)
        res.status(201).json({user:result,token:token});
    } catch (error) {
        console.log(error)
    }
    
    }
    export const signin=async(req,res)=>{
    const {email,password}=req.body;
    
    try {
        const existingUser=await userModel.findOne({email:email})
        if(!existingUser){
            return res.status(404).json({message:"user not found"})
        }
        const matchPassword=await bcrypt.compare(password,existingUser.password)
        if(!matchPassword){
            return res.status(404).json({message:"invalid credetails"})
        }
        const token=jwt.sign({email:existingUser.email,id:existingUser._id},SECRET,{
            expiresIn:'1d'
    
        }
        )
        res.status(201).json({user:existingUser,token:token});
    } catch (error) {
        
    }
    
    
    }


    export const generateqrCode=async(req,res)=> {
        console.log("Generating")
        const userID = req.userId; // Assuming auth middleware sets req.user to the userID
      
        try {
          // Fetch user from the database using the userID
          const user = await userModel.findById(userID);
      
          if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }
      
          // Construct user information
          const userInfo = {
            username: user.username,
            email: user.email,
          };
       console.log(userInfo);
       const profileLink = `http://localhost:5000/${user.username}`; // Replace with your actual profile URL
       console.log(profileLink);
    
          // Generate QR code
          const qrCodeUrl = await QRCode.toDataURL(JSON.stringify(userInfo));
            
          user.qrcode = qrCodeUrl;
          await user.save();
        //   console.log("QR Code URL saved successfully:", qrCodeUrl);
    
          // Send the QR code as response
          res.send(`<img src="${qrCodeUrl}" alt="QR Code" />`);
        } catch (error) {
          console.error('Error:', error);
          res.status(500).json({ message: 'Internal server error' });
        }
    }
    export const userProfile = async (req, res) => {
        const userId = req.userId; // Assuming auth middleware sets req.user to the userID
        
        try {
            // Fetch user from the database using the userID
            const user = await userModel.findById(userId);
            
            if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }
        
                // Send the user data
                res.json({ user });
            } catch (error) {
                console.error('Error:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        }

        export const userPosts = async (req, res) => {
            const userId = req.userId; // Assuming auth middleware sets req.user to the userID
         console.log(`User ${userId}`)
            try {
                // Fetch user from the database using the userID
                const userPosts = await postsModel.find({userId:userId});
                
                if (!userPosts) {
                        return res.status(404).json({ message: 'User not found' });
                    }
            
                    // Send the user data
                    const addy=userPosts.map(post=>({
                        title: post.title,
                        description: post.description
                    }))
                    res.json({ addy
                    
                    });
                } catch (error) {
                    console.error('Error:', error);
                    res.status(500).json({ message: 'Internal server error' });
                }
            }
        