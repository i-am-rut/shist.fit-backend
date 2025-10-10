const validator = require("validator")

const validateSignUpData = (req) => {
    const {name, email, password, rePassword} = req.body
    if(password !== rePassword) throw new Error("Passwords do not match.");
    
    if(!name || name.length < 2) {
        throw new Error("Name is not valid.")
    } else if (!validator.isEmail(email)) {
        throw new Error("Email is not valid.");
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Please enter a strong password!");
    }
}

const validateGoalsInput = (calorie, water, weight, sleep, steps) => {
    return calorie && water && weight && sleep && steps
}

module.exports = {validateSignUpData, validateGoalsInput}