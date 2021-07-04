const express = require('express')
const app = express()
const {bot} = require('./bot')
const {webhookCallback} = require('grammy')
app.use(express.json())
app.use(webhookCallback(bot))

var {PORT=3000} = process.env
app.listen(PORT, ()=>{
    console.log("BOT Running on webhook mode.")
})