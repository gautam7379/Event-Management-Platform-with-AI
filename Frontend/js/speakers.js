let speakers = [];
let events = [];
let assignments = [];
let editId = null;

const $ = id => document.getElementById(id);


// =====================================================
// LOAD EVENTS
// =====================================================

async function loadEvents() {

    events = await Api.events.list();

    const select = $("speakerEvent");

    if (!select) return;

    select.innerHTML =
        `<option value="">Select Event</option>` +
        events.map(event => `
            <option value="${event.id}">
                ${event.event_name}
            </option>
        `).join("");
}


// =====================================================
// LOAD EVENT-SPEAKER ASSIGNMENTS
// =====================================================

async function loadAssignments() {

    assignments =
        await Api.eventSpeakers.list();
}


// =====================================================
// GET ASSIGNED EVENT NAME
// =====================================================

function getSpeakerEventNames(speakerId) {

    const speakerAssignments =
        assignments.filter(
            assignment =>
                Number(assignment.speaker_id) ===
                Number(speakerId)
        );

    const names =
        speakerAssignments
            .map(assignment => {

                const event =
                    events.find(
                        event =>
                            Number(event.id) ===
                            Number(assignment.event_id)
                    );

                return event
                    ? event.event_name
                    : null;
            })
            .filter(Boolean);

    return names.length
        ? names.join(", ")
        : "—";
}


// =====================================================
// LOAD SPEAKERS
// =====================================================

async function load() {

    speakers =
        await Api.speakers.list();

    await loadAssignments();

    renderSpeakers(speakers);

    updateStatistics();
}


// =====================================================
// RENDER TABLE
// =====================================================

function renderSpeakers(list) {

    const table =
        $("speakerTable");

    if (!table) return;

    table.innerHTML =
        list.map(speaker => {

            const eventNames =
                getSpeakerEventNames(
                    speaker.id
                );

            return `
                <tr>

                    <td>
                        ${speaker.id}
                    </td>

                    <td>
                        ${speaker.first_name}
                        ${speaker.last_name}
                    </td>

                    <td>
                        ${speaker.expertise || "—"}
                    </td>

                    <td>
                        ${speaker.organization || "—"}
                    </td>

                    <td>
                        ${eventNames}
                    </td>

                    <td>
                        ${
                            speaker.experience !== null &&
                            speaker.experience !== undefined
                                ? `${speaker.experience} Years`
                                : "—"
                        }
                    </td>

                    <td>
                        ${speaker.speaker_type || "—"}
                    </td>

                    <td class="speaker-actions">

                        <button
                            type="button"
                            class="edit-btn"
                            onclick="editSpeaker(${speaker.id})">

                            <i class="fa-solid fa-pen"></i>
                            Edit

                        </button>

                        <button
                            type="button"
                            class="delete-btn"
                            onclick="deleteSpeaker(${speaker.id})">

                            <i class="fa-solid fa-trash"></i>
                            Delete

                        </button>

                    </td>

                </tr>
            `;

        }).join("");

    if (!list.length) {

        table.innerHTML = `
            <tr>
                <td colspan="8">
                    No speakers available.
                </td>
            </tr>
        `;
    }
}


// =====================================================
// STATISTICS
// =====================================================

function updateStatistics() {

    if ($("totalSpeakers")) {
        $("totalSpeakers").textContent =
            speakers.length;
    }

    if ($("assignedSpeakers")) {

        const assigned =
            new Set(
                assignments.map(
                    item => item.speaker_id
                )
            );

        $("assignedSpeakers").textContent =
            assigned.size;
    }

    if ($("organizations")) {

        const organizations =
            new Set(
                speakers
                    .map(s => s.organization)
                    .filter(Boolean)
            );

        $("organizations").textContent =
            organizations.size;
    }

    if ($("keynoteSpeakers")) {

        const keynoteCount =
            speakers.filter(
                speaker =>
                    speaker.speaker_type ===
                    "Keynote"
            ).length;

        $("keynoteSpeakers").textContent =
            keynoteCount;
    }
}


// =====================================================
// CREATE / UPDATE SPEAKER
// =====================================================

$("speakerForm")?.addEventListener(
    "submit",
    async event => {

        event.preventDefault();

        try {

            const name =
                ($("speakerName").value || "")
                    .trim();

            if (!name) {
                alert("Speaker name is required.");
                return;
            }

            const parts =
                name.split(/\s+/);

            const firstName =
                parts.shift();

            const lastName =
                parts.join(" ") || "User";

            const experienceValue =
                $("speakerExperience").value.trim();

            const data = {

                first_name: firstName,

                last_name: lastName,

                email:
                    $("speakerEmail").value.trim(),

                phone:
                    $("speakerPhone").value.trim()
                    || null,

                organization:
                    $("speakerOrganization").value.trim()
                    || null,

                // No separate designation input exists in your form
                designation: null,

                expertise:
                    $("speakerExpertise").value
                    || null,

                speaker_type:
                    $("speakerType").value
                    || null,

                experience:
                    experienceValue !== ""
                        ? Number(experienceValue)
                        : null,

                bio:
                    $("speakerBio").value.trim()
                    || null
            };


            // ==========================================
            // UPDATE
            // ==========================================

            if (editId) {

                // Update speaker details
                await Api.speakers.update(
                    editId,
                    data
                );


                // Selected event from form
                const selectedEventId =
                    $("speakerEvent").value
                        ? Number($("speakerEvent").value)
                        : null;


                // Find existing speaker-event assignments
                const existingAssignments =
                    assignments.filter(
                        item =>
                            Number(item.speaker_id) ===
                            Number(editId)
                    );


                // Remove assignments that are no longer selected
                for (const assignment of existingAssignments) {

                    if (
                        !selectedEventId ||
                        Number(assignment.event_id) !==
                        selectedEventId
                    ) {

                        await Api.eventSpeakers.remove(
                            assignment.id
                        );
                    }
                }


                // Check whether selected assignment already exists
                const alreadyAssigned =
                    existingAssignments.some(
                        assignment =>
                            Number(assignment.event_id) ===
                            selectedEventId
                    );


                // Create new assignment if required
                if (
                    selectedEventId &&
                    !alreadyAssigned
                ) {

                    await Api.eventSpeakers.create({

                        event_id:
                            selectedEventId,

                        speaker_id:
                            Number(editId)

                    });
                }


                alert(
                    "Speaker updated successfully."
                );
            }


            // ==========================================
            // CREATE
            // ==========================================

            else {

                const speaker =
                    await Api.speakers.create(
                        data
                    );

                const eventId =
                    $("speakerEvent").value;

                // Assign event after speaker creation
                if (eventId) {

                    await Api.eventSpeakers.create({

                        event_id:
                            Number(eventId),

                        speaker_id:
                            Number(speaker.id)

                    });
                }

                alert(
                    "Speaker created successfully."
                );
            }


            editId = null;

            event.target.reset();


            const submitButton =
                $("speakerForm").querySelector(
                    'button[type="submit"]'
                );

            if (submitButton) {

                submitButton.innerHTML = `
                    <i class="fa-solid fa-floppy-disk"></i>
                    Save Speaker
                `;
            }

            await load();

        }
        catch (error) {

            console.error(
                "Speaker Error:",
                error
            );

            alert(error.message);
        }
    }
);


