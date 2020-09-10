const mongoose = require('mongoose');
const slugify = require('slugify');

const NotesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        unique: true,
        trim: true,
        maxlength: [50, 'Title can not be more than 50 characters']
    },
    slug: String,
    text: {
        type: String,
        required: [true, 'Please add text'],
        minlength: [150, 'Notes must be less than 150 words'],
        maxlength: [200, 'Notes can not be more than 200 words'],
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    student: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
});

NotesSchema.pre('save', function(next) {
    this.slug = slugify(this.title, { lower: true });
    next();
});

module.exports = mongoose.model('Notes', NotesSchema);