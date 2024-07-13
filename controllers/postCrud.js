import multer from "multer";
import postsModel from "../models/posts.js";
import userModel from "../models/user.js";

export const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory to store uploaded images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});
export const upload = multer({ storage });

export const createPost = async (req, res) => {
  console.log(req.userId);
  const { title, description, tags, status } = req.body;

  const newPost = new postsModel({
    title: title,
    description: description,
    tags: tags,
    status: status,
    userId: req.userId,
    image: req.file ? req.file.path : null, // Store image path if uploaded
  });

  try {
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json(error);
  }
  // console.log(req.userId)
};
// export const updatePost = async (req, res) => {
//   const id = req.params.id;
//   const { title, description, tags, status } = req.body;
//   const userId = req.userId; // Extract the authenticated user ID

//   try {
//     const note = await postsModel.findOne({ _id: id, userId: userId });

//     if (!note) {
//       return res
//         .status(404)
//         .json({ message: "Note not found or unauthorized" });
//     }

//     // Update only the specified fields
//     const postUpdate = await postsModel.findByIdAndUpdate(
//       id,
//       {
//         title,
//         description,
//         tags,
//         status,
//         image: req.file ? req.file.path : note.image, // Update image path if uploaded, otherwise keep existing path
//       },
//       { new: true }
//     );

//     res.status(200).json(postUpdate);
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };
export const updatePost = async (req, res) => {
  const id = req.params.id;
  const { title, description, tags, status } = req.body;
  const userId = req.userId; // Extract the authenticated user ID

  try {
    const note = await postsModel.findOne({ _id: id, userId: userId });

    if (!note) {
      return res
        .status(404)
        .json({ message: "Note not found or unauthorized" });
    }

    // Update specified fields using $set and add new tags using $push
    const postUpdate = await postsModel.findByIdAndUpdate(
      id,
      {
        $set: {
          title,
          description,
          status,
          image: req.file ? req.file.path : note.image, // Update image path if uploaded, otherwise keep existing path
        },
        $push: {
          tags: { $each: tags }, // Add new tags to the tags array
        },
      },
      { new: true }
    );

    res.status(200).json(postUpdate);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const noteId = req.params.id;

    // Check if the note exists
    const note = await noteModel.findById(noteId);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Delete the note
    await noteModel.findByIdAndDelete(noteId);

    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// export const getPosts = async (req, res) => {
//     try {
//         // Assuming 'UserModel' is your user schema, adjust as necessary
//         const posts = await postsModel.find({status:"public"}).populate('userId', 'username');
//         const totalPosts = posts.length;
//         res.status(200).json({ posts: posts, totalPosts: totalPosts });
//     } catch (error) {
//         res.status(500).json({ message: "Something went wrong" });
//     }
// };
export const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;
    const skip = (page - 1) * limit;

    const posts = await postsModel
      .find({ status: "public" })
      .populate("userId", "username") // Populate userId with the username field from User
      .skip(skip)
      .limit(limit);

    const totalPosts = await postsModel.countDocuments({ status: "public" });

    res.status(200).json({
      posts: posts,
      totalPosts: totalPosts,
      page: page,
      totalPages: Math.ceil(totalPosts / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getAllTags = async (req, res) => {
  try {
    const posts = await postsModel.find({}, { tags: 1 }); // Query to get only the 'tags' field of all posts
    let allTags = [];
    posts.forEach((post) => {
      allTags = allTags.concat(post.tags); // Concatenate all tags from all posts
    });
    const uniqueTags = [...new Set(allTags)]; // Get unique tags
    res.status(200).json({ tags: uniqueTags }); // Send unique tags in response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getTrendingTags = async (req, res) => {
  try {
    const posts = await postsModel.find({}, { tags: 1 }); // Query to get only the 'tags' field of all posts
    let allTags = [];
    posts.forEach((post) => {
      allTags = allTags.concat(post.tags); // Concatenate all tags from all posts
    });

    // Count occurrences of each tag
    const tagCounts = {};
    allTags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });

    // Sort the tags by occurrence count
    const sortedTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1]) // Sort in descending order of count
      .map(([tag, count]) => ({ tag, count }));

    res.status(200).json({ trendingTags: sortedTags }); // Send trending tags in response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
