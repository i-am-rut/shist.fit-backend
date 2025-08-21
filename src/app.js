const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const connectToDB = require("./config/database")
const cookieParser = require("cookie-parser")
const authRoutes = require("./routes/authRoutes")
const foodRoutes = require("./routes/foodRoutes")
const sleepRoutes = require("./routes/sleepRoutes")
const weightRoutes = require("./routes/weightRoutes")

dotenv.config()
const app = express()


app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))

app.use('/auth', authRoutes)
app.use("/food", foodRoutes)
app.use("/sleep", sleepRoutes)
app.use('/weight', weightRoutes)

connectToDB()
    .then(() => {
        app.listen(process.env.PORT || 5000, () => {
            console.log(`Listening on port: ${process.env.PORT}`)
        })
    }).catch(err => console.error("Error: ", err))


app.get("/", (req, res) => {
    res.status(200).json({message : "Hello from the server"})
})


