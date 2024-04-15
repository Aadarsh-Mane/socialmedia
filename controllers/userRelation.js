import Follow from '../models/relations.js';
import User from '../models/user.js'; // Assuming your User model is defined in a separate file
import postsModel from "../models/posts.js";

export const followUser = async (req, res) => {
     const userId=req.userId
  const { followedId } = req.params; // Assuming you'll pass the IDs of the users to follow in the request body

  try {
    // Find the current user
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the user to follow
    const userToFollow = await User.findById(followedId);
    if (!userToFollow) {
      return res.status(404).json({ message: "User to follow not found" });
    }

    // Check if the current user is already following the userToFollow
    if (currentUser.following.includes(followedId)) {
      return res.status(400).json({ message: "You are already following this user" });
    }

    // Add the userToFollowId to the following array of the current user
    currentUser.following.push(followedId);
    await currentUser.save();
   

    // Add the current user (follower) to the following array of the user being followed
    userToFollow.following.push(userId);
    await userToFollow.save();
    res.status(200).json({ message: "User followed successfully" });
  } catch (error) {
    console.error("Error following user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
export const checkFollowStatus = async (req, res, next) => {
  try {
    const userId  = req.userId;
    const { followedId } = req.params; // Assuming you have the target user's ID in the URL params

    // Check if the viewer is following of the target user
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const isFollowing = targetUser.following.includes(followedId);
    console.log("jdsjdsd",isFollowing)
    req.following = isFollowing; // Store follow status in request object
    next();
  } catch (error) {
    console.error("Error in checkFollowStatus middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const fetchPosts = async(req, res) => {
  try {
    const { followedId } = req.params;
    const { following } = req;
    console.log("following:", following);

    let posts;
    if (following) {
      // If the viewer is following, fetch both public and private posts
      posts = await postsModel.find({ userId: followedId });
    } else {
      // If not following, fetch only public posts
      posts = await postsModel.find({ userId: followedId, status: 'public' });
    }

    res.json(posts);
  } catch (error) {
    console.error("Error in fetching posts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const commentOnPost = async (req, res) => {
  try {
      const { followedId } = req.params;
      const  userId = req.userId; // Assuming you have user ID and username in the request object
      const { content } = req.body;

      // Find the post by ID
      const post = await postsModel.findById(followedId);
      console.log(post);
      if (!post) {
          return res.status(404).json({ message: 'Post not found' });
      }

      // Check if the user can comment on the post
      if (post.status === 'private') {
          const postAuthor = await User.findById(post.userId);
          if (!postAuthor) {
              return res.status(404).json({ message: 'Post author not found' });
          }

          const user = await User.findById(userId);
          if (!user) {
              return res.status(404).json({ message: 'User not found' });
          }

          // Check if the user is following the post author
          const isFollowing = postAuthor.followers.includes(userId);

          if (!post.userId.equals(userId) && !isFollowing) {
              return res.status(403).json({ message: 'You are not authorized to comment on this post' });
          }
      }

      // Create a new comment
      const comment = {
          content,
          userId,
          
      };

      // Push the comment to the post's comments array
      post.comments.push(comment);
      await post.save();

      return res.status(201).json({ message: 'Comment added successfully', comment });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server Error' });
  }
};