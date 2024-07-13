import mongoose from "mongoose";
import CommentSchema from "./comment.js";

const PostsSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["private", "public"],
      default: "public",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: {
      type: String, // Path to the uploaded image
    },
    comments: [CommentSchema], // Array of comments
  },
  { timestamps: true }
);
PostsSchema.index({ status: 1 });

export default mongoose.model("Posts", PostsSchema);
