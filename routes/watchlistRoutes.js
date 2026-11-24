const express = require("express");
const router = express.Router();

const {getWatchlist, addToWatchlist, deleteFromWatchlist} = require("../model/watchlistModel");

router.route("/")
    .get((req, res) => res.json(getWatchlist()))
    .post((req, res) => {
        const{name, ticker, added_at} = req.body || {};
        if(!name || !ticker || !added_at){
            return res.status(400).json({error: "All fields are required"});
    }
    const existing = getWatchlist().find(
        stock => stock.ticker === ticker
    );

    if (existing) {
        return res.status(409).json({
            error: "Stock already exists in watchlist"
        });
    }
    const id = addToWatchlist(name, ticker, added_at);

        return res.status(201).json({
            id,
            name,
            ticker,
            added_at
        });
});

router.route("/:ticker")
    .delete((req, res) => {
        console.log(getWatchlist());
    console.log("Ticker received:", req.params.ticker);
        const deleted = deleteFromWatchlist(req.params.ticker);
        if (!deleted) {
            return res.status(404).json({
                error: "Stock not found in watchlist"
            });
        }

        return res.status(200).json({
            message: "Stock successfully removed from watchlist"
        });
})
module.exports = router;
