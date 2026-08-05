// ==========================================
// EVENTAI ATTENDEES - BACKEND VERSION
// ==========================================

let attendees = [];
let events = [];


// ==========================================
// CURRENT USER
// ==========================================

const currentUser = {

    name:
        localStorage.getItem("userName")
        || "Administrator",

    role:
        localStorage.getItem("userRole")
        || "admin"

};


// ==========================================
// ELEMENTS
// ==========================================

const attendeeTable =
    document.getElementById(
        "attendeeTable"
    );

const searchInput =
    document.getElementById(
        "searchInput"
    );

const eventFilter =
    document.getElementById(
        "eventFilter"
    );

const statusFilter =
    document.getElementById(
        "statusFilter"
    );


// ==========================================
// LOAD USER
// ==========================================

function loadUser() {

    const element =
        document.getElementById(
            "loggedUserName"
        );

    if (element) {

        element.textContent =
            currentUser.name;

    }

}


// ==========================================
// LOAD BACKEND DATA
// ==========================================

async function loadAttendeesData() {

    try {

        console.log(
            "Loading attendees..."
        );


        const [
            attendeeData,
            eventData
        ] = await Promise.all([

            Api.registrations.attendees(),

            Api.events.list()

        ]);


        attendees =
            attendeeData || [];

        events =
            eventData || [];


        console.log(
            "ATTENDEES:",
            attendees
        );

        console.log(
            "EVENTS:",
            events
        );


        loadEventDropdown();

        loadStatistics();

        applyFilters();


    } catch (error) {

        console.error(
            "Attendee loading failed:",
            error
        );


        attendees = [];

        events = [];


        loadStatistics();

        loadAttendeesTable([]);

    }

}


// ==========================================
// EVENT DROPDOWNS
// ==========================================

function loadEventDropdown() {

    // Filter dropdown

    if (eventFilter) {

        eventFilter.innerHTML =
            `<option value="all">
                All Events
             </option>`;


        events.forEach(event => {

            eventFilter.innerHTML += `

                <option value="${event.id}">

                    ${event.event_name}

                </option>

            `;

        });

    }


    // Register attendee modal dropdown

    const attendeeEvent =
        document.getElementById(
            "attendeeEvent"
        );


    if (attendeeEvent) {

        attendeeEvent.innerHTML =
            `<option value="">
                Select Event
             </option>`;


        events.forEach(event => {

            attendeeEvent.innerHTML += `

                <option value="${event.id}">

                    ${event.event_name}

                </option>

            `;

        });

    }

}

function isAttendeeCheckedIn(attendee) {

    return String(
        attendee.attendance_status || ""
    )
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    === "checked-in";
}

// ==========================================
// STATISTICS
// ==========================================

function loadStatistics() {

    const totalElement =
        document.getElementById("totalAttendees");

    const checkedElement =
        document.getElementById("checkedIn");

    const pendingElement =
        document.getElementById("pending");

    const eventElement =
        document.getElementById("eventCount");


    const total =
        attendees.length;


    const checkedCount =
        attendees.filter(
            attendee =>
                isAttendeeCheckedIn(attendee)
        ).length;


    const pendingCount =
        total - checkedCount;


    if (totalElement) {
        totalElement.textContent = total;
    }

    if (checkedElement) {
        checkedElement.textContent = checkedCount;
    }

    if (pendingElement) {
        pendingElement.textContent = pendingCount;
    }

    if (eventElement) {
        eventElement.textContent = events.length;
    }

}


// ==========================================
// TABLE
// ==========================================
function loadAttendeesTable(list = attendees) {

    if (!attendeeTable) {
        return;
    }

    attendeeTable.innerHTML = "";

    if (!list || list.length === 0) {

        attendeeTable.innerHTML = `
            <tr>
                <td
                    colspan="7"
                    style="
                        text-align:center;
                        padding:20px;
                    "
                >
                    No attendees found.
                </td>
            </tr>
        `;

        return;
    }


    attendeeTable.innerHTML = list.map(attendee => {

        // IMPORTANT:
        // Check status separately for EACH attendee.
        const checkedIn =
            isAttendeeCheckedIn(attendee);


        const displayStatus =
            checkedIn
                ? "Checked In"
                : "Pending";


        const badgeClass =
            checkedIn
                ? "completed"
                : "upcoming";


        const actionHtml = checkedIn

            ? `
                <span
                    style="
                        color:#16a34a;
                        font-weight:600;
                    "
                >
                    <i class="fa-solid fa-circle-check"></i>
                    Already Checked In
                </span>
            `

            : `
                <button
                    type="button"
                    class="btn-small"
                    onclick="checkIn(${attendee.registration_id})"
                >
                    <i class="fa-solid fa-right-to-bracket"></i>
                    Check In
                </button>
            `;


        return `
            <tr>

                <td>
                    ${
                        attendee.registration_number
                        ||
                        attendee.registration_id
                    }
                </td>

                <td>
                    ${attendee.name || "-"}
                </td>

                <td>
                    ${attendee.email || "-"}
                </td>

                <td>
                    ${attendee.phone || "-"}
                </td>

                <td>
                    ${attendee.event_name || "-"}
                </td>

                <td>
                    <span class="badge ${badgeClass}">
                        ${displayStatus}
                    </span>
                </td>

                <td>
                    ${actionHtml}
                </td>

            </tr>
        `;

    }).join("");

}


