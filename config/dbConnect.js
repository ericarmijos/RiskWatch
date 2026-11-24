const{ DatabaseSync} = require("node:sqlite");
const path = require("path");

const db = new DatabaseSync("./config/companies.db");
const db2 = new DatabaseSync("./config/watchlist.db");

db.exec(`
    CREATE TABLE IF NOT EXISTS companies (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        ticker TEXT NOT NULL,
        cik TEXT NOT NULL,
        industry TEXT NOT NULL
        )
    `);

db2.exec(`
    CREATE TABLE IF NOT EXISTS watchlist (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        ticker TEXT NOT NULL,
        added_at TEXT NOT NULL
        )
    `);

module.exports = {db, db2};
