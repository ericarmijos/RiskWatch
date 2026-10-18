// main.js
// Shared script loaded by every page (index, search, company, compare, watchlist).
// Each block checks that its elements exist before using them, since not
// every page has every element (e.g. only compare.html has filter buttons).

// ----- Mobile navigation toggle -----
const navToggle = document.getElementById("nav-toggle");
const navLinks = document.getElementById("nav-links");

if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
        // Toggle the "show" class to open/close the menu on small screens
        navLinks.classList.toggle("show");

        // Keep the aria-expanded attribute in sync for accessibility
        const isOpen = navLinks.classList.contains("show");
        navToggle.setAttribute("aria-expanded", isOpen);
    });
}

// ----- Auto-updating footer year -----
// Reads the year from the browser instead of hardcoding it in the HTML
const yearSpan = document.getElementById("year");

if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

// =========================================================================
// Shared helpers (used by more than one page)
// =========================================================================

// Counts how many risks were new, removed, and edited for one company.
// Several pages show these numbers, so the counting lives in one place.
function countChanges(ticker) {
    const counts = { newCount: 0, removedCount: 0, editedCount: 0 };

    for (const change of riskChanges) {
        if (change.ticker === ticker) {
            if (change.status === "new") {
                counts.newCount += 1;
            } else if (change.status === "removed") {
                counts.removedCount += 1;
            } else if (change.status === "edited") {
                counts.editedCount += 1;
            }
        }
    }

    return counts;
}

// Looks up one company object by its ticker, e.g. "ACME".
// Returns undefined if no company has that ticker.
function findCompany(ticker) {
    // Stretch: .find() returns the first item where the function returns true
    return companies.find(function (company) {
        return company.ticker === ticker;
    });
}

// Makes one small colored label like "+3 new".
// The CSS class decides the color (green, red, or yellow).
function createBadge(text, className) {
    const badge = document.createElement("span");
    badge.classList.add("badge");
    badge.classList.add(className);
    badge.textContent = text;
    return badge;
}

// Builds one company card: name, which years, colored counts, and a button.
// Returns the card so the caller decides where to put it on the page.
function createCompanyCard(company) {
    const counts = countChanges(company.ticker);

    const card = document.createElement("article");
    card.classList.add("company-card");

    // Company name links to its company page, e.g. company.html?ticker=ACME
    const heading = document.createElement("h3");
    const nameLink = document.createElement("a");
    nameLink.textContent = `${company.name} (${company.ticker})`;
    nameLink.setAttribute("href", `company.html?ticker=${company.ticker}`);
    heading.appendChild(nameLink);
    card.appendChild(heading);

    const subtitle = document.createElement("p");
    subtitle.classList.add("card-meta");
    subtitle.textContent = `${newestYear} vs ${previousYear} report`;
    card.appendChild(subtitle);

    const badges = document.createElement("div");
    badges.classList.add("badges");
    badges.appendChild(createBadge(`+${counts.newCount} new`, "badge-new"));
    badges.appendChild(createBadge(`-${counts.removedCount} removed`, "badge-removed"));
    badges.appendChild(createBadge(`${counts.editedCount} edited`, "badge-edited"));
    card.appendChild(badges);

    const viewLink = document.createElement("a");
    viewLink.textContent = "View changes";
    viewLink.setAttribute("href", `compare.html?ticker=${company.ticker}`);
    viewLink.classList.add("btn");
    viewLink.classList.add("btn-primary");
    card.appendChild(viewLink);

    return card;
}

// =========================================================================
// Home page (index.html)
// =========================================================================

// ----- "Recently filed reports" cards -----
// One card per company, built from the companies array in data.js
const recentCards = document.getElementById("recent-cards");

if (recentCards) {
    companies.forEach(function (company) {
        const card = createCompanyCard(company);
        recentCards.appendChild(card);
    });
}

// =========================================================================
// Search page (search.html)
// =========================================================================

// Returns true if the company's name or ticker contains the search text.
// Both sides are lowercased so "acme", "ACME", and "Acme" all match.
function matchesSearch(company, query) {
    const name = company.name.toLowerCase();
    const ticker = company.ticker.toLowerCase();
    return name.includes(query) || ticker.includes(query);
}

