import mongoose from 'mongoose';
import CommentSchema from './comment.js';

const ScheduledPostsSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        default: []
    },
    status: {
        type: String,
        enum: ['private', 'public'],
        default: 'private' // Default to private until it's moved to the Posts collection
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    image: {
        type: String // Path to the uploaded image
    },
    comments: [CommentSchema], // Array of comments
    scheduledAt: {
        type: Date,
        required: true
    }
}, { timestamps: true });

export default mongoose.model("ScheduledPosts", ScheduledPostsSchema);