// =====================================================
// EDIT SPEAKER
// =====================================================

window.editSpeaker =
    function(id) {

        const speaker =
            speakers.find(
                item =>
                    Number(item.id) ===
                    Number(id)
            );

        if (!speaker) {
            return;
        }


        editId = Number(id);


        // ==========================================
        // BASIC DETAILS
        // ==========================================

        $("speakerName").value =
            `${speaker.first_name || ""} ${speaker.last_name || ""}`
                .trim();

        $("speakerEmail").value =
            speaker.email || "";

        $("speakerPhone").value =
            speaker.phone || "";

        $("speakerOrganization").value =
            speaker.organization || "";


        // ==========================================
        // EXPERTISE
        // ==========================================

        $("speakerExpertise").value =
            speaker.expertise || "Other";


        // ==========================================
        // SPEAKER TYPE
        // ==========================================

        $("speakerType").value =
            speaker.speaker_type || "Guest";


        // ==========================================
        // EXPERIENCE
        // ==========================================

        $("speakerExperience").value =
            speaker.experience !== null &&
            speaker.experience !== undefined
                ? speaker.experience
                : "";


        // ==========================================
        // BIO
        // ==========================================

        $("speakerBio").value =
            speaker.bio || "";


        // ==========================================
        // EVENT ASSIGNMENT
        // ==========================================

        const assignment =
            assignments.find(
                item =>
                    Number(item.speaker_id) ===
                    Number(id)
            );

        $("speakerEvent").value =
            assignment
                ? String(assignment.event_id)
                : "";


        // ==========================================
        // CHANGE BUTTON TEXT
        // ==========================================

        const submitButton =
            $("speakerForm").querySelector(
                'button[type="submit"]'
            );

        if (submitButton) {

            submitButton.innerHTML = `
                <i class="fa-solid fa-floppy-disk"></i>
                Update Speaker
            `;
        }


        // ==========================================
        // SCROLL TO FORM
        // ==========================================

        $("speakerForm").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    };


// =====================================================
// DELETE SPEAKER
// =====================================================

window.deleteSpeaker =
    async function(id) {

        if (!confirm(
            "Delete this speaker?"
        )) {
            return;
        }

        try {

            // Remove assignments first
            const speakerAssignments =
                assignments.filter(
                    item =>
                        Number(item.speaker_id) ===
                        Number(id)
                );

            for (
                const assignment
                of speakerAssignments
            ) {

                await Api.eventSpeakers.remove(
                    assignment.id
                );
            }

            // Then speaker
            await Api.speakers.remove(id);

            await load();

        }
        catch (error) {

            alert(error.message);
        }
    };


// =====================================================
// SEARCH
// =====================================================

$("searchSpeaker")?.addEventListener(
    "input",
    applyFilters
);

$("filterExpertise")?.addEventListener(
    "change",
    applyFilters
);

// =====================================================
// INITIALIZE
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        if (!requireLogin()) {
            return;
        }

        try {

            if ($("loggedUserName")) {

                $("loggedUserName").textContent =
                    localStorage.getItem(
                        "userName"
                    ) || "User";
            }

            await loadEvents();

            await load();

        }
        catch (error) {

            console.error(
                "Speaker initialization error:",
                error
            );

            alert(error.message);
        }
    }
);

function applyFilters() {

    const search =
        ($("searchSpeaker")?.value || "")
            .trim()
            .toLowerCase();

    const expertise =
        $("filterExpertise")?.value || "All";


    const filtered =
        speakers.filter(speaker => {

            const fullName =
                `${speaker.first_name || ""} ${speaker.last_name || ""}`
                    .toLowerCase();

            const organization =
                (speaker.organization || "")
                    .toLowerCase();

            const speakerExpertise =
                (speaker.expertise || "")
                    .toLowerCase();


            const matchesSearch =
                !search ||
                fullName.includes(search) ||
                organization.includes(search) ||
                speakerExpertise.includes(search);


            const matchesExpertise =
                expertise === "All" ||
                speaker.expertise === expertise;


            return (
                matchesSearch &&
                matchesExpertise
            );
        });


    renderSpeakers(filtered);
}