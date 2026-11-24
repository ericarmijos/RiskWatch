
const SEC_URL = "https://www.sec.gov/files/company_tickers.json";

async function searchSECCompanies(searchTerm) {
    const response = await fetch(SEC_URL, {
        headers: {
            "User-Agent": "RiskWatch YourName your-real-email@example.com"
        }
    });

    if (!response.ok) {
        throw new Error(`SEC lookup failed: ${response.status}`);
    }

    const data = await response.json();

    const query = searchTerm.trim().toLowerCase();

    return Object.values(data)
        .filter(company =>
            !query ||
            company.title.toLowerCase().includes(query) ||
            company.ticker.toLowerCase().includes(query)
        )
        .slice(0, 20)
        .map(company => ({
            cik: String(company.cik_str).padStart(10, "0"),
            ticker: company.ticker,
            title: company.title
        }));
}

module.exports = { searchSECCompanies };
