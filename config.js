require('dotenv').config()
let {BOT_TOKEN, CHANNEL_DB} = process.env
var env = {
        BOT_TOKEN,
        CHANNEL_DB : Number(CHANNEL_DB)
}
module.exports = env
