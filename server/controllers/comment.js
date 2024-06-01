import comment from '../models/comment.js'
import mongoose from 'mongoose'

export const postComment= async(req,res) => {
  const commentData = req.body;
  const postComment = new comment(commentData)
  try {
    await postComment.save()
    res.status(201).json('comment posted...')
  }catch(error){
    res.status(400).json('error')
  }
}

export const getAllComments = async (req, res) => {
  try {
    const commentList = await comment.find();
    res.status(200).send(commentList);
  } catch (error) {
    res.status(404).send(error.message)
  }
};

export const deleteComment = async (req, res) => {
  const { id: _id } = req.params;
  console.log(_id)
  try {
    await comment.findByIdAndDelete(_id);
    res.status(200).json({ message: "Deleted comment" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const editComment = async (req, res) => {
  const {id:_id}=req.params;
  const {commentBody}=req.body;
  try {
    const updateComment = await comment.findByIdAndUpdate(
      _id,
      {
        $set: {"commentBody": commentBody}
      }
    )
    res.status(200).json (updateComment)
  } catch (error) {
    res.status(400).json(error)
  }
};