/* ==========================================
        EVENTAI SPONSOR MANAGEMENT
========================================== */

console.log("Sponsor Management Loaded");


let sponsors = [];
let events = [];
let assignments = [];
let editId = null;


/* ==========================================
        HELPERS
========================================== */

const $ = (id) =>
    document.getElementById(id);

function formatMoney(value) {

    const amount = Number(value || 0);

    return (
        "₹" +
        amount.toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            }
        )
    );
}

function escapeHtml(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value == null
            ? ""
            : String(value);

    return div.innerHTML;
}


function populateEventDropdown() {

    const select = $("sponsorEvent");

    if (!select)
        return;

    select.innerHTML =
        `<option value="">Select Event</option>`;

    events.forEach(event => {

        select.innerHTML += `

            <option value="${event.id}">

                ${event.event_name}

            </option>

        `;

    });

}

function getAssignment(sponsorId){

    return assignments.find(

        a=>a.sponsor_id===sponsorId

    );

}

function getEventName(sponsorId){

    const assignment =
        getAssignment(sponsorId);

    if(!assignment)
        return "-";

    const event =
        events.find(

            e=>e.id===assignment.event_id

        );

    return event
        ? event.event_name
        : "-";

}

/* ==========================================
        LOAD SPONSORS
========================================== */

async function loadSponsors() {

    const [
        sponsorData,
        eventData,
        assignmentData
    ] = await Promise.all([

        Api.sponsors.list(),

        Api.events.list(),

        Api.eventSponsors.list()

    ]);

    sponsors = sponsorData;
    events = eventData;
    assignments = assignmentData;

    populateEventDropdown();

    renderSponsors(sponsors);

    updateStatistics();

    renderTopSponsors();
}


/* ==========================================
        RENDER TABLE
========================================== */

function renderSponsors(data) {

    const table =
        $("sponsorTable");

    if (!table) {
        return;
    }


    // ==========================================
    // EMPTY STATE
    // ==========================================

    if (!data || !data.length) {

        table.innerHTML = `
            <tr>

                <td
                    colspan="9"
                    style="text-align:center;">

                    No sponsors found.

                </td>

            </tr>
        `;

        return;
    }


    // ==========================================
    // RENDER SPONSOR ROWS
    // ==========================================

    table.innerHTML =

        data.map(

            sponsor => {

                const eventName =
                    getEventName(
                        sponsor.id
                    );


                return `

                    <tr>

                        <!-- ID -->

                        <td>

                            ${sponsor.id}

                        </td>


                        <!-- SPONSOR NAME -->

                        <td>

                            <strong>

                                ${escapeHtml(
                                    sponsor.sponsor_name
                                    || "-"
                                )}

                            </strong>

                        </td>


                        <!-- CONTACT PERSON -->

                        <td>

                            ${escapeHtml(
                                sponsor.contact_person
                                || "-"
                            )}

                        </td>


                        <!-- SPONSORSHIP LEVEL -->

                        <td>

                            <span class="sponsor-level">

                                ${escapeHtml(
                                    sponsor.sponsorship_level
                                    || "-"
                                )}

                            </span>

                        </td>


                        <!-- EVENT -->

                        <td>

                            ${escapeHtml(
                                eventName
                                || "-"
                            )}

                        </td>


                        <!-- EMAIL -->

                        <td>

                            ${escapeHtml(
                                sponsor.email
                                || "-"
                            )}

                        </td>


                        <!-- PHONE -->

                        <td>

                            ${escapeHtml(
                                sponsor.phone
                                || "-"
                            )}

                        </td>


                        <!-- CONTRIBUTION -->

                        <td>

                            ${formatMoney(
                                sponsor.contribution
                            )}

                        </td>


                        <!-- ACTIONS -->

                        <td>

                            <button
                                type="button"
                                class="edit-btn"
                                onclick="editSponsor(${sponsor.id})">

                                <i class="fa-solid fa-pen"></i>

                                Edit

                            </button>


                            <button
                                type="button"
                                class="delete-btn"
                                onclick="deleteSponsor(${sponsor.id})">

                                <i class="fa-solid fa-trash"></i>

                                Delete

                            </button>

                        </td>

                    </tr>

                `;

            }

        ).join("");

}


