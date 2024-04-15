import mongoose from 'mongoose';

const CommentSchema = mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    username: {
        type: String,
        // required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default CommentSchema;
