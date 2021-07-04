const got = require('got')
const {InlineKeyboard} = require('grammy')
const joox = got.extend({
    prefixUrl : "http://public-restapi.herokuapp.com/api/joox"
})

function generateInline(songs){
    var keyboard = new InlineKeyboard();
    var n = 1;
    var num = 1
    songs = songs.filter((e, i, a)=>{
        return i <= 19
    })
    for(x of songs){
        var {id} = x
        if(n <= 5){
            keyboard.text(num, `/get ${id}`)   
        }
        if(n > 5){
            keyboard.row()
            keyboard.text(num, `/get ${id}`)
            n = 1
        }
        n++
        num++
    }
    return keyboard
}

function generateText(songs){
    var num = 1
    songs = songs.filter((e, i, a)=>{
        return i <= 19
    })
    var hasil = "JOOX results : \n\n"
    for(x of songs){
        var {title, singerName, duration} = x
        var pesan = [`${num}. ${title}`, `Singer : ${singerName}`, `Duration : ${duration}`, '\n'].join('\n')
        hasil += pesan
        num++
    }
    return hasil
}

module.exports = {
    joox, generateInline, generateText
}