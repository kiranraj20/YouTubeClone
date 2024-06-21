import videoFiles from '../models/videoFiles.js';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import ffmpegPath from '@ffmpeg-installer/ffmpeg';

export const uploadVideo = async (req, res, next) => {
  if (req.file === undefined) {
    return res.status(404).json({ message: "Please upload a '.mp4' video file only " });
  } else {
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }
    const resolutions = [360, 480, 720, 1080];
    const inputFile = req.file.path;
    const file = new videoFiles({
      videoTitle: req.body.title,
      fileName: req.file.originalname,
      filePath: inputFile,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      videoChannel: req.body.channel,
      uploader: req.body.uploader
    });
    await file.save();
    const outputFiles = resolutions.map(res => {
      const outputPath = `${inputFile.slice(0, inputFile.length - 4)}-${res}p.mp4`;
      return { res, path: outputPath };
    });
    try {
      // Create an array of promises for each ffmpeg processing task
      const transcodingTasks = outputFiles.map(output => {
        return new Promise((resolve, reject) => {
          ffmpeg.setFfmpegPath(ffmpegPath.path);
          ffmpeg(inputFile)
            .videoCodec('libx264')
            .size(`?x${output.res}`)
            .output(output.path)
            .on('end', async () => {
              console.log('1')
              try {
                const file = new videoFiles({
                  videoTitle: req.body.title,
                  fileName: req.file.originalname,
                  filePath: output.path,
                  fileType: req.file.mimetype,
                  fileSize: req.file.size,
                  videoChannel: req.body.channel,
                  uploader: req.body.uploader
                });
                await file.save();
                resolve();
              } catch (error) {
                reject(error);
              }
            })
            .on('error', err => {
              reject(err);
            })
            .run();
        });
      });

      // Wait for all transcoding tasks to complete
      await Promise.all(transcodingTasks);

      res.status(201).send("File uploaded and transcoded successfully");
    } catch (error) {
      console.error('Error uploading video:', error);
      res.status(500).send(error.message);
    }
  }
};

export const getAllVideos = async (req, res) => {
  try {
    const files = await videoFiles.find();
    res.status(200).send(files);
  } catch (error) {
    res.status(405).send(error.message);
  }
};

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