/* ==========================================
        STATISTICS
========================================== */

function updateStatistics() {

    const total =
        sponsors.length;


    const platinum =
        sponsors.filter(
            sponsor =>
                sponsor
                    .sponsorship_level
                    ?.toLowerCase()
                === "platinum"
        ).length;


    const totalFunding =
        sponsors.reduce(
            (total, sponsor) =>
                total +
                Number(
                    sponsor.contribution || 0
                ),
            0
        );


    if ($("totalSponsors")) {

        $("totalSponsors").textContent =
            total;
    }


    if ($("platinumSponsors")) {

        $("platinumSponsors").textContent =
            platinum;
    }


    /*
        Event assignment is stored in the
        event_sponsors table.

        Until that API is connected, don't
        display fake assignment numbers.
    */

    if ($("assignedSponsors")) {

        $("assignedSponsors").textContent =
            assignments.length;
    }


    if ($("totalFunding")) {

        $("totalFunding").textContent =
            formatMoney(
                totalFunding
            );
    }
}


/* ==========================================
        TOP SPONSORS
========================================== */

function renderTopSponsors() {

    const container =
        $("topSponsors");

    if (!container) {
        return;
    }


    const top =
        [...sponsors]
        .sort(
            (a, b) =>
                Number(b.contribution || 0)
                -
                Number(a.contribution || 0)
        )
        .slice(
            0,
            3
        );


    if (!top.length) {

        container.innerHTML = `
            <p>
                No sponsor data available.
            </p>
        `;

        return;
    }


    container.innerHTML =
        top.map(
            (sponsor, index) => `
                <div class="card">

                    <i class="fa-solid fa-ranking-star"></i>

                    <h3>
                        #${index + 1}
                        ${escapeHtml(
                            sponsor.sponsor_name
                        )}
                    </h3>

                    <p>
                        ${escapeHtml(
                            sponsor.sponsorship_level
                        )}
                    </p>

                    <h2>
                        ${formatMoney(
                            sponsor.contribution
                        )}
                    </h2>

                </div>
            `
        )
        .join("");
}


/* ==========================================
        CREATE / UPDATE
========================================== */

$("sponsorForm")
    ?.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const sponsorName =
                $("sponsorName")
                    .value
                    .trim();


            if (!sponsorName) {

                alert(
                    "Sponsor name is required."
                );

                return;
            }


            const contribution =
                Number(
                    $("sponsorAmount")
                        .value || 0
                );


            if (
                Number.isNaN(contribution)
                ||
                contribution < 0
            ) {

                alert(
                    "Contribution must be zero or greater."
                );

                return;
            }


            const data = {

                sponsor_name:
                    sponsorName,

                contact_person:
                    $("contactPerson")
                        ?.value
                        .trim()
                    || null,

                email:
                    $("sponsorEmail")
                        .value
                        .trim()
                    || null,

                phone:
                    $("sponsorPhone")
                        .value
                        .trim()
                    || null,

                sponsorship_level:
                    $("sponsorLevel")
                        .value,

                contribution:
                    contribution,

                logo:
                    null
            };


            try {

                if (editId !== null) {

                    await Api.sponsors.update(
                        editId,
                        data
                    );

                    const eventSelect =
                        $("sponsorEvent");

                    const eventId =
                        eventSelect
                            ? eventSelect.value
                            : "";

                    const assignment =
                        assignments.find(

                            a=>a.sponsor_id===editId

                        );

                    if(assignment){

                        await Api.eventSponsors.remove(
                            assignment.id
                        );

                    }

                    if(eventId){

                        await Api.eventSponsors.create({

                            sponsor_id:editId,

                            event_id:Number(eventId)

                        });

                    }

                } else {

                    const sponsor =
                        await Api.sponsors.create(
                            data
                        );

                    const eventSelect =
                        $("sponsorEvent");

                    const eventId =
                        eventSelect
                            ? eventSelect.value
                            : "";

                    if (eventId) {

                        await Api.eventSponsors.create({

                            sponsor_id: sponsor.id,

                            event_id: Number(eventId)

                        });
                    }
                }


                editId = null;

                event.target.reset();


                const submitButton =
                    event.target.querySelector(
                        'button[type="submit"]'
                    );

                if (submitButton) {

                    submitButton.innerHTML = `
                        <i class="fa-solid fa-floppy-disk"></i>
                        Save Sponsor
                    `;
                }


                await loadSponsors();


            } catch (error) {

                console.error(
                    "Sponsor save failed:",
                    error
                );

                alert(
                    error.message ||
                    "Unable to save sponsor."
                );
            }
        }
    );