// ==========================================
// FILTER
// ==========================================

function applyFilters() {

    const keyword =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const selectedEvent =
        eventFilter
            ? eventFilter.value
            : "all";


    const selectedStatus =
        statusFilter
            ? statusFilter.value
            : "all";


    const filtered =
        attendees.filter(attendee => {


            // ==============================
            // SEARCH
            // ==============================

            const searchableText = [

                attendee.registration_number,

                attendee.name,

                attendee.email,

                attendee.phone,

                attendee.event_name

            ]
            .map(value =>
                String(value || "")
                    .toLowerCase()
            )
            .join(" ");


            const matchesSearch =
                searchableText.includes(keyword);


            // ==============================
            // EVENT
            // ==============================

            const matchesEvent =

                selectedEvent === "all"

                ||

                String(attendee.event_id) ===
                String(selectedEvent);


            // ==============================
            // STATUS
            // ==============================

            const checkedIn =
                isAttendeeCheckedIn(attendee);


            let matchesStatus = true;


            if (selectedStatus === "Checked In") {

                matchesStatus =
                    checkedIn;

            }

            else if (selectedStatus === "Pending") {

                matchesStatus =
                    !checkedIn;

            }


            return (
                matchesSearch
                &&
                matchesEvent
                &&
                matchesStatus
            );

        });


    console.log(
        "FILTER:",
        {
            event: selectedEvent,
            status: selectedStatus,
            results: filtered.length
        }
    );


    loadAttendeesTable(filtered);

}


// ==========================================
// CHECK-IN
// ==========================================

// ==========================================
// CHECK-IN
// ==========================================

async function checkIn(registrationId) {

    try {

        console.log(
            "Check-in registration:",
            registrationId
        );


        // ----------------------------------
        // Get logged-in Admin / Organizer
        // ----------------------------------

        const currentUser =
            await Api.me();


        if (!currentUser || !currentUser.id) {

            throw new Error(
                "Could not identify logged-in user."
            );

        }


        // ----------------------------------
        // Confirm action
        // ----------------------------------

        const confirmed = confirm(
            "Check in this attendee?"
        );

        if (!confirmed) {
            return;
        }


        // ----------------------------------
        // Create Check-In
        // ----------------------------------

        const result =
            await Api.checkins.create({

                registration_id:
                    Number(registrationId),

                checked_in_by:
                    Number(currentUser.id),

                entry_gate:
                    "Main Gate",

                badge_printed:
                    false,

                attendance_status:
                    "Checked-In"

            });


        console.log(
            "CHECK-IN CREATED:",
            result
        );


        alert(
            "Attendee checked in successfully."
        );


        // ----------------------------------
        // Reload attendee data from database
        // ----------------------------------

        await loadAttendeesData();


    } catch (error) {

        console.error(
            "Check-in failed:",
            error
        );

        alert(
            error.message ||
            "Check-in failed."
        );

    }

}


// ==========================================
// SEARCH/FILTER EVENTS
// ==========================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        applyFilters
    );

}


if (eventFilter) {

    eventFilter.addEventListener(
        "change",
        applyFilters
    );

}


if (statusFilter) {

    statusFilter.addEventListener(
        "change",
        applyFilters
    );

}


// ==========================================
// CSV EXPORT
// ==========================================

