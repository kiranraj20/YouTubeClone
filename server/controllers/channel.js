
import mongoose from 'mongoose';
import  User  from '../models/auth.js';

export const updateChannelData = async(req,res) => {
  const {id : _id}=req.params;
  const { name, desc, } = req.body;

  if(!mongoose.Types.ObjectId.isValid(_id)){
    return res.status(404).send("Channel Unavailable...")
  }
  try {
    const updateData = await User.findByIdAndUpdate(_id,{
      $set:{
        'name':name,
        'desc':desc,
      }
    },{new:true})
    res.status(200).json(updateData)
  } catch (error) {
    res.status(405).json({message:error.message})
  }
}

export const getChannelById = async(req,res) => {
  try {
    const {id : _id}=req.params;
    const channel = await User.findById(_id);
    // const allChannelDetails = []
    // allChannels.forEach(channel => {
    //   allChannelDetails.push({_id:channel._id,name:channel.name,email:channel.email,desc:channel.desc,likedVideos:channel.likedVideos,savedVideos:channel.savedVideos});
    // });
    res.status(200).json(channel);
  }catch(error){
    res.status(405).json({message:error.message})
  }
}

export const likedVideo = async (req, res) => {
  const  userId  = Object.keys(req.body)[0];
  const { Vid : videoId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(videoId)) {
    return res.status(404).send("Invalid ID...");
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found...");
    }

    if (!user.likedVideos.includes(videoId)) {
      user.likedVideos.push(videoId);
      await user.save();
    }else{
      user.likedVideos = user.likedVideos.filter((id) => id.toString() !== videoId);
      await user.save();
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const savedVideo = async (req, res) => {
  const  userId  = Object.keys(req.body)[0];
  const { Vid : videoId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(videoId)) {
    return res.status(404).send("Invalid ID...");
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found...");
    }

    if (!user.savedVideos.includes(videoId)) {
      user.savedVideos.push(videoId);
      await user.save();
    }else{
      user.savedVideos = user.savedVideos.filter((id) => id.toString() !== videoId);
      await user.save();
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};