/* ==========================================
        EDIT
========================================== */

window.editSponsor =
    function (id) {

        const sponsor =
            sponsors.find(
                item =>
                    item.id === id
            );


        if (!sponsor) {
            return;
        }


        editId =
            sponsor.id;


        $("sponsorName").value =
            sponsor.sponsor_name || "";


        if ($("contactPerson")) {

            $("contactPerson").value =
                sponsor.contact_person || "";
        }


        $("sponsorEmail").value =
            sponsor.email || "";


        $("sponsorPhone").value =
            sponsor.phone || "";


        $("sponsorLevel").value =
            sponsor.sponsorship_level;


        $("sponsorAmount").value =
            sponsor.contribution;


        const submitButton =
            $("sponsorForm")
                ?.querySelector(
                    'button[type="submit"]'
                );


        if (submitButton) {

            submitButton.innerHTML = `
                <i class="fa-solid fa-floppy-disk"></i>
                Update Sponsor
            `;
        }


        $("sponsorForm")
            ?.scrollIntoView({
                behavior: "smooth"
            });

        
        const assignment =
            assignments.find(

                a=>a.sponsor_id===id

            );

        if(
            $("sponsorEvent")
        ){

            $("sponsorEvent").value =
                assignment
                    ? assignment.event_id
                    : "";

        }
    };


/* ==========================================
        DELETE
========================================== */

window.deleteSponsor =
    async function (id) {

        const sponsor =
            sponsors.find(
                item =>
                    item.id === id
            );


        const name =
            sponsor
                ?.sponsor_name
            || "this sponsor";


        if (
            !confirm(
                `Delete ${name}?`
            )
        ) {
            return;
        }


        try {

            const assignment =
                assignments.find(

                    a=>a.sponsor_id===id

                );

            if(assignment){

                await Api.eventSponsors.remove(
                    assignment.id
                );

            }
            await Api.sponsors.remove(id);


            if (editId === id) {

                editId = null;

                $("sponsorForm")
                    ?.reset();
            }


            await loadSponsors();


        } catch (error) {

            console.error(
                "Sponsor deletion failed:",
                error
            );

            alert(
                error.message ||
                "Unable to delete sponsor."
            );
        }
    };


/* ==========================================
        SEARCH / FILTER
========================================== */

function filterSponsors() {

    const search =
        $("searchSponsor")
            ?.value
            .trim()
            .toLowerCase()
        || "";


    const level =
        $("filterLevel")
            ?.value
        || "All";


    const filtered =
        sponsors.filter(
            sponsor => {

                const matchesSearch =

                    sponsor
                        .sponsor_name
                        ?.toLowerCase()
                        .includes(search)

                    ||

                    sponsor
                        .contact_person
                        ?.toLowerCase()
                        .includes(search)

                    ||

                    sponsor
                        .email
                        ?.toLowerCase()
                        .includes(search);


                const matchesLevel =

                    level === "All"

                    ||

                    sponsor
                        .sponsorship_level
                    === level;


                return (
                    matchesSearch
                    &&
                    matchesLevel
                );
            }
        );


    renderSponsors(
        filtered
    );
}


$("searchSponsor")
    ?.addEventListener(
        "input",
        filterSponsors
    );


$("filterLevel")
    ?.addEventListener(
        "change",
        filterSponsors
    );


/* ==========================================
        INITIALIZE
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        if (
            typeof requireLogin
            === "function"
            &&
            !requireLogin()
        ) {
            return;
        }


        try {

            await loadSponsors();

        } catch (error) {

            console.error(
                "Could not load sponsors:",
                error
            );

            alert(
                error.message ||
                "Unable to load sponsors."
            );
        }
    }
);