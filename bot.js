const {Bot, session} = require('grammy')
const config = require('./config')
const command = require('./plugins/command')
const callback = require('./plugins/callback')
const bot = new Bot(config.BOT_TOKEN)

bot.use(session({
    initial(){
        return {in_upload : undefined}
    }
}))

bot.catch(async(e)=>{
    ctx.in_upload = undefined
    await e.ctx.reply("Telah terjadi errror waoooo")
})

bot.use(async (ctx, next)=>{
    try{
        command.middleware()(ctx, next)
    }catch(e){
        ctx.in_upload = undefined
        await e.ctx.reply("Telah terjadi errror waoooo")
    }
})
bot.use(async (ctx, next)=>{
    callback.middleware()(ctx, next)
})

module.exports = {
    bot
}