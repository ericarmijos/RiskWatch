
const {db} = require("../config/dbConnect");

function addCompany(title, ticker, cik, industry){
    db.prepare(`
        INSERT INTO companies (title, ticker, cik, industry)
        VALUES (?,?,?,?)
        `).run(title, ticker, cik, industry);
}

function getCompanies(){
    return db.prepare("SELECT * FROM companies").all();
}

function getCompany(ticker){
    return db.prepare(
        "SELECT * FROM companies WHERE UPPER(ticker) = UPPER(?)"
    ).get(ticker);
}

module.exports = {addCompany, getCompanies, getCompany};
