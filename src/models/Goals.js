const mongoose = require("mongoose")

const goalsSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        calorie: {
            type: Number,
            default: 2000,
        },
        water: {
            type: Number,
            default: 8,
            required: true,
        },
        weight: {
            type: Number,
            required: true,
            min: 3,
            max: 500,
        },
        sleep: {
            type: Number,
            default: 8,
            required: true,
        },
        steps: {
            type: Number,
            default: 10000,
            min: 1000,
            required: true,
        },
    }, {
        timestamps: true
    }
)


module.exports = mongoose.model('Goals', goalSchema)