const mongoose = require("mongoose")

const goalsStatusSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    date: {
        type: Date,
        default: () => {
            const today = new Date().setHours(0, 0, 0, 0)
            return today
        },
    },
    calorie: {
        status: {
            type: String,
            enum: ['pending', 'completed'],
            default: 'pending',
        },
    },
    water: {
        status: {
            type: String,
            enum: ['pending', 'completed'],
            default: 'pending',
        },
    },
    weight: {
        status: {
            type: String,
            enum: ['pending', 'completed'],
            default: 'pending',
        },
    },
    sleep: {
        status: {
            type: String,
            enum: ['pending', 'completed'],
            default: 'pending',
        },
    },
    steps: {
        status: {
            type: String,
            enum: ['pending', 'completed'],
            default: 'pending',
        },
    },
},
    {
        timestamps: true,
    }
)


module.exports = mongoose.model('GoalsStatus', goalsStatusSchema)