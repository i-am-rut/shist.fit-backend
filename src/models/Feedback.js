const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    message: {
        type: String,
        required: true,
        maxlength: 2000,
        trim: true,
    },
}, {
    timestamps: true, // automatically adds createdAt and updatedAt
});

module.exports = mongoose.model('Feedback', feedbackSchema);
