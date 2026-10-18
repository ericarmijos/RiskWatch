// data.js
// All dummy data for the prototype. There is no backend yet, so every page
// reads from these arrays instead. Loaded before main.js (both use defer,
// and deferred scripts run in the order they appear in the HTML).
//
// The companies are made up on purpose: invented risk text attributed to a
// real company would be misleading.

// ----- Which two years the prototype can compare -----
// Only the newest pair of reports has risk paragraphs in this prototype.
const newestYear = 2026;
const previousYear = 2025;

// ----- Companies and their annual reports (10-K) -----
// Each company has a nested "reports" array, newest year first.
// "paragraphs" is how many risk paragraphs that year's report has.
const companies = [
    {
        ticker: "ACME",
        name: "Acme Corp",
        industry: "Manufacturing",
        reports: [
            { year: 2026, filed: "Feb 2026", paragraphs: 8 },
            { year: 2025, filed: "Feb 2025", paragraphs: 7 },
            { year: 2024, filed: "Feb 2024", paragraphs: 7 },
            { year: 2023, filed: "Mar 2023", paragraphs: 6 }
        ]
    },
    {
        ticker: "NWND",
        name: "Northwind Foods",
        industry: "Food & Beverage",
        reports: [
            { year: 2026, filed: "Mar 2026", paragraphs: 7 },
            { year: 2025, filed: "Mar 2025", paragraphs: 8 },
            { year: 2024, filed: "Mar 2024", paragraphs: 8 },
            { year: 2023, filed: "Mar 2023", paragraphs: 7 }
        ]
    },
    {
        ticker: "BLPK",
        name: "Bluepeak Software",
        industry: "Software",
        reports: [
            { year: 2026, filed: "Jan 2026", paragraphs: 10 },
            { year: 2025, filed: "Jan 2025", paragraphs: 7 },
            { year: 2024, filed: "Jan 2024", paragraphs: 6 }
        ]
    }
];

