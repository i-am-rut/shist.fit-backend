const WeightEntry = require("../models/WeigthEntry");
const maintainWeightEntries = require("../utils/maintainWeightEntries");

const addWeight = async (req, res) => {
    try {
        const { weight, date } = req.body;
        const entryDate = date ? new Date(date) : new Date();

        
        const newWeight = new WeightEntry({
            user: req.user._id,
            weight,
            date: entryDate,
        });

        await newWeight.save();

        // if this is the user's first weight entry
        const weightCount = await WeightEntry.countDocuments({ user: req.user._id });
        if (weightCount === 1) {
            await User.findByIdAndUpdate(req.user._id, { weight });
        }

        res.status(201).json({
            message: "Weight entry added successfully.",
            entry: newWeight
        });

        // Asynchronously
        weightCount !== 1 && maintainWeightEntries(req.user._id).catch(err =>
            console.error("Background weight maintenance failed:", err.message)
        );

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Failed to add weight entry.",
            error: err.message
        });
    }
};


const getWeightEntries = async (req, res) => {
    try {
        
        const entries = await WeightEntry.find({user: req.user._id}).sort({date: 1})

        const formatted = entries.map(entry => ({
            _id: entry._id,
            weight: entry.weight,
            date: entry.date.toISOString().split('T')[0]
        }))

        res.status(200).json(formatted)

    } catch (err) {
        res.status(500).json({message: "Failed to fetch weight entries.", error: err.message})
    }
}

const getCurrentWeight = async (req, res) => {
    try {
        const latestEntry = await WeightEntry.findOne({ user: req.user._id })
            .sort({ date: -1 });

        if (!latestEntry) {
            return res.status(404).json({ message: "No weight entries found." });
        }

        res.json({
            date: latestEntry.date.toISOString().split('T')[0],
            weight: latestEntry.weight
        });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch current weight.", error: err.message });
    }
};


const getWeightPast7Days = async (req, res) => {
    try {
        const today = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 6); // include today hence 6

        const entries = await WeightEntry.find({
            user: req.user._id,
            date: { $gte: sevenDaysAgo, $lte: today }
        }).sort({ date: 1 });

        let lastKnown = await WeightEntry.findOne({
            user: req.user._id,
            date: { $lt: sevenDaysAgo }
        }).sort({ date: -1 });

        const weightsByDate = {};
        entries.forEach(entry => {
            const key = entry.date.toISOString().split('T')[0];
            weightsByDate[key] = entry.weight;
        });

        const result = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(sevenDaysAgo);
            date.setDate(sevenDaysAgo.getDate() + i);
            const key = date.toISOString().split('T')[0];

            if (weightsByDate[key] !== undefined) {
                lastKnown = { weight: weightsByDate[key] };
            }

            result.push({
                date: key,
                weight: lastKnown ? lastKnown.weight : null
            });
        }

        res.json(result);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch past 7 days weight.", error: err.message });
    }
};


const deleteWeightEntry = async (req, res) => {
    try {
        const entry = await WeightEntry.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        })

        if(!entry) return res.status(404).json({error: "Entry not found"})
        
        res.status(200).json({message: "Weight entry deleted"})

    } catch (err) {
        res.status(500).json({message: "Failed to delete weight entry", error: err.message})
    }
}

module.exports = {addWeight, getWeightEntries, deleteWeightEntry, getCurrentWeight, getWeightPast7Days}