function exportAttendeesCSV() {

    if (!attendees.length) {

        alert(
            "No attendees available to export."
        );

        return;

    }


    const escapeCSV = value => {

        const text =
            String(value ?? "");

        return (
            '"' +
            text.replace(
                /"/g,
                '""'
            ) +
            '"'
        );

    };


    const rows = [

        [
            "Registration",
            "Name",
            "Email",
            "Phone",
            "Event",
            "Status",
            "Registration Date"
        ]

    ];


    attendees.forEach(
        attendee => {

            rows.push([

                attendee.registration_number
                || attendee.registration_id,

                attendee.name,

                attendee.email,

                attendee.phone,

                attendee.event_name,

                isAttendeeCheckedIn(attendee)
                    ? "Checked In"
                    : "Pending",

                attendee.registration_date

            ]);

        }
    );


    const csv =
        rows
            .map(
                row =>
                    row
                        .map(escapeCSV)
                        .join(",")
            )
            .join("\n");


    const blob =
        new Blob(
            [csv],
            {
                type:
                    "text/csv;charset=utf-8;"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href = url;

    link.download =
        "attendees.csv";


    document.body.appendChild(
        link
    );


    link.click();

    link.remove();


    URL.revokeObjectURL(
        url
    );

}


// ==========================================
// MODAL
// ==========================================

function openModal() {

    const modal =
        document.getElementById(
            "attendeeModal"
        );

    if (modal) {

        modal.style.display =
            "block";

    }

}


function closeModal() {

    const modal =
        document.getElementById(
            "attendeeModal"
        );

    if (modal) {

        modal.style.display =
            "none";

    }

}

// ==========================================
// SAVE NEW ATTENDEE
// ==========================================

const saveAttendeeBtn =
    document.getElementById(
        "saveAttendee"
    );


if (saveAttendeeBtn) {

    saveAttendeeBtn.addEventListener(
        "click",
        async () => {

            try {

                // ==================================
                // READ FORM
                // ==================================

                const nameInput =
                    document.getElementById(
                        "attendeeName"
                    );

                const emailInput =
                    document.getElementById(
                        "attendeeEmail"
                    );

                const phoneInput =
                    document.getElementById(
                        "attendeePhone"
                    );

                const eventInput =
                    document.getElementById(
                        "attendeeEvent"
                    );

                const statusInput =
                    document.getElementById(
                        "attendeeStatus"
                    );


                const name =
                    nameInput
                        ?.value
                        .trim()
                    || "";


                const email =
                    emailInput
                        ?.value
                        .trim()
                    || "";


                const phone =
                    phoneInput
                        ?.value
                        .trim()
                    || "";


                const eventId =
                    eventInput
                        ?.value
                    || "";


                const attendanceStatus =
                    statusInput
                        ?.value
                    || "Pending";


                // ==================================
                // VALIDATION
                // ==================================

                if (!name) {

                    alert(
                        "Please enter attendee name."
                    );

                    nameInput?.focus();

                    return;
                }


                if (!email) {

                    alert(
                        "Please enter attendee email."
                    );

                    emailInput?.focus();

                    return;
                }


                if (!eventId) {

                    alert(
                        "Please select an event."
                    );

                    eventInput?.focus();

                    return;
                }


                // ==================================
                // DISABLE BUTTON
                // ==================================

                saveAttendeeBtn.disabled =
                    true;


                const originalHTML =
                    saveAttendeeBtn.innerHTML;


                saveAttendeeBtn.innerHTML = `

                    <i class="fas fa-spinner fa-spin"></i>

                    Saving...

                `;


                try {

                    // ==============================
                    // SEND TO BACKEND
                    // ==============================

                    const result =
                        await Api
                            .registrations
                            .adminCreateAttendee({

                                name:
                                    name,

                                email:
                                    email,

                                phone:
                                    phone || null,

                                event_id:
                                    Number(eventId),

                                attendance_status:
                                    attendanceStatus

                            });


                    console.log(
                        "NEW ATTENDEE:",
                        result
                    );


                    alert(
                        "Attendee registered successfully."
                    );


                    // ==============================
                    // CLEAR FORM
                    // ==============================

                    if (nameInput) {
                        nameInput.value = "";
                    }


                    if (emailInput) {
                        emailInput.value = "";
                    }


                    if (phoneInput) {
                        phoneInput.value = "";
                    }


                    if (eventInput) {
                        eventInput.value = "";
                    }


                    if (statusInput) {
                        statusInput.value =
                            "Pending";
                    }


                    // ==============================
                    // CLOSE MODAL
                    // ==============================

                    closeModal();


                    // ==============================
                    // RELOAD FROM DATABASE
                    // ==============================

                    await loadAttendeesData();


                } finally {

                    saveAttendeeBtn.disabled =
                        false;

                    saveAttendeeBtn.innerHTML =
                        originalHTML;

                }


            } catch (error) {

                console.error(
                    "Attendee registration failed:",
                    error
                );


                alert(
                    error.message
                    ||
                    "Could not register attendee."
                );

            }

        }
    );

}

// ==========================================
// REGISTER BUTTON
// ==========================================

const addAttendeeBtn =
    document.getElementById(
        "addAttendeeBtn"
    );


if (addAttendeeBtn) {

    addAttendeeBtn.addEventListener(
        "click",
        openModal
    );

}


const closeModalBtn =
    document.getElementById(
        "closeModal"
    );


if (closeModalBtn) {

    closeModalBtn.addEventListener(
        "click",
        closeModal
    );

}

window.addEventListener(
    "click",
    event => {

        const modal =
            document.getElementById(
                "attendeeModal"
            );

        if (
            modal &&
            event.target === modal
        ) {
            closeModal();
        }
    }
);


// ==========================================
// INITIALIZE
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        loadUser();

        await loadAttendeesData();

    }
);


// ==========================================
// EXPORT GLOBAL FUNCTIONS
// ==========================================

window.checkIn =
    checkIn;

window.exportAttendeesCSV =
    exportAttendeesCSV;


// ==========================================
// DEBUG
// ==========================================

console.log(
    "EventAI Attendees Backend Version Loaded"
);