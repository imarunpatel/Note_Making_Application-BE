const router = require('express').Router();
const { getNotes, getNote, createNote, updateNote, deleteNote } = require('../controllers/notes');
const { protect, authorize } = require('../middleware/auth');

router
    .route('/')
    .get(protect, authorize('teacher', 'student'), getNotes)
    .post(protect, authorize('student', 'teacher'), createNote);

router
    .route('/:id')
    .get(protect, getNote)
    .put(protect, authorize('student', 'teacher'), updateNote)
    .delete(protect, authorize('student', 'teacher'), deleteNote);

module.exports = router;