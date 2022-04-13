const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = process.env.PORT || 3000

// initialize bodyparser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/auth', require('./routes/auth'))

app.get('/', (req, res) => {
    res.send("int list!");
})

app.listen(port, () => {
    console.log(`app listening on port ${port}`)
})