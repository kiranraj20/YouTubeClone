import React, { useEffect, useState } from 'react';
import './Comments.css';
import { FaRegUser } from "react-icons/fa6";
import { useDispatch, useSelector } from 'react-redux';
import { getAllComments, postComment,editComment, deleteComment } from '../../Actions/comments';
import DateConversion from '../DateConversion';

const Comments = ({ videoId }) => {
  const currentUser = useSelector(state => state.authReducer?.data?.result);
  const dispatch = useDispatch();
  const [comment, setComment] = useState('');
  const comments = useSelector(s => s.commentReducer)?.data?.filter(q => videoId === q?.videoId).reverse();
  const [edit, setEdit] = useState(null);
  const [EditComment, setEditComment] = useState('');

  useEffect(() => {
    dispatch(getAllComments());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment) {
      alert('please type your comment...!');
    } else {
      dispatch(postComment({
        videoId: videoId,
        userId: currentUser?._id,
        commentBody: comment,
        userCommented: currentUser?.name
      }));
      setComment('');
    }
  };

  const handleEdit = (commentId, commentBody) => {
    setEdit(commentId);
    setEditComment(commentBody);
  };

  const handleEditChange = (e) => {
    setEditComment(e.target.value);
  };

  const handleSaveEdit = (commentId) => {
    dispatch(editComment(
      {
        id:commentId,
        commentBody:EditComment
      }
    ));
    setEdit(null);
    setEditComment('');
  };

  const handleDelete = (commentId) => {
    dispatch(deleteComment(commentId));
  };

  return (
    <div className="">
      <form className='comments-form-box' onSubmit={handleSubmit}>
        <input 
          type="text" 
          className="i-comments" 
          placeholder='Add a comment...' 
          value={comment} 
          onChange={(e) => setComment(e.target.value)} 
        />
        <input type="submit" value="comment" className='add-comment-btn' />
      </form>
      <div className="display-comments">
        {comments?.map(m => (
          <div className="comment-box" key={m._id}>
            <div className="comment-bar">
              <div className="comment-icon"><FaRegUser /></div>
              <div className="comment-desc">
                <div className="comment-name">@{m.userCommented}</div>
                {edit === m._id ? (
                  <input
                    className="comment-text"
                    value={EditComment}
                    onChange={handleEditChange}
                  />
                ) : (
                  <div className="comment-text">{m.commentBody}</div>
                )}
                <div className="comment-timestamp">-{DateConversion(m.CommentOn)} day ago</div>
              </div>
            </div>
            <div className="d-flex align-items-center">
              {currentUser?._id === m.userId && (
                <div className="edit-delete-comment">
                  {edit === m._id ? (
                    <>
                      <span className='save-comment' onClick={() => handleSaveEdit(m._id)}>Save</span> / 
                      <span className='cancel-edit' onClick={() => setEdit(null)}>Cancel</span>
                    </>
                  ) : (
                    <>
                      <span className='edit-comment' onClick={() => handleEdit(m._id, m.commentBody)}>Edit</span> / 
                      <span className='delete-comment' onClick={() => handleDelete(m._id)}>Delete</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;
