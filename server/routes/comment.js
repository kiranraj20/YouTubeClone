import express from 'express'
import { postComment } from '../controllers/comment.js'
import { getAllComments } from '../controllers/comment.js'
import { deleteComment } from '../controllers/comment.js'
import { editComment } from '../controllers/comment.js'
import auth from '../middleware/auth.js'
const router = express.Router()

router.post('/post',auth,postComment)
router.get('/get',getAllComments)
router.delete('/delete/:id',auth,deleteComment)
router.patch('/edit/:id',auth,editComment)

export default router;