import mongoose from 'mongoose';

const watchedVideoSchema = new mongoose.Schema({
  videoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Video', required: true },
  watchedAt: { type: Date, default: Date.now }, 
});

const historySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  
  watchedVideos: [watchedVideoSchema], 
}, { timestamps: true }); 

export default mongoose.model('History', historySchema);
