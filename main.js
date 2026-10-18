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

// Counts how many risks were new, removed, edited, and unchanged for one
// company. Several pages show these numbers, so the counting lives in one place.
function countChanges(ticker) {
    const counts = { newCount: 0, removedCount: 0, editedCount: 0, unchangedCount: 0 };

    for (const change of riskChanges) {
        if (change.ticker === ticker) {
            if (change.status === "new") {
                counts.newCount += 1;
            } else if (change.status === "removed") {
                counts.removedCount += 1;
            } else if (change.status === "edited") {
                counts.editedCount += 1;
            } else {
                counts.unchangedCount += 1;
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

// =========================================================================
// Notes helpers (used by the compare page and the notes page)
// =========================================================================

// New notes get the next id after the sample notes in data.js
let nextNoteId = sampleNotes.length + 1;

// Looks up one risk change by its id, e.g. "ACME-3"
function findChange(changeId) {
    // Stretch: .find(), same as findCompany above
    return riskChanges.find(function (change) {
        return change.id === changeId;
    });
}

// Makes the Normal / Important dropdown used by every note form
function createFlagSelect(id) {
    const select = document.createElement("select");
    select.setAttribute("id", id);

    const normalOption = document.createElement("option");
    normalOption.setAttribute("value", "normal");
    normalOption.textContent = "Normal";
    select.appendChild(normalOption);

    const importantOption = document.createElement("option");
    importantOption.setAttribute("value", "important");
    importantOption.textContent = "Important";
    select.appendChild(importantOption);

    return select;
}

// =========================================================================
// Compare page (compare.html)
// =========================================================================

// Turns a status from data.js into the word shown on the page
function getStatusLabel(status) {
    if (status === "new") {
        return "New";
    } else if (status === "removed") {
        return "Removed";
    } else if (status === "edited") {
        return "Edited";
    } else {
        return "Unchanged";
    }
}

// Builds one saved note: its text, plus an "Important" label if flagged
function createNoteItem(note) {
    const item = document.createElement("div");
    item.classList.add("note-item");

    if (note.important) {
        item.appendChild(createBadge("Important", "badge-important"));
    }

    const text = document.createElement("p");
    text.textContent = note.text;
    item.appendChild(text);

    return item;
}

// Builds one side of a change row (the older or the newer report).
// An empty string means the paragraph is not in that year's report.
function createChangeSide(label, text) {
    const side = document.createElement("div");
    side.classList.add("change-side");

    const sideLabel = document.createElement("p");
    sideLabel.classList.add("side-label");
    sideLabel.textContent = label;
    side.appendChild(sideLabel);

    const paragraph = document.createElement("p");
    if (text === "") {
        paragraph.textContent = "Not in this report.";
        paragraph.classList.add("empty-side");
    } else {
        paragraph.textContent = text;
    }
    side.appendChild(paragraph);

    return side;
}

// Builds the hidden "+ Note" form for one change. When saved, the note is
// added to the sampleNotes array (in memory only) and shown under the change.
function createNoteForm(change, notesBox, noteButton) {
    const form = document.createElement("form");
    form.classList.add("note-form");
    form.classList.add("hidden");
    form.setAttribute("novalidate", "");

    // Each label needs a unique id to point at, so the change id is used
    const textGroup = document.createElement("div");
    textGroup.classList.add("form-group");
    const textLabel = document.createElement("label");
    textLabel.setAttribute("for", `note-text-${change.id}`);
    textLabel.textContent = "Your note";
    const textArea = document.createElement("textarea");
    textArea.setAttribute("id", `note-text-${change.id}`);
    textArea.setAttribute("rows", "3");
    textArea.setAttribute("placeholder", "Why does this change matter?");
    textGroup.appendChild(textLabel);
    textGroup.appendChild(textArea);
    form.appendChild(textGroup);

    const flagGroup = document.createElement("div");
    flagGroup.classList.add("form-group");
    const flagLabel = document.createElement("label");
    flagLabel.setAttribute("for", `note-flag-${change.id}`);
    flagLabel.textContent = "Flag";
    const flagSelect = createFlagSelect(`note-flag-${change.id}`);
    flagGroup.appendChild(flagLabel);
    flagGroup.appendChild(flagSelect);
    form.appendChild(flagGroup);

    const saveButton = document.createElement("button");
    saveButton.setAttribute("type", "submit");
    saveButton.classList.add("btn");
    saveButton.classList.add("btn-primary");
    saveButton.textContent = "Save note";
    form.appendChild(saveButton);

    const errorText = document.createElement("p");
    errorText.classList.add("error-message");
    form.appendChild(errorText);

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const noteText = textArea.value.trim();

        if (noteText === "") {
            errorText.textContent = "Please write a note before saving.";
            return;
        }

        const note = {
            id: nextNoteId,
            changeId: change.id,
            text: noteText,
            important: flagSelect.value === "important"
        };
        nextNoteId += 1;
        sampleNotes.push(note);

        notesBox.appendChild(createNoteItem(note));

        // Clear and close the form so it is ready for the next note
        errorText.textContent = "";
        form.reset();
        form.classList.add("hidden");
        noteButton.textContent = "+ Note";
        noteButton.setAttribute("aria-expanded", "false");
    });

    return form;
}

// Builds one color-coded change row: label, title, both years side by
// side, any saved notes, and the "+ Note" button and form.
// The status class (e.g. "change-new") sets the color and is also what the
// filter buttons look for.
function createChangeRow(change) {
    const row = document.createElement("article");
    row.classList.add("change-row");
    row.classList.add(`change-${change.status}`);

    const header = document.createElement("div");
    header.classList.add("change-header");
    header.appendChild(createBadge(getStatusLabel(change.status), `badge-${change.status}`));

    const title = document.createElement("h3");
    title.textContent = change.title;
    header.appendChild(title);

    const noteButton = document.createElement("button");
    noteButton.setAttribute("type", "button");
    noteButton.setAttribute("aria-expanded", "false");
    noteButton.classList.add("btn");
    noteButton.classList.add("btn-secondary");
    noteButton.classList.add("note-btn");
    noteButton.textContent = "+ Note";
    header.appendChild(noteButton);

    row.appendChild(header);

    const sides = document.createElement("div");
    sides.classList.add("change-sides");
    sides.appendChild(createChangeSide(`${previousYear} report (older)`, change.oldText));
    sides.appendChild(createChangeSide(`${newestYear} report (newer)`, change.newText));
    row.appendChild(sides);

    // Show notes that already exist for this change (from data.js)
    const notesBox = document.createElement("div");
    notesBox.classList.add("change-notes");
    sampleNotes.forEach(function (note) {
        if (note.changeId === change.id) {
            notesBox.appendChild(createNoteItem(note));
        }
    });
    row.appendChild(notesBox);

    const noteForm = createNoteForm(change, notesBox, noteButton);
    row.appendChild(noteForm);

    // "+ Note" opens and closes this row's form
    noteButton.addEventListener("click", function () {
        noteForm.classList.toggle("hidden");

        if (noteForm.classList.contains("hidden")) {
            noteButton.textContent = "+ Note";
            noteButton.setAttribute("aria-expanded", "false");
        } else {
            noteButton.textContent = "Close";
            noteButton.setAttribute("aria-expanded", "true");
        }
    });

    return row;
}

const changeList = document.getElementById("change-list");
const compareTitle = document.getElementById("compare-title");
const companyPicker = document.getElementById("company-picker");
const companySelect = document.getElementById("company-select");

// Shows only rows whose status matches the clicked filter ("all" shows every row)
function applyFilter(status) {
    const rows = document.querySelectorAll(".change-row");

    rows.forEach(function (row) {
        if (status === "all" || row.classList.contains(`change-${status}`)) {
            row.classList.remove("hidden");
        } else {
            row.classList.add("hidden");
        }
    });
}

if (changeList && compareTitle && companyPicker && companySelect) {
    // Use ?ticker= from the address; if it is missing (e.g. the Compare nav
    // link) or unknown, fall back to the first company so the page is never empty
    const params = new URLSearchParams(window.location.search);
    let company = findCompany(params.get("ticker"));

    if (!company) {
        company = companies[0];
    }

    compareTitle.textContent = `${company.name} (${company.ticker}): ${newestYear} vs ${previousYear} report`;
    document.title = `RiskWatch | Compare ${company.ticker}`;

    // ----- Company picker -----
    companies.forEach(function (choice) {
        const optionElement = document.createElement("option");
        optionElement.setAttribute("value", choice.ticker);
        optionElement.textContent = `${choice.name} (${choice.ticker})`;
        companySelect.appendChild(optionElement);
    });
    companySelect.value = company.ticker;

    companyPicker.addEventListener("submit", function (event) {
        event.preventDefault();
        window.location.href = `compare.html?ticker=${companySelect.value}`;
    });

    // ----- Summary counts -----
    const counts = countChanges(company.ticker);
    document.getElementById("count-new").textContent = counts.newCount;
    document.getElementById("count-removed").textContent = counts.removedCount;
    document.getElementById("count-edited").textContent = counts.editedCount;
    document.getElementById("count-unchanged").textContent = counts.unchangedCount;

    // ----- Change rows -----
    riskChanges.forEach(function (change) {
        if (change.ticker === company.ticker) {
            changeList.appendChild(createChangeRow(change));
        }
    });

    // ----- Filter buttons -----
    // Each object pairs a button with the status it shows
    const filters = [
        { buttonId: "filter-all", status: "all" },
        { buttonId: "filter-new", status: "new" },
        { buttonId: "filter-removed", status: "removed" },
        { buttonId: "filter-edited", status: "edited" }
    ];
    const filterButtons = document.querySelectorAll(".filter-btn");

    filters.forEach(function (filter) {
        const button = document.getElementById(filter.buttonId);

        button.addEventListener("click", function () {
            applyFilter(filter.status);

            // Move the highlight to the clicked button
            filterButtons.forEach(function (otherButton) {
                otherButton.classList.remove("active-filter");
                otherButton.setAttribute("aria-pressed", "false");
            });
            button.classList.add("active-filter");
            button.setAttribute("aria-pressed", "true");
        });
    });
}

// =========================================================================
// Watchlist & Notes page (watchlist.html): Watchlist section
// =========================================================================

const watchlistBody = document.getElementById("watchlist-body");
const watchlistTable = document.getElementById("watchlist-table");
const watchlistEmpty = document.getElementById("watchlist-empty");
const watchlistAddForm = document.getElementById("watchlist-add-form");
const watchlistAddSelect = document.getElementById("watchlist-add-select");
const watchlistAddButton = document.getElementById("watchlist-add-btn");

// Builds one table row: company, latest report, change counts, and buttons
function createWatchlistRow(company) {
    const counts = countChanges(company.ticker);
    const latestReport = company.reports[0];

    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    const nameLink = document.createElement("a");
    nameLink.textContent = `${company.name} (${company.ticker})`;
    nameLink.setAttribute("href", `company.html?ticker=${company.ticker}`);
    nameCell.appendChild(nameLink);
    row.appendChild(nameCell);

    const reportCell = document.createElement("td");
    reportCell.textContent = `${latestReport.year} (filed ${latestReport.filed})`;
    row.appendChild(reportCell);

    const changesCell = document.createElement("td");
    const badges = document.createElement("div");
    badges.classList.add("badges");
    badges.appendChild(createBadge(`+${counts.newCount} new`, "badge-new"));
    badges.appendChild(createBadge(`-${counts.removedCount} removed`, "badge-removed"));
    badges.appendChild(createBadge(`${counts.editedCount} edited`, "badge-edited"));
    changesCell.appendChild(badges);
    row.appendChild(changesCell);

    const actionsCell = document.createElement("td");
    const actions = document.createElement("div");
    actions.classList.add("table-actions");

    const viewLink = document.createElement("a");
    viewLink.textContent = "View changes";
    viewLink.setAttribute("href", `compare.html?ticker=${company.ticker}`);
    viewLink.classList.add("btn");
    viewLink.classList.add("btn-secondary");
    actions.appendChild(viewLink);

    const removeButton = document.createElement("button");
    removeButton.setAttribute("type", "button");
    removeButton.classList.add("btn");
    removeButton.classList.add("btn-danger");
    removeButton.textContent = "Remove";
    actions.appendChild(removeButton);

    // Take the ticker out of the array, then redraw the whole table
    removeButton.addEventListener("click", function () {
        const position = watchlist.indexOf(company.ticker);
        watchlist.splice(position, 1);
        showWatchlist();
    });

    actionsCell.appendChild(actions);
    row.appendChild(actionsCell);

    return row;
}

// Refills the "Add a company" dropdown with companies that are not watched yet.
// If every company is already watched, the dropdown and button are disabled.
function fillWatchlistAddSelect() {
    watchlistAddSelect.textContent = "";
    let availableCount = 0;

    companies.forEach(function (company) {
        if (watchlist.indexOf(company.ticker) === -1) {
            const option = document.createElement("option");
            option.setAttribute("value", company.ticker);
            option.textContent = `${company.name} (${company.ticker})`;
            watchlistAddSelect.appendChild(option);
            availableCount += 1;
        }
    });

    if (availableCount === 0) {
        const option = document.createElement("option");
        option.setAttribute("value", "");
        option.textContent = "All companies are on your watchlist";
        watchlistAddSelect.appendChild(option);
        watchlistAddSelect.setAttribute("disabled", "");
        watchlistAddButton.setAttribute("disabled", "");
    } else {
        watchlistAddSelect.removeAttribute("disabled");
        watchlistAddButton.removeAttribute("disabled");
    }
}

// Redraws the table from the watchlist array. Called after every add or
// remove, so the page always matches the array.
function showWatchlist() {
    watchlistBody.textContent = "";

    watchlist.forEach(function (ticker) {
        const company = findCompany(ticker);
        if (company) {
            watchlistBody.appendChild(createWatchlistRow(company));
        }
    });

    // Swap the table for a friendly message when nothing is left
    if (watchlist.length === 0) {
        watchlistTable.classList.add("hidden");
        watchlistEmpty.classList.remove("hidden");
    } else {
        watchlistTable.classList.remove("hidden");
        watchlistEmpty.classList.add("hidden");
    }

    fillWatchlistAddSelect();
}

if (watchlistBody && watchlistTable && watchlistAddForm) {
    showWatchlist();

    watchlistAddForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const ticker = watchlistAddSelect.value;
        if (ticker !== "") {
            watchlist.push(ticker);
            showWatchlist();
        }
    });
}

