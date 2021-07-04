const express = require('express')
const app = express()
const {bot} = require('./bot')

app.use(express.json())
app.post(`/bot/${bot.token}`, async (req, res)=>{
    var body = JSON.parse(req.body)
    bot.handleUpdate(body)
    return res.json({ok : true})
})

var {PORT=3000} = process.env
app.listen(PORT, ()=>{
    console.log("BOT Running on webhook mode.")
})


//bot.api.setWebhook(url_deploy+/bot/bot.token)