// Builds one row in the results list: name, details, and an Open button
function createResultItem(company) {
    const item = document.createElement("li");
    item.classList.add("result-item");

    const info = document.createElement("div");

    const heading = document.createElement("h3");
    const nameLink = document.createElement("a");
    nameLink.textContent = `${company.name} (${company.ticker})`;
    nameLink.setAttribute("href", `company.html?ticker=${company.ticker}`);
    heading.appendChild(nameLink);
    info.appendChild(heading);

    // reports[0] is the newest report, because data.js lists newest first
    const details = document.createElement("p");
    details.classList.add("card-meta");
    details.textContent = `${company.industry} · ${company.reports.length} annual reports · Latest: ${company.reports[0].year}`;
    info.appendChild(details);

    item.appendChild(info);

    const openLink = document.createElement("a");
    openLink.textContent = "Open company";
    openLink.setAttribute("href", `company.html?ticker=${company.ticker}`);
    openLink.classList.add("btn");
    openLink.classList.add("btn-primary");
    item.appendChild(openLink);

    return item;
}

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const searchResults = document.getElementById("search-results");
const resultCount = document.getElementById("result-count");

// Clears the list, then adds back only the companies that match.
// Rebuilding from data.js each time is simpler than hiding rows one by one.
function showSearchResults(typedText) {
    const query = typedText.trim().toLowerCase();
    let matchCount = 0;

    // Setting textContent to "" removes every old row from the list
    searchResults.textContent = "";

    companies.forEach(function (company) {
        if (matchesSearch(company, query)) {
            searchResults.appendChild(createResultItem(company));
            matchCount += 1;
        }
    });

    // Tell the user what they are looking at, including when nothing matched
    if (matchCount === 0) {
        resultCount.textContent = `No companies match "${typedText.trim()}". Try ACME, NWND, or BLPK.`;
    } else if (query === "") {
        resultCount.textContent = `Showing all ${matchCount} companies.`;
    } else {
        resultCount.textContent = `${matchCount} result(s) for "${typedText.trim()}".`;
    }
}

if (searchForm && searchInput && searchResults && resultCount) {
    // Stretch: URLSearchParams reads the "?q=acme" part of the address,
    // which is how the home page's search form passes along what was typed
    const params = new URLSearchParams(window.location.search);
    const startingQuery = params.get("q");

    if (startingQuery) {
        searchInput.value = startingQuery;
    }

    // Show results right away (all companies if nothing was passed in)
    showSearchResults(searchInput.value);

    // Stretch: the "input" event fires on every keystroke, not just on submit,
    // so the list filters live as the user types
    searchInput.addEventListener("input", function () {
        showSearchResults(searchInput.value);
    });

    // Pressing Enter would normally reload the page; the list is already
    // up to date, so just stop the reload
    searchForm.addEventListener("submit", function (event) {
        event.preventDefault();
        showSearchResults(searchInput.value);
    });
}

// =========================================================================
// Company page (company.html)
// =========================================================================

// Builds the list of risk paragraphs in one year's report.
// The prototype only stores text for the newest pair of years:
//   newest year   = every paragraph that was not removed (uses newText)
//   previous year = every paragraph that was not new     (uses oldText)
// Older years return an empty array.
function getRisksForYear(ticker, year) {
    const risks = [];

    for (const change of riskChanges) {
        if (change.ticker === ticker) {
            if (year === newestYear && change.status !== "removed") {
                risks.push({ title: change.title, text: change.newText });
            } else if (year === previousYear && change.status !== "new") {
                risks.push({ title: change.title, text: change.oldText });
            }
        }
    }

    return risks;
}

// Builds one report row with a "Read risks" button that shows or hides
// that year's risk paragraphs underneath it
function createReportItem(ticker, report) {
    const item = document.createElement("li");
    item.classList.add("report-item");

    const row = document.createElement("div");
    row.classList.add("report-row");

    const info = document.createElement("div");
    const heading = document.createElement("h3");
    heading.textContent = `${report.year} Annual Report`;
    info.appendChild(heading);

    const details = document.createElement("p");
    details.classList.add("card-meta");
    details.textContent = `Filed ${report.filed} · Risk Factors: ${report.paragraphs} paragraphs`;
    info.appendChild(details);
    row.appendChild(info);

    const toggleButton = document.createElement("button");
    toggleButton.setAttribute("type", "button");
    toggleButton.setAttribute("aria-expanded", "false");
    toggleButton.classList.add("btn");
    toggleButton.classList.add("btn-secondary");
    toggleButton.textContent = "Read risks";
    row.appendChild(toggleButton);

    item.appendChild(row);

    // The paragraphs start hidden; the "hidden" class sets display: none
    const riskList = document.createElement("div");
    riskList.classList.add("risk-list");
    riskList.classList.add("hidden");

    const risks = getRisksForYear(ticker, report.year);

    if (risks.length === 0) {
        const message = document.createElement("p");
        message.textContent = `Sample risk text is only included for ${newestYear} and ${previousYear} in this prototype.`;
        riskList.appendChild(message);
    } else {
        risks.forEach(function (risk) {
            const paragraph = document.createElement("div");
            paragraph.classList.add("risk-paragraph");

            const title = document.createElement("h4");
            title.textContent = risk.title;
            paragraph.appendChild(title);

            const text = document.createElement("p");
            text.textContent = risk.text;
            paragraph.appendChild(text);

            riskList.appendChild(paragraph);
        });
    }

    item.appendChild(riskList);

    // Same toggle idea as the hamburger menu: flip a class, then update
    // the button text and aria-expanded to match
    toggleButton.addEventListener("click", function () {
        riskList.classList.toggle("hidden");

        if (riskList.classList.contains("hidden")) {
            toggleButton.textContent = "Read risks";
            toggleButton.setAttribute("aria-expanded", "false");
        } else {
            toggleButton.textContent = "Hide risks";
            toggleButton.setAttribute("aria-expanded", "true");
        }
    });

    return item;
}