// =========================================================================
// Watchlist & Notes page (watchlist.html): Notes section
// =========================================================================

const addNoteForm = document.getElementById("add-note-form");
const noteChangeSelect = document.getElementById("note-change");
const noteTextInput = document.getElementById("note-text");
const noteFlagSelect = document.getElementById("note-flag");
const noteError = document.getElementById("note-error");
const notesList = document.getElementById("notes-list");
const notesSummary = document.getElementById("notes-summary");

// The id of the note being edited right now, or null if none.
// Only one note can be in edit mode at a time.
let editingNoteId = null;

// Builds the small form that replaces a note's text while editing it
function createNoteEditForm(note) {
    const form = document.createElement("form");
    form.classList.add("note-edit-form");
    form.setAttribute("novalidate", "");

    const textGroup = document.createElement("div");
    textGroup.classList.add("form-group");
    const textLabel = document.createElement("label");
    textLabel.setAttribute("for", `edit-text-${note.id}`);
    textLabel.textContent = "Edit note";
    const textArea = document.createElement("textarea");
    textArea.setAttribute("id", `edit-text-${note.id}`);
    textArea.setAttribute("rows", "3");
    textArea.value = note.text;
    textGroup.appendChild(textLabel);
    textGroup.appendChild(textArea);
    form.appendChild(textGroup);

    const flagGroup = document.createElement("div");
    flagGroup.classList.add("form-group");
    const flagLabel = document.createElement("label");
    flagLabel.setAttribute("for", `edit-flag-${note.id}`);
    flagLabel.textContent = "Flag";
    const flagSelect = createFlagSelect(`edit-flag-${note.id}`);
    if (note.important) {
        flagSelect.value = "important";
    }
    flagGroup.appendChild(flagLabel);
    flagGroup.appendChild(flagSelect);
    form.appendChild(flagGroup);

    const actions = document.createElement("div");
    actions.classList.add("note-actions");

    const saveButton = document.createElement("button");
    saveButton.setAttribute("type", "submit");
    saveButton.classList.add("btn");
    saveButton.classList.add("btn-primary");
    saveButton.textContent = "Save";
    actions.appendChild(saveButton);

    const cancelButton = document.createElement("button");
    cancelButton.setAttribute("type", "button");
    cancelButton.classList.add("btn");
    cancelButton.classList.add("btn-secondary");
    cancelButton.textContent = "Cancel";
    actions.appendChild(cancelButton);

    form.appendChild(actions);

    const errorText = document.createElement("p");
    errorText.classList.add("error-message");
    form.appendChild(errorText);

    // Save: update the note object itself, then leave edit mode
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const newText = textArea.value.trim();
        if (newText === "") {
            errorText.textContent = "A note can't be empty. Use Delete to remove it instead.";
            return;
        }

        note.text = newText;
        note.important = flagSelect.value === "important";
        editingNoteId = null;
        showNotes();
    });

    // Cancel: leave edit mode without changing anything
    cancelButton.addEventListener("click", function () {
        editingNoteId = null;
        showNotes();
    });

    return form;
}

