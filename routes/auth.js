const express = require('express');
const { register, registerTeacher, login, loginTeacher, getMe } = require('../controllers/auth');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/register/teacher', registerTeacher);
router.post('/login', login);
router.post('/login/teacher', loginTeacher);
router.get('/me', protect, getMe);


module.exports = router;