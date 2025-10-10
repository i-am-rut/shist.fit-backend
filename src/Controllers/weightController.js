const WeightEntry = require("../models/WeigthEntry")

const addWeight = async (req, res) => {
    try {
        const {weight, date} = req.body

        const entryDate = date? new Date(date) : new Date()

        const newWeight = new WeightEntry({
            user: req.user._id,
            weight,
            date: entryDate,
        })

        await newWeight.save()
        res.status(201).json({message: "Weight entry added", entry: newWeight})

    } catch (err) {
        res.status(500).json({message: "Failed to add weight entry", error: err.message})
    }
}

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

module.exports = {addWeight, getWeightEntries, deleteWeightEntry}