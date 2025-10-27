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

const getLastNightSleepEntry = async (req, res) => {
    try {
        // Find the most recent sleep entry, sorted by sleepStart descending (latest first)
        const lastEntry = await SleepEntry.findOne({ user: req.user._id }).sort({ sleepStart: -1 });

        if (!lastEntry) {
            return res.status(404).json({ message: "No sleep entries found." });
        }

        // Format the entry before sending
        const formattedEntry = {
            _id: lastEntry._id,
            sleepStart: lastEntry.sleepStart,
            sleepEnd: lastEntry.sleepEnd,
            duration: lastEntry.duration.toFixed(2),
            date: lastEntry.date.toISOString().split('T')[0]
        };

        res.status(200).json(formattedEntry);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch last sleep entry", error: err.message });
    }
};

const getSleepPast7Days = async (req, res) => {
    try {
        const today = new Date();
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            days.push(d.toISOString().split('T')[0]);
        }

        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 6);

        const entries = await SleepEntry.find({
            user: req.user._id,
            sleepStart: { $gte: sevenDaysAgo }
        }).sort({ sleepStart: -1 });

        // Create a map of date string to entry
        const entryMap = {};
        entries.forEach(entry => {
            const dateKey = entry.date.toISOString().split('T')[0];
            entryMap[dateKey] = entry;
        });

        // Build results array with entries or zeros
        const results = days.map(dateStr => {
            if (entryMap[dateStr]) {
                const entry = entryMap[dateStr];
                return {
                    _id: entry._id,
                    sleepStart: entry.sleepStart,
                    sleepEnd: entry.sleepEnd,
                    duration: entry.duration.toFixed(2),
                    date: dateStr
                };
            } else {
                // No sleep entry logged this day
                return {
                    _id: null,
                    sleepStart: null,
                    sleepEnd: null,
                    duration: "0.00",
                    date: dateStr
                };
            }
        });

        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch sleep entries for past 7 days", error: err.message });
    }
};



const deleteSleepEntry = async (req, res) => {
    try {
        const entry = await SleepEntry.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        })

        if(!entry) res.status(404).json({error: "Entry not found"})

        res.json({message: "Sleep entry deleted"})

    } catch (err) {
        res.status(500).json({message: "Failed to delete entry", error: err.message})
    }
}

module.exports = {addSleep, getSleepEntries, deleteSleepEntry, getLastNightSleepEntry, getSleepPast7Days}