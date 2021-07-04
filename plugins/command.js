const {Composer, InputFile, InlineKeyboard} = require('grammy')
const {joox, generateInline, generateText} = require('../lib')
const search = new Composer()

search.on('message:text', async function (ctx, next){
    var regex = /^\/([^@\s]+)@?(?:(\S+)|)\s?([\s\S]+)?$/i
    if(!regex.exec(ctx.msg.text)){
         await next()
         return;
    }
    var [_, cmd, tag, arg] = regex.exec(ctx.msg.text)
    var command_bot = ['start', 'ping','search']
    if(!command_bot.includes(cmd)){
        await next()
        return;
    }
    if(tag&&tag.toLowerCase() != ctx.me.username.toLowerCase()){
        await next()
        return;
    }
    cmd = cmd.toLowerCase()
    if(cmd == "start"){
            var keyboard = new InlineKeyboard()
            .url('Support Group', "https://t.me/TaRianaBicara")
            var pesan = `Halo nama saya ${ctx.me.first_name}, saya dapat membantu anda mencari lagu dari joox dan mengimkannya ke telegram anda!!\n\nKirim /search <lagu> untuk mencari lagu\nKirim /ping untuk mendpaat ping bot!!\n\nCopyright @Oh_Yoon_Hee`
            await ctx.reply(pesan, {
                reply_to_message_id : ctx.msg.message_id,
                reply_markup : keyboard
            })
            return;
        }
    if(cmd == "ping"){
            return;
        }
    if(cmd == "search"){
        if(ctx.session&&ctx.session.in_upload){
            await ctx.reply("Mohon tunggu sampai proses download terakhir anda selesai!!", {
                reply_to_message_id : ctx.msg.message_id
            })
            return;
        }
            if(!arg||!arg.length){
                var pesan = "Silakan isi judul lagu dalam format /search <judul>"
                await ctx.reply(pesan, {
                    reply_to_message_id : ctx.msg.message_id
                })
                return;
            }
            var wait = await ctx.reply("Mencari lagu....")
            var search = await joox('search', {
                searchParams : {
                    q : arg
                }
            }).json()
            if(!search.songs||!search.songs.length){
                var pesan = `Lagu ${arg} tidak ditemukan dipencarian`
                await ctx.reply(pesan, {
                    reply_to_message_id : ctx.msg.message_id
                })
                return;
            }
            var pesan = generateText(search.songs)
            var keyboard = generateInline(search.songs)
            await ctx.reply(pesan, {
                reply_to_message_id : ctx.msg.message_id,
                reply_markup : keyboard
            })
            await ctx.api.deleteMessage(ctx.chat.id, wait.message_id)
            return;
        }
})

module.exports = search