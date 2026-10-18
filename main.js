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
