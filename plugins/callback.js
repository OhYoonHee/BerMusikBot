const {Composer, InputFile, InlineKeyboard} = require('grammy');
const fsp = require('fs/promises');
const fs = require('fs')
const got = require('got');
const {joox} = require('../lib');
const search = new Composer();
let dataset = require('../database');
const config = require('../config')

search.on('callback_query:data', async function (ctx, next){
    var data = await fsp.readFile('./database/db.json', 'utf-8')
    var database = new dataset.db(JSON.parse(data))
    var regex = /^\/([^@\s]+)@?(?:(\S+)|)\s?([\s\S]+)?$/i
    if(!regex.exec(ctx.callbackQuery.data)){
         await next()
         return;
    }
    var [_, cmd, tag, arg] = regex.exec(ctx.callbackQuery.data)
    var command_bot = ['get']
    if(!command_bot.includes(cmd)){
        await next()
        return;
    }
    if(tag&&tag.toLowerCase() != ctx.me.username.toLowerCase()){
        await next()
        return;
    }
    if(ctx.session&&ctx.session.in_upload){
        await ctx.answerCallbackQuery({
            show_alert : true,
            text : "Mohon tunggu sampai proses download terakhir anda selesai"
        })
        return;
    }
    cmd = cmd.toLowerCase()
    if(cmd == "get"){
        var db = database.db
        var search = db.music.find((e)=>{
            return e.id == arg
        })
        if(search){
            await ctx.replyWithAudio(search.file_id, {
                caption : "Uploaded by @"+ctx.me.username
            })
            await ctx.deleteMessage()
            ctx.session.in_upload = false
            return;
        }
            await ctx.editMessageText("Mohon tunggu sebentar...")
            ctx.session.in_upload = true
            var search = await joox('show', {
                searchParams : {
                    id : arg
                }
            }).json()
            var result = search[0]
            var title = result.songName
            var singer = result.singerName
            var thumb = result.thumbNail
            var {downloadLinks, lyric} = result
            var {mp3} = downloadLinks
            var filename = `${singer} - ${title}.mp3`
            var buffer = await got(mp3).buffer()
            var file = new InputFile(buffer, filename)
            var tes = await ctx.api.sendAudio(config.CHANNEL_DB, file, {
                thumb,
                performer : singer,
                caption : "Uploaded by @"+ctx.me.username,
                title
            })
            db.music.push({id : arg, file_id : tes.audio.file_id})
            await ctx.replyWithAudio(tes.audio.file_id, {
                thumb,
                performer : singer,
                caption : "Uploaded by @"+ctx.me.username,
                title
            });
            await ctx.deleteMessage()
            await database.save(fsp)
            ctx.session.in_upload = false
            return;
        }
})

module.exports = search
