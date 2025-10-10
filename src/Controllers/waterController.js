const WaterLog = require("../models/WaterLog")

const logWater = async (req, res) => {
    try {
        
        const {glasses, date} = req.body
        const userId = req.user._id
        const entryDate = date ? new Date(date).setHours(0, 0, 0, 0) : new Date().setHours(0, 0, 0, 0)

        let entry = await WaterLog.findOne({user: userId, date: entryDate})

        if(entry) {
            if(entry.glasses + glasses < 24){
                entry.glasses += glasses
            }else {
                console.log(entry.glasses += glasses)
                return res.status(400).json({error: 'Your water intake is getting more that 6 liters per day this may be harmful for your health.'})
            }
        } else {
            entry = new WaterLog({user: userId, glasses, date:entryDate})
        }

        await entry.save()
        res.status(200).json({message: "Water entry logged", entry})

    } catch (err) {
        res.status(500).json({message: "Failed to log water", error: err.message})        
    }
}

const getWaterLogs = async (req, res) => {
    try {
        
        const logs = await WaterLog.find({user: req.user._id}).sort({date: 1})

        if(logs.length === 0 || !logs) {
            return res.status(404).json({error: "Logs do not exist"})
        }

        const formatted = logs.map(log => ({
            _id: log._id,
            date: new Date(log.date).toISOString().split('T')[0],
            glasses: log.glasses
        }))

        res.status(200).json(formatted)

    } catch (err) {
        res.status(500).json({message: "Failed to fetch water logs", error: err.message})
    }
}

const deleteWaterEntry = async (req, res) => {
  try {
    const deleted = await WaterLog.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!deleted) {
      return res.status(404).json({ error: 'Water entry not found' });
    }

    res.json({ message: 'Water entry deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete entry', error: err.message });
  }
}

module.exports = {logWater, getWaterLogs, deleteWaterEntry}