// ----- Risk changes between previousYear and newestYear -----
// Each paragraph is already labeled with a status. The real comparison
// logic comes in a later milestone; for now the labels are hard-coded.
//   "new"       -> only in the newer report (oldText is empty)
//   "removed"   -> only in the older report (newText is empty)
//   "edited"    -> in both reports, but reworded
//   "unchanged" -> in both reports, same text
const riskChanges = [
    // ----- Acme Corp (ACME) -----
    {
        id: "ACME-1",
        ticker: "ACME",
        title: "Tariffs on imported steel",
        status: "new",
        oldText: "",
        newText: "New tariffs on imported steel could raise our material costs by 10% or more. We may not be able to pass these higher costs on to our customers."
    },
    {
        id: "ACME-2",
        ticker: "ACME",
        title: "Cyberattacks on factory systems",
        status: "new",
        oldText: "",
        newText: "Our factories now depend on connected control systems. A cyberattack on these systems could stop production and put worker safety at risk."
    },
    {
        id: "ACME-3",
        ticker: "ACME",
        title: "Product liability lawsuit",
        status: "new",
        oldText: "",
        newText: "We are a defendant in a lawsuit claiming that one of our industrial lifts was defective. An unfavorable outcome could result in large damages and a product recall."
    },
    {
        id: "ACME-4",
        ticker: "ACME",
        title: "Pandemic-related plant closures",
        status: "removed",
        oldText: "A return of pandemic-related restrictions could force us to close one or more plants temporarily, as happened in prior years.",
        newText: ""
    },
    {
        id: "ACME-5",
        ticker: "ACME",
        title: "Dependence on one rail carrier",
        status: "removed",
        oldText: "We ship most of our finished products using a single rail carrier. A strike or service failure at that carrier could delay deliveries to customers.",
        newText: ""
    },
    {
        id: "ACME-6",
        ticker: "ACME",
        title: "Supply of raw materials",
        status: "edited",
        oldText: "We rely on a small number of suppliers for steel and aluminum. A disruption could delay production.",
        newText: "We rely on a small number of suppliers for steel, aluminum, and electronic parts. A disruption, including one caused by new trade restrictions, could delay production for several months."
    },
    {
        id: "ACME-7",
        ticker: "ACME",
        title: "Labor shortages",
        status: "edited",
        oldText: "We may have difficulty hiring skilled factory workers in some regions.",
        newText: "We continue to have difficulty hiring skilled factory workers, and two of our plants operated below capacity last year because of open positions."
    },
    {
        id: "ACME-8",
        ticker: "ACME",
        title: "Interest rates and debt",
        status: "edited",
        oldText: "Rising interest rates could increase the cost of our existing debt.",
        newText: "Rising interest rates have increased the cost of our debt, and about half of our loans must be refinanced within the next two years."
    },
    {
        id: "ACME-9",
        ticker: "ACME",
        title: "Competition",
        status: "unchanged",
        oldText: "We compete with larger manufacturers that have more money to spend on research, marketing, and pricing.",
        newText: "We compete with larger manufacturers that have more money to spend on research, marketing, and pricing."
    },
    {
        id: "ACME-10",
        ticker: "ACME",
        title: "Key employees",
        status: "unchanged",
        oldText: "Our success depends on keeping our senior leadership team and experienced engineers.",
        newText: "Our success depends on keeping our senior leadership team and experienced engineers."
    },

    // ----- Northwind Foods (NWND) -----
    {
        id: "NWND-1",
        ticker: "NWND",
        title: "Extreme weather and crop yields",
        status: "new",
        oldText: "",
        newText: "Droughts and floods in the regions where we buy wheat and vegetables could reduce supply and raise ingredient prices."
    },
    {
        id: "NWND-2",
        ticker: "NWND",
        title: "New food labeling rules",
        status: "new",
        oldText: "",
        newText: "Proposed rules would require new front-of-package nutrition labels. Redesigning our packaging could be costly and some products may need new recipes."
    },
    {
        id: "NWND-3",
        ticker: "NWND",
        title: "Egg prices",
        status: "removed",
        oldText: "A shortage of eggs has sharply increased the cost of several of our baked goods.",
        newText: ""
    },
    {
        id: "NWND-4",
        ticker: "NWND",
        title: "Expansion into Canada",
        status: "removed",
        oldText: "We plan to begin selling in Canada next year. This expansion may cost more and take longer than expected.",
        newText: ""
    },
    {
        id: "NWND-5",
        ticker: "NWND",
        title: "Old warehouse software",
        status: "removed",
        oldText: "Our warehouses still use an older inventory system that could fail during busy seasons.",
        newText: ""
    },
    {
        id: "NWND-6",
        ticker: "NWND",
        title: "Food safety and recalls",
        status: "edited",
        oldText: "If our products become contaminated, we could face recalls and damage to our brand.",
        newText: "If our products become contaminated, we could face recalls and damage to our brand. We issued one voluntary recall last year, which cost about $4 million."
    },
    {
        id: "NWND-7",
        ticker: "NWND",
        title: "Packaging costs",
        status: "edited",
        oldText: "The cost of plastic packaging may rise.",
        newText: "The cost of plastic packaging may rise, and several states now require us to pay fees based on how much packaging we sell."
    },
    {
        id: "NWND-8",
        ticker: "NWND",
        title: "Reliance on large grocery chains",
        status: "edited",
        oldText: "Our three largest customers make up about 30% of our sales.",
        newText: "Our three largest customers make up about 38% of our sales. Losing any one of them would significantly reduce our revenue."
    },
    {
        id: "NWND-9",
        ticker: "NWND",
        title: "Changing consumer tastes",
        status: "unchanged",
        oldText: "Consumers may move away from packaged foods toward fresh or home-cooked meals.",
        newText: "Consumers may move away from packaged foods toward fresh or home-cooked meals."
    },
    {
        id: "NWND-10",
        ticker: "NWND",
        title: "Seasonal sales",
        status: "unchanged",
        oldText: "A large share of our sales happens during the holiday season, so a weak fourth quarter can hurt our full-year results.",
        newText: "A large share of our sales happens during the holiday season, so a weak fourth quarter can hurt our full-year results."
    },

    // ----- Bluepeak Software (BLPK) -----
    {
        id: "BLPK-1",
        ticker: "BLPK",
        title: "Artificial intelligence regulation",
        status: "new",
        oldText: "",
        newText: "New laws on artificial intelligence could limit how we use AI features in our products or require costly audits."
    },
    {
        id: "BLPK-2",
        ticker: "BLPK",
        title: "Data center capacity",
        status: "new",
        oldText: "",
        newText: "Demand for computing power is growing quickly. If we cannot rent enough data center capacity, our service could slow down or go offline."
    },
    {
        id: "BLPK-3",
        ticker: "BLPK",
        title: "Open-source licenses",
        status: "new",
        oldText: "",
        newText: "Our products include open-source code. A change in how those licenses are interpreted could force us to release some of our own code."
    },
    {
        id: "BLPK-4",
        ticker: "BLPK",
        title: "Security breach at a vendor",
        status: "new",
        oldText: "",
        newText: "A payment vendor we use reported a security breach this year. Breaches at our vendors could expose our customers' data even if our own systems are secure."
    },
    {
        id: "BLPK-5",
        ticker: "BLPK",
        title: "Move to subscription pricing",
        status: "removed",
        oldText: "We are moving from one-time licenses to monthly subscriptions. Revenue may drop during this transition.",
        newText: ""
    },
    {
        id: "BLPK-6",
        ticker: "BLPK",
        title: "Data privacy laws",
        status: "edited",
        oldText: "Privacy laws in the United States and Europe could limit how we collect and use customer data.",
        newText: "Privacy laws in the United States, Europe, and India could limit how we collect and use customer data, and fines for violations have increased."
    },
    {
        id: "BLPK-7",
        ticker: "BLPK",
        title: "Reliance on one cloud provider",
        status: "edited",
        oldText: "We host our service with a single cloud provider.",
        newText: "We host our service with a single cloud provider. An outage last year left some customers unable to log in for six hours."
    },
    {
        id: "BLPK-8",
        ticker: "BLPK",
        title: "Hiring engineers",
        status: "edited",
        oldText: "Competition for software engineers is strong.",
        newText: "Competition for software engineers, especially those with AI experience, is strong and has raised our salary costs."
    },
    {
        id: "BLPK-9",
        ticker: "BLPK",
        title: "Foreign currency",
        status: "edited",
        oldText: "About 20% of our revenue is in foreign currencies.",
        newText: "About 25% of our revenue is in foreign currencies, so a stronger U.S. dollar reduces our reported revenue."
    },
    {
        id: "BLPK-10",
        ticker: "BLPK",
        title: "Competition",
        status: "unchanged",
        oldText: "Many competitors offer similar software, and some give it away for free.",
        newText: "Many competitors offer similar software, and some give it away for free."
    },
    {
        id: "BLPK-11",
        ticker: "BLPK",
        title: "Stock price swings",
        status: "unchanged",
        oldText: "Our stock price has changed a lot in the past and may continue to do so.",
        newText: "Our stock price has changed a lot in the past and may continue to do so."
    }
];

// ----- Starting watchlist -----
// Just the tickers. The watchlist page looks up the rest from "companies".
// Changes made on the page only last until the page reloads.
const watchlist = ["ACME", "BLPK"];

// ----- Sample notes -----
// Each note points to one risk change by its id.
// "important" is the flag the user can turn on for a change.
const sampleNotes = [
    {
        id: 1,
        changeId: "ACME-3",
        text: "New lawsuit. Check next quarter's report for an update on damages.",
        important: true
    },
    {
        id: 2,
        changeId: "BLPK-1",
        text: "First time AI regulation shows up as a risk.",
        important: false
    },
    {
        id: 3,
        changeId: "NWND-8",
        text: "Customer concentration went from 30% to 38%. Worth watching.",
        important: true
    }
];
