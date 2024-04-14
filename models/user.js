import mongoose from 'mongoose';


const UserSchema =mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    college:{
        type:String,

    },
    usertype:{
        type:String,
        enum:['love','break','accept',''],
        default: ''

    },
    qrcode:{
      type:String,
    },
    profileImage: {
        type: String, // Store the image URL
      },
      followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
},{timestamps:true})



export default mongoose.model("User", UserSchema);
