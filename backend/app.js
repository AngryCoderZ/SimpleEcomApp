const express = require('express');
require('dotenv').config();
require("./db/conn")

const app = express();
const authRoutes = require("./routes/auth")


const port = process.env.PORT || 9000;

// app.use("/", (req, res) => {
//     res.send("Hello World!!")
// })

app.use(express.json())
app.use('/api', authRoutes)

app.listen(port, () => {
    console.log(`App is running on ${port}`)
})
