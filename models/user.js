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
},{timestamps:true})



export default mongoose.model("User", UserSchema);
