class db{
    constructor(needfs){
        this.db = needfs
    }
    async save(fsp){
        var json = JSON.stringify(this.db, null, 2)
        await fsp.writeFile('./database/db.json', json)
        return true
    }
};


module.exports = {
    db
}