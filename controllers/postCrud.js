import multer from "multer";
import postsModel from "../models/posts.js";
import userModel from "../models/user.js";

export const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory to store uploaded images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Unique filename
  },
})
export const upload = multer({ storage });

export const createPost=async(req,res)=>{
    console.log(req.userId)
    const {title,description,tags,status}=req.body

    const newPost=new  postsModel({
        title:title,
        description:description,
        tags:tags,
        status:status,
        userId:req.userId,
        image: req.file ? req.file.path : null // Store image path if uploaded

    })
 

    try {
        await newPost.save();
        res.status(201).json(newPost)
    } catch (error) {
        res.status(500).json(error)
    }
    // console.log(req.userId)
    
}
export const updatePost = async (req, res) => {
    const id = req.params.id;
    const { title, description, tags, status } = req.body;
    const userId = req.userId; // Extract the authenticated user ID
  
    try {
      const note = await postsModel.findOne({ _id: id, userId: userId });
  
      if (!note) {
        return res.status(404).json({ message: 'Note not found or unauthorized' });
      }
  
      // Update only the specified fields
      const postUpdate = await postsModel.findByIdAndUpdate(
        id,
        { title, description, tags, status ,image: req.file ? req.file.path : note.image // Update image path if uploaded, otherwise keep existing path
      },
        { new: true }
      );
  
      res.status(200).json(postUpdate);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
export const deletePost = async (req, res) => {
    try {
      const noteId = req.params.id;
  
      // Check if the note exists
      const note = await noteModel.findById(noteId);
      if (!note) {
        return res.status(404).json({ message: 'Note not found' });
      }
  
      // Delete the note 
      await noteModel.findByIdAndDelete(noteId);
  
      res.json({ message: 'Note deleted successfully' });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
export const getPosts = async (req, res) => {
    try {
        // Assuming 'UserModel' is your user schema, adjust as necessary
        const posts = await postsModel.find({status:"public"}).populate('userId', 'username');
        const totalPosts = posts.length;
        res.status(200).json({ posts: posts, totalPosts: totalPosts });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

