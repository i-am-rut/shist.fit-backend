const WaterLog = require("../models/WaterLog")

const logWater = async (req, res) => {
    try {
        const { glasses, date } = req.body;
        const userId = req.user._id;

        if (!glasses || glasses <= 0) {
            return res.status(400).json({ error: "Glasses must be a positive number." });
        }

        const entryDate = date ? new Date(date) : new Date();
        entryDate.setHours(0, 0, 0, 0);

        // First, find if there's an existing log
        const existing = await WaterLog.findOne({ user: userId, date: entryDate });

        if (existing) {
            const newTotal = existing.glasses + glasses;
            if (newTotal > 24) {
                return res.status(400).json({
                    error: "Your water intake is getting more than 6 liters per day. This may be harmful for your health."
                });
            }

            // Atomic increment update
            const updated = await WaterLog.findOneAndUpdate(
                { user: userId, date: entryDate },
                { $inc: { glasses } },
                { new: true }
            );

            return res.status(200).json({ message: "Water entry updated", entry: updated });
        } else {
            if (glasses > 24) {
                return res.status(400).json({
                    error: "Your water intake is getting more than 6 liters per day. This may be harmful for your health."
                });
            }

            const newEntry = new WaterLog({ user: userId, glasses, date: entryDate });
            await newEntry.save();

            return res.status(201).json({ message: "Water entry created", entry: newEntry });
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to log water", error: err.message });
    }
};


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

const getTodaysWater = async (req, res) => {
    try {
        const userId = req.user._id;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        // Find today’s log
        const log = await WaterLog.findOne({
            user: userId,
            date: { $gte: today, $lt: tomorrow }
        });

        const glasses = log ? log.glasses : 0;

        res.status(200).json({
            date: today.toISOString().split('T')[0],
            glasses
        });

    } catch (err) {
        res.status(500).json({
            message: "Failed to fetch today's water intake",
            error: err.message
        });
    }
};

const getPast7DaysWater = async (req, res) => {
    try {
        const userId = req.user._id;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 6); // 7 days including today

        // Fetch logs for past 7 days
        const logs = await WaterLog.find({
            user: userId,
            date: { $gte: startDate, $lte: today }
        }).sort({ date: 1 });

        // Map logs by date string
        const logMap = {};
        logs.forEach(log => {
            const dateKey = new Date(log.date).toISOString().split("T")[0];
            logMap[dateKey] = log.glasses;
        });

        // Generate list of last 7 days and fill missing with 0
        const result = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(startDate);
            d.setDate(startDate.getDate() + i);
            const dateStr = d.toISOString().split("T")[0];

            result.push({
                date: dateStr,
                glasses: logMap[dateStr] || 0
            });
        }

        res.status(200).json(result);

    } catch (err) {
        res.status(500).json({
            message: "Failed to fetch past 7 days water logs",
            error: err.message
        });
    }
};


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

module.exports = {logWater, getWaterLogs, deleteWaterEntry, getTodaysWater, getPast7DaysWater}