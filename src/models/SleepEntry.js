const mongoose = require("mongoose")

const sleepEntrySchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        sleepStart: {
            type: String,
            required: true,
        },
        sleepEnd: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            default: Date.now,
            required: true,
        },
    }, {
        tiemstamps: true
    }
)

module.exports = mongoose.model('SleepEntry', sleepEntrySchema)