// Builds one note card: which change it is about, the note, and buttons.
// If this note is being edited, the edit form shows instead of the text.
function createNoteCard(note) {
    const change = findChange(note.changeId);

    const card = document.createElement("article");
    card.classList.add("note-card");

    const header = document.createElement("div");
    header.classList.add("note-card-header");
    header.appendChild(createBadge(getStatusLabel(change.status), `badge-${change.status}`));

    const title = document.createElement("h3");
    title.textContent = `${change.ticker}: ${change.title}`;
    header.appendChild(title);

    if (note.important) {
        header.appendChild(createBadge("Important", "badge-important"));
    }
    card.appendChild(header);

    if (note.id === editingNoteId) {
        card.appendChild(createNoteEditForm(note));
        return card;
    }

    const text = document.createElement("p");
    text.textContent = note.text;
    card.appendChild(text);

    const actions = document.createElement("div");
    actions.classList.add("note-actions");

    const viewLink = document.createElement("a");
    viewLink.textContent = "View change";
    viewLink.setAttribute("href", `compare.html?ticker=${change.ticker}`);
    viewLink.classList.add("btn");
    viewLink.classList.add("btn-secondary");
    actions.appendChild(viewLink);

    const editButton = document.createElement("button");
    editButton.setAttribute("type", "button");
    editButton.classList.add("btn");
    editButton.classList.add("btn-secondary");
    editButton.textContent = "Edit";
    actions.appendChild(editButton);

    const deleteButton = document.createElement("button");
    deleteButton.setAttribute("type", "button");
    deleteButton.classList.add("btn");
    deleteButton.classList.add("btn-danger");
    deleteButton.textContent = "Delete";
    actions.appendChild(deleteButton);

    card.appendChild(actions);

    editButton.addEventListener("click", function () {
        editingNoteId = note.id;
        showNotes();
    });

    // indexOf finds this exact note object in the array so splice can remove it
    deleteButton.addEventListener("click", function () {
        const position = sampleNotes.indexOf(note);
        sampleNotes.splice(position, 1);
        showNotes();
    });

    return card;
}

