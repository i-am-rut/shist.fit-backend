const mongoose = require("mongoose")

const weightEntrySchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        weight: {
            type: Number,
            required: true,
        },
        date: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('WeightEntry', weightEntrySchema)