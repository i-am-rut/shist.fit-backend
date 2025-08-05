const mongoose = require("mongoose")

const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log(`Connected to the database.`)
    }catch(err) {
        console.error(`Failed to connect to DB`, err)
        throw err
    }
}

module.exports = connectToDB