// Redraws every note card from the sampleNotes array, plus the count line.
// Same idea as showWatchlist: change the array, then redraw.
function showNotes() {
    notesList.textContent = "";
    let importantCount = 0;

    sampleNotes.forEach(function (note) {
        notesList.appendChild(createNoteCard(note));
        if (note.important) {
            importantCount += 1;
        }
    });

    if (sampleNotes.length === 0) {
        notesSummary.textContent = "No notes yet. Add one above, or with \"+ Note\" on the Compare page.";
    } else {
        notesSummary.textContent = `${sampleNotes.length} note(s) · ${importantCount} marked important`;
    }
}

if (addNoteForm && notesList && notesSummary) {
    // Fill "Which change?" with every new, removed, or edited risk.
    // Unchanged paragraphs are skipped since there is nothing to note.
    riskChanges.forEach(function (change) {
        if (change.status !== "unchanged") {
            const option = document.createElement("option");
            option.setAttribute("value", change.id);
            option.textContent = `${change.ticker}: ${change.title} (${getStatusLabel(change.status)})`;
            noteChangeSelect.appendChild(option);
        }
    });

    showNotes();

    addNoteForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const noteText = noteTextInput.value.trim();
        if (noteText === "") {
            noteError.textContent = "Please write a note before saving.";
            return;
        }

        sampleNotes.push({
            id: nextNoteId,
            changeId: noteChangeSelect.value,
            text: noteText,
            important: noteFlagSelect.value === "important"
        });
        nextNoteId += 1;

        noteError.textContent = "";
        addNoteForm.reset();
        showNotes();
    });
}
