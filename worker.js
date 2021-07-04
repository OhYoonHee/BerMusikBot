const {run} = require('@grammyjs/runner');
const {bot} = require('./bot');

;(async function(){
    await run(bot)
    console.log("BOT berjalan pada mode worker")
})();