const Notes = require('../models/notes');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

exports.getNotes = asyncHandler(async (req, res, next) => {
    const blogs = await Notes.find().populate('student');
    res
        .status(200)
        .json({ success: true, length: blogs.length, data: blogs });
});

exports.getNote = asyncHandler(async (req, res, next) => {
        const note = await Notes.findById(req.params.id);
    
        if (!note) {
            return next(
                new ErrorResponse(`Blog not found with the id of ${req.params.id}`)
            );
        };
        console.log('user', req.user)

        // Make sure student is Note owner
        if(note.student.toString() !== req.user.id && req.user.role !== 'teacher') {
            return next(
                new ErrorResponse(`Student ${req.params.id} is not authorized to access this Note`, 401)
            )
        } 
    
        res.status(200).json({ success: true, data: note });
})

exports.createNote = asyncHandler(async (req, res, next) => {
    // Add user to req.body
    req.body.student = req.user.id;

    // Check for already submitted notes
	const alreadySubmitted = await Notes.findOne({ student: req.user.id });

	// If the student is already submitted the notes they can't submit notes again
	if(alreadySubmitted) {
		return next(
			new ErrorResponse(
				`Hello ${req.user.name} you have already submitted the notes`, 
				400
			));
	}

    const notes = await Notes.create(req.body);

    res
        .status(200)
        .json({ success: true, data: notes});
})

exports.updateNote = asyncHandler(async (req, res, next) => {
    let note = await Notes.findById(req.params.id);

    if (!note) {
        return next(
            new ErrorResponse(`Blog not found with the id of ${req.params.id}`)
        );
    };

    // Make sure student is Notes owner
    if(note.student.toString() !== req.user.id && req.user.role !== 'teacher') {
        return next(
            new ErrorResponse(`Student ${req.params.id} is not authorized to update this Note`, 401)
        )
    } 

    note = await Notes.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({ status: true, data: note });
});

exports.deleteNote = asyncHandler(async (req, res, next) => {
    const note = await Notes.findById(req.params.id);

    if(!note) {
        return next(
            new ErrorResponse(`Blog not found with the id of ${req.params.id}`)
        );
    };

    // Make sure student is Notes owner
    if(note.student.toString() !== req.user.id && req.user.role !== 'teacher') {
        return next(
            new ErrorResponse(`Student ${req.params.id} is not authorized to delete this Note`, 401)
        )
    } 

    note.remove();
    res.status(200).json({ status: true, data: {}, msg: 'Successfully Deleted !' });
});