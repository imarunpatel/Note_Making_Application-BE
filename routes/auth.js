const express = require('express');
const { register, registerTeacher, login, loginTeacher } = require('../controllers/auth');

const router = express.Router();

router.post('/register', register);
router.post('/register/teacher', registerTeacher);
router.post('/login', login);
router.post('/login/teacher', loginTeacher);


module.exports = router;