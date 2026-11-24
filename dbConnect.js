const{ DatabaseSync} = require("node:sqlite");
const db = new DatabaseSync("../companies.db");
const db2 = new DatabaseSync("../watchlist.db");

db.exec(`
    CREATE TABLE IF NOT EXISTS companies (
        id INTEGER PRIMARY KEY,
        cik TEXT NOT NULL,
        ticker TEXT NOT NULL,
        name TEXT NOT NULL
        )
    `);

db2.exec(`
    CREATE TABLE IF NOT EXISTS watchlist (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        ticker TEXT NOT NULL,
        added_at TEXT NOT NULL
        )
    `);

module.exports = {db, db2};
