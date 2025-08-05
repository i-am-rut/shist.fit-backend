const express = require("express")
const dotenv = require("dotenv")
const connectToDB = require("./config/database")

dotenv.config()
const app = express()


connectToDB()
    .then(() => {
        app.listen(process.env.PORT || 5000, () => {
            console.log(`Listening on port: ${process.env.PORT}`)
        })
    }).catch(err => console.error("Error: ", err))


app.get("/", (req, res) => {
    res.status(200).json({message : "Hello from the server"})
})


