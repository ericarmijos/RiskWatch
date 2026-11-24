
const express = require("express");
const router = express.Router();

const {getCompanies, getCompany, addCompany} = require("../model/companyModel");

router.route("/")
    .get((req, res) => {
        return res.json(getCompanies());
    })
    .post((req, res) => {
        const { title, ticker, cik, industry } = req.body || {};

        if (!title || !ticker || !cik) {
            return res.status(400).json({
                error: "title, ticker, and CIK are required"
            });
        }

        const existing = getCompanies().find(
            company => company.ticker === ticker
        );

        if (existing) {
            return res.status(409).json({
                error: "Company already exists"
            });
        }

        const id = addCompany(title, ticker, cik, industry);

        return res.status(201).json({
            id,
            title,
            ticker,
            cik,
            industry
        });
    });

router.route("/:ticker")
    .get((req, res) => {
        const company = getCompany(req.params.ticker);

        if (!company) {
            return res.status(404).json({
                error: "Company not found"
            });
        }

        return res.status(200).json(company);
    });

module.exports = router;
