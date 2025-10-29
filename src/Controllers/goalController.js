const Goals = require("../models/Goals")
const {validateGoalsInput} = require("../utils/validate")

const getGoals = async (req, res) => {
    try {
        const goal = await Goals.find({user: req.user._id})

        if (!goals || goals.length === 0) {
            return res.status(404).json({ error: "Goals not set" })
        }
        
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
                return res.status(400).json({error: "All fields are mandatory"})
            }
        } else {
            return res.status(400).json(null)
        }

    } catch (err) {
        res.status(500).json({message: "Failed to set Goals", error: err.message})
    }
}

const updateGoals = async (req, res) => {
    try {
        const userId = req.user._id;
        const { calorie, water, weight, sleep, steps } = req.body;

        const goals = await Goals.findOne({ user: userId });

        if (!goals) {
            return res.status(404).json({ error: "Goals not found. Please create them first." });
        }

        if (calorie !== undefined) goals.calorie = calorie;
        if (water !== undefined) goals.water = water;
        if (weight !== undefined) goals.weight = weight;
        if (sleep !== undefined) goals.sleep = sleep;
        if (steps !== undefined) goals.steps = steps;

        await goals.save();

        res.status(200).json({
            message: "Goals updated successfully",
            goals
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Failed to update goals",
            error: err.message
        });
    }
};


module.exports = {getGoals, setGoals, updateGoals}