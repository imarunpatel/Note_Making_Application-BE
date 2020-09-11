const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const Teacher = require('../models/Teacher');


// desc         Register for Students
// route        GET /api/v1/register
exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body;
    console.log('class', req.body);

    // Create User
    const user = await User.create({
        name,
        email,
        class: req.body.class,
        password
    })

    // Create token
    const token = user.getSignedJwtToken();

    res.status(200).json({ success: true, token })
});

// desc         Register for Teachers
// route        GET /api/v1/register/teacher
exports.registerTeacher = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    // Create User
    const teacher = await Teacher.create({
        name,
        email,
        password,
        role
    })

    // Create token
    const token = teacher.getSignedJwtToken();

    res.status(200).json({ success: true, token })
});

// ------------------------------------------

// desc         Login for Students
// route        GET /api/v1/login
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Validate email & password
    if(!email || !password) {
        return next(new ErrorResponse('Please provide an email and password', 400));
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if(!user) {
        return next(new ErrorResponse('Invalid Credentials', 401));
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if(!isMatch) {
        return next(new ErrorResponse('Invalid Credentials', 401));
    }

    sendTokenResponse(user, 200, res);
})


// desc         Login for Teachers
// route        GET /api/v1/login/teaher
exports.loginTeacher = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Validate email & password
    if(!email || !password) {
        return next(new ErrorResponse('Please provide an email and password', 400));
    }

    // Check for user
    const teacher = await Teacher.findOne({ email }).select('+password');

    if(!teacher) {
        return next(new ErrorResponse('Invalid Credentials', 401));
    }

    // Check if password matches
    const isMatch = await teacher.matchPassword(password);

    if(!isMatch) {
        return next(new ErrorResponse('Invalid Credentials', 401));
    }

    sendTokenResponse(teacher, 200, res);
});


exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({ 
        success: true,
        data: user
    });
});


// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + process.env.JWT_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    }
    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token
        })
}