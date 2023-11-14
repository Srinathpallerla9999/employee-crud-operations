const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const PORT = process.env.PORT || 3000
const user = require("./routes/user")
const employee = require("./routes/employeeDetails")

const mongoose = require("mongoose");
const db = "Your MongoDb Link";

mongoose.connect(db)
.then(() => console.log('Connected Successfully'))
.catch((err) => { console.error(err); });


const app = express()
app.use(bodyParser.json())
app.use(cors({origin:true}))

app.use('', user);
app.use('', employee);


app.get("/", (req, res) => {
    res.send("Hello from the server")
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})