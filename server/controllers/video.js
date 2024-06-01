import videoFiles from '../models/videoFiles.js'

export const uploadVideo=async (req, res, next)=>{
  if(req.file===undefined) {
    res.status(404).json({message: "plz Upload a '.mp4' video file only " })
  }else{
    try {
      const file=new videoFiles({
        videoTitle: req.body.title,
        fileName: req.file.originalname,
        filePath: req.file.path,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        videoChannel: req.body.channel,
        uploader: req.body.uploader,
      })
      await file.save();
      res.status(201).send("File uploaded successfully")
    } catch (error) {
      res.status(500).send(error.message)
    }
  }
}

export const getAllVideos = async (req,res) => {
  try {
    const files = await videoFiles.find();
    res.status(200).send(files)
  } catch (error) {
    res.status(405).send(error.message)
  }
}

export const updateVideoById = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  try {
    const updatedVideo = await videoFiles.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedVideo) {
      return res.status(404).json({ message: 'Video not found' });
    }
    res.status(200).json(updatedVideo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};