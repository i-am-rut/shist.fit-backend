const requireAuth = require("../middlewares/authMiddleware")
const SleepEntry = require("../models/SleepEntry")

const addSleep = async (req, res) => {
    try {
        const {sleepStart, sleepEnd} = req.body;

        const start = new Date(sleepStart)
        const end = new Date(sleepEnd)
        const durationInHours = Math.abs((end - start)/36e5)
        
        const newSleep = new SleepEntry({
            user: req.user._id,
            sleepStart: start,
            sleepEnd: end,
            duration: durationInHours,
            date: start
        })

        await newSleep.save()

        res.status(201).json({message: "Sleep entry added", entry: newSleep})
    } catch (err) {
        res.status(500).json({message: "Failed to add sleep entry", error: err.message})       
    }
}

const getSleepEntries = async(req, res) => {
    try {
        const entries = SleepEntry.find({user: req.user._id}).sort({sleepStart: -1})

        const formatted = entries.map(entry => ({
            _id: entry._id,
            sleepStart: entry.sleepStart,
            sleepEnd: entry.sleepEnd,
            duration: entry.duration.toFixed(2),
            date: entry.date.toISOString().split('T')[0]
        }))

        res.json(formatted)
    } catch (err) {
        res.status(500).json({message: "Failed to fetch sleep entries", error: err.message})
    }
}


const deleteSleepEntry = async (req, res) => {
    try {
        const entry = await SleepEntry.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        })

        if(!entry) res.status(404).json({message: "Entry not found"})

        res.json({message: "Sleep entry deleted"})

    } catch (err) {
        res.status(500).json({message: "Failed to delete entry", error: err.message})
    }
}

module.exports = {addSleep, getSleepEntries, deleteSleepEntry}