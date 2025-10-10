const mongoose = require("mongoose")

const stepsSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    steps: {
        type: Number,
        required: true,
        default: 0,
    },
    date: {
        type: Date,
        default: Date.now,
        required: true,
    },
}, { timestamps: true })

module.exports = mongoose.model('Steps', stepsSchema)