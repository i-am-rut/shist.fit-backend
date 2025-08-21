const Goals = require("../models/Goals")
const {validateGoalsInput} = require("../utils/validate")

const getGoals = async (req, res) => {
    try {
        const goal = await Goals.find({user: req.user._id})

        if(!goal) return res.status(404).json({message: "Goals not set"})
        
        res.status(200).json(goal)

    } catch (err) {
        res.status(500).json({message: "Error fetching goals", error: err.message})
    }
}

const setGoals = async (req, res) => {
    try {
        
        const {calorie, water, weight, sleep, steps} = req.body

        const isValidInput = validateGoalsInput(calorie, water, weight, sleep, steps)

        const goals = await Goals.findOne({user: req.user._id})
        if(!goals) {
            if(isValidInput) {
                const goal = new Goals({
                    user: req.user._id,
                    calorie,
                    water,
                    weight,
                    sleep,
                    steps
                })
    
                await goal.save()
    
                res.status(201).json({message: "Goals set successfully!", goal})
            } else {
                return res.status(400).json({message: "All fields are mandatory"})
            }
        } else {
            return res.status(400).json({message: "Goals are set already!"})
        }

    } catch (err) {
        res.status(500).json({message: "Failed to set Goals", error: err.message})
    }
}

const updateGoals = async (req, res) => {
    try {
        
        const {calorie, water, weight, sleep, steps} = req.body

        const goal = await Goals.findOne({user: req.user._id})

        if(!goal) return res.status(404).json({message: "Goals not found"})

        goal.calorie = calorie ?? goal.calorie
        goal.water = water ?? goal.water
        goal.weight = weight ?? goal.weight
        goal.sleep = sleep ?? goal.sleep
        goal.steps = steps ?? goal.steps

        await goal.save()

        res.status(200).json({message: 'Goals updated', goal})

    } catch (err) {
        res.status(500).json({message: "Failed to update goals", error: err.message})
    }
}

module.exports = {getGoals, setGoals, updateGoals}