const {db2} = require("../config/dbConnect");

function addToWatchlist(name, ticker, added_at){
    db2.prepare(`
        INSERT INTO watchlist (name, ticker, added_at)
        VALUES (?,?,?)
        `).run(name, ticker, added_at);
}

function deleteFromWatchlist(ticker) {
    console.log("Database rows:",
        db2.prepare("SELECT * FROM watchlist").all()
    );
    const result = db2.prepare(
        "DELETE FROM watchlist WHERE UPPER(ticker) = UPPER(?)"
    ).run(ticker);
    console.log("Rows deleted:", result.changes);
    return result.changes;
}

function getWatchlist(){
    return db2.prepare("SELECT * FROM watchlist").all(); // return(res): JSON
}

module.exports = {addToWatchlist, getWatchlist, deleteFromWatchlist};
