const mongoose = require("mongoose")

const waterLogSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        glasses: {
            type: Number,
            required: true,
            min: 1,
        },
        date: {
            type: Date,
            default: () => new Date().setHours(0,0,0,0),
            index: true,
        },
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('WaterLog', waterLogSchema)