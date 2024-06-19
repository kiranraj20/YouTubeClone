import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  email: {type:String , require:true},
  name: {type:String},
  desc: {type:String},
  likedVideos:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
  savedVideos:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
  joinedOn: {type:Date, default:Date.now},
  messages: [
    {
      email: { type: String },
      message: { type: String }
    }
  ]
})

export default mongoose.model("User", userSchema)