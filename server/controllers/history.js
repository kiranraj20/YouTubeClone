import History from '../models/history.js';

export const postHistory = async (req, res) => {
  const { id: userId } = req.params;
  const videoId = Object.keys(req.body)[0];

  try {
    let history = await History.findOne({ userId });
    if (!history) {
      history = new History({ userId, watchedVideos: [] });
    }

    const videoExists = history.watchedVideos.some(
      (video) => video.videoId.toString() === videoId
    );

    if (!videoExists) {
      history.watchedVideos.push({ videoId });
    }

    await history.save();

    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getHistoryByUserId = async (req, res) => {
  const { id: userId } = req.params; 

  try {
    const history = await History.findOne( {userId} )

    if (!history) {
      return res.status(404).json({ message: 'No history found for this user.' });
    }

    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};