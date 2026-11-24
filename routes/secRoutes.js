const express = require("express");
const router = express.Router();

const {
    searchSECCompanies
} = require("../services/secService");

router.get("/search", async (req, res) => {
    try {
        const companies = await searchSECCompanies(req.query.q || "");
        res.json(companies);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "SEC search failed"
        });
    }
});

module.exports = router;