const companyName = document.getElementById("company-name");
const companyMeta = document.getElementById("company-meta");
const companyLayout = document.getElementById("company-layout");
const reportList = document.getElementById("report-list");
const watchlistButton = document.getElementById("watchlist-btn");
const watchlistMessage = document.getElementById("watchlist-message");
const compareForm = document.getElementById("compare-form");
const newerSelect = document.getElementById("newer-year");
const olderSelect = document.getElementById("older-year");
const compareError = document.getElementById("compare-error");

// Shows the right button text depending on whether the company is
// already in the watchlist array from data.js
function updateWatchlistButton(ticker) {
    if (watchlist.indexOf(ticker) === -1) {
        watchlistButton.textContent = "+ Add to Watchlist";
    } else {
        watchlistButton.textContent = "✓ On Watchlist";
    }
}

// Adds one <option> per report year to a dropdown
function fillYearSelect(select, reports) {
    reports.forEach(function (report) {
        const option = document.createElement("option");
        option.setAttribute("value", report.year);
        option.textContent = report.year;
        select.appendChild(option);
    });
}

// Fills the page with one company's details, reports, and forms
function showCompanyPage(company) {
    companyName.textContent = `${company.name} (${company.ticker})`;
    companyMeta.textContent = `Industry: ${company.industry} | Annual reports on file: ${company.reports.length}`;
    document.title = `RiskWatch | ${company.name}`;

    company.reports.forEach(function (report) {
        reportList.appendChild(createReportItem(company.ticker, report));
    });

    // ----- Add to / remove from watchlist -----
    // Changes the watchlist array in memory only, so it resets when the
    // user leaves the page (no database until a later milestone)
    updateWatchlistButton(company.ticker);

    watchlistButton.addEventListener("click", function () {
        const position = watchlist.indexOf(company.ticker);

        if (position === -1) {
            watchlist.push(company.ticker);
            watchlistMessage.textContent = `Added ${company.ticker} to your watchlist. (Prototype: this resets when you leave the page.)`;
        } else {
            watchlist.splice(position, 1);
            watchlistMessage.textContent = `Removed ${company.ticker} from your watchlist.`;
        }

        updateWatchlistButton(company.ticker);
    });

    // ----- Compare form -----
    // Default to the two newest reports, since that pair has sample changes
    fillYearSelect(newerSelect, company.reports);
    fillYearSelect(olderSelect, company.reports);
    newerSelect.value = company.reports[0].year;
    olderSelect.value = company.reports[1].year;

    compareForm.addEventListener("submit", function (event) {
        event.preventDefault();

        // A dropdown's value is always a string, so turn it into a number
        // before comparing years
        const newer = Number(newerSelect.value);
        const older = Number(olderSelect.value);

        if (newer <= older) {
            compareError.textContent = "The newer report must be a later year than the older report.";
        } else if (newer !== newestYear || older !== previousYear) {
            compareError.textContent = `This prototype only has sample changes for ${newestYear} vs ${previousYear}.`;
        } else {
            compareError.textContent = "";
            // Go to the compare page for this company
            window.location.href = `compare.html?ticker=${company.ticker}`;
        }
    });
}

// Shown when the address has no ticker, or one that is not in data.js
function showCompanyNotFound() {
    companyName.textContent = "Company not found";
    companyMeta.textContent = "Try searching for ACME, NWND, or BLPK.";
    watchlistButton.classList.add("hidden");

    const searchLink = document.createElement("a");
    searchLink.textContent = "Go to Search";
    searchLink.setAttribute("href", "search.html");
    searchLink.classList.add("btn");
    searchLink.classList.add("btn-secondary");
    watchlistMessage.appendChild(searchLink);

    companyLayout.classList.add("hidden");
}

if (companyName && reportList && watchlistButton && compareForm) {
    const params = new URLSearchParams(window.location.search);
    const company = findCompany(params.get("ticker"));

    if (company) {
        showCompanyPage(company);
    } else {
        showCompanyNotFound();
    }
}
