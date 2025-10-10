const Steps = require("../models/Steps")

const addSteps = async (req, res) => {
    try {

        const { steps, date } = req.body

        if (!steps || typeof steps !== "number") {
            return res.status(400).json({ error: "Invalid steps value" })
        }

        const stepDate = new Date(date || Date.now())
        stepDate.setHours(0, 0, 0, 0)

        const existingSteps = await Steps.findOne({
            user: req.user._id,
            date: stepDate
        })

        if (existingSteps) {
            existingSteps.steps = steps
            await existingSteps.save()
            return res.status(200).json({ message: "Steps updated", steps: existingSteps })
        }

        const newSteps = new Steps({
            user: req.user._id,
            steps,
            date: stepDate
        })

        await newSteps.save()
        res.status(201).json({ message: "Steps added successfully", steps: newSteps })

    } catch (err) {
        res.status(500).json({ message: "Failed to add steps", error: err.message })
    }
}

const getStepsByDate = async (req, res) => {
    try {
        const { date } = req.query

        if (!date) {
            return res.status(400).json({ error: "Date is required" })
        }

        const queryDate = new Date(date)
        queryDate.setHours(0, 0, 0, 0)

        const steps = await Steps.findOne({
            user: req.user._id,
            date: queryDate
        })

        if (!steps) {
            return res.status(404).json({ error: `No steps logged on ${queryDate.toDateString()}` })
        }

        res.status(200).json({ steps })
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch steps info", error: err.message })
    }
}

const getStepsByRange = async (req, res) => {
    try {
        const { range } = req.query
        const userId = req.user._id

        let startDate, endDate
        const now = new Date()

        switch (range) {
            case 'today':
                startDate = new Date(now)
                startDate.setHours(0, 0, 0, 0)
                endDate = new Date(now)
                endDate.setHours(23, 59, 59, 999)
                break

            case 'week':
                const dayOfWeek = now.getDay() // 0 (Sun) to 6 (Sat)
                const monday = new Date(now)
                monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7))
                monday.setHours(0, 0, 0, 0)
                startDate = monday

                const sunday = new Date(monday)
                sunday.setDate(monday.getDate() + 6)
                sunday.setHours(23, 59, 59, 999)
                endDate = sunday
                break

            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1)
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
                break

            case 'past7days':
                endDate = new Date(now)
                endDate.setHours(23, 59, 59, 999)
                startDate = new Date(now)
                startDate.setDate(now.getDate() - 6)
                startDate.setHours(0, 0, 0, 0)
                break

            default:
                return res.status(400).json({ error: "Invalid range parameter. Use one of: today, week, month, past7days" })
        }

        const steps = await Steps.find({
            user: userId,
            date: { $gte: startDate, $lte: endDate }
        }).sort({ date: 1 })

        res.status(200).json({
            steps,
            range,
            from: startDate,
            to: endDate
        })

    } catch (err) {
        res.status(500).json({ message: "Failed to fetch steps", error: err.message })
    }
}

module.exports = {
    addSteps,
    getStepsByDate,
    getStepsByRange
}