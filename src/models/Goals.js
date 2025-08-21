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
            max: 10000,
            min: 500,
        },
        water: {
            type: Number,
            default: 8,
            required: true,
            max: 24,
            min: 2,
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
            min: 2,
            max: 24,
        },
        steps: {
            type: Number,
            default: 10000,
            min: 500,
            required: true,
            max: 100000,
        },
    }, {
        timestamps: true
    }
)


module.exports = mongoose.model('Goals', goalsSchema)