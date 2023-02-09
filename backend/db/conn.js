const mongoose = require("mongoose")
mongoose.set('strictQuery', false)

mongoose.connect(process.env.DB)
.then(()=>console.log("db connection successful"))
.catch(err=>console.log(err))