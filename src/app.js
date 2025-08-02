const express = require("express")
const dotenv = require("dotenv")

//load environment variables
dotenv.config()
//create server
const app = express()

app.use("/", (req, res) => {
    res.send("This is a response")
})

//listen to the server requests 
app.listen(process.env.PORT, ()=>{
    console.log(`Shist.fit server is running on port:${process.env.PORT}`)
})