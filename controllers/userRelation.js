import User from '../models/user.js'; // Assuming your User model is defined in a separate file

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
   

    // Add the current user (follower) to the followers array of the user being followed
    userToFollow.followers.push(userId);
    await userToFollow.save();
    res.status(200).json({ message: "User followed successfully" });
  } catch (error) {
    console.error("Error following user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
