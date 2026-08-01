/* ==========================================
            EVENTAI SPEAKERS
========================================== */

/* ==========================================
            LOCAL STORAGE
========================================== */

function getSpeakers() {

    return JSON.parse(

        localStorage.getItem("speakers")

    ) || [];

}

function saveSpeakers(speakers) {

    localStorage.setItem(

        "speakers",

        JSON.stringify(speakers)

    );

}

function getEvents() {

    return JSON.parse(

        localStorage.getItem("events")

    ) || [];

}

/* ==========================================
            CURRENT USER
========================================== */

const currentUser = {

    name:

        localStorage.getItem("userName") ||

        "Administrator",

    role:

        localStorage.getItem("userRole") ||

        "admin"

};

/* ==========================================
            SECURITY
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    if (currentUser.role !== "admin") {

        window.location.href =

            "user-dashboard.html";

        return;

    }

    document.getElementById(

        "loggedUserName"

    ).textContent =

        currentUser.name;

    loadEvents();

    loadStatistics();

    loadSpeakers();

});

/* ==========================================
            LOAD EVENTS
========================================== */

function loadEvents() {

    const select =

        document.getElementById(

            "speakerEvent"

        );

    if (!select) return;

    const events = getEvents();

    select.innerHTML =

        `<option value="">Select Event</option>`;

    events.forEach(event => {

        select.innerHTML += `

            <option value="${event.name}">

                ${event.name}

            </option>

        `;

    });

}

/* ==========================================
            LOAD STATISTICS
========================================== */

function loadStatistics() {

    const speakers =

        getSpeakers();

    document.getElementById(

        "totalSpeakers"

    ).textContent =

        speakers.length;

    document.getElementById(

        "keynoteSpeakers"

    ).textContent =

        speakers.filter(

            speaker =>

            speaker.type === "Keynote"

        ).length;

    document.getElementById(

        "assignedSpeakers"

    ).textContent =

        speakers.filter(

            speaker =>

            speaker.event !== ""

        ).length;

    const organizations = [

        ...new Set(

            speakers.map(

                speaker =>

                speaker.organization

            )

        )

    ];

    document.getElementById(

        "organizations"

    ).textContent =

        organizations.length;

}
/* ==========================================
            LOAD SPEAKERS
========================================== */

function loadSpeakers(filteredSpeakers = null) {

    const table =

        document.getElementById("speakerTable");

    if (!table) return;

    table.innerHTML = "";

    const speakers = filteredSpeakers || getSpeakers();

    if (speakers.length === 0) {

        table.innerHTML = `

        <tr>

            <td colspan="8"

                style="text-align:center;padding:20px;">

                No speakers available.

            </td>

        </tr>

        `;

        loadFeaturedSpeakers([]);

        return;

    }

    speakers.forEach((speaker, index) => {

        let badgeClass = "guest";

        if (speaker.type === "Keynote") {

            badgeClass = "keynote";

        }

        else if (speaker.type === "Panelist") {

            badgeClass = "panelist";

        }

        else if (speaker.type === "Workshop") {

            badgeClass = "workshop";

        }

        table.innerHTML += `

        <tr>

            <td>

                ${speaker.id}

            </td>

            <td>

                ${speaker.name}

            </td>

            <td>

                ${speaker.expertise}

            </td>

            <td>

                ${speaker.organization}

            </td>

            <td>

                ${speaker.event || "-"}

            </td>

            <td>

                ${speaker.experience} Years

            </td>

            <td>

                <span class="badge ${badgeClass}">

                    ${speaker.type}

                </span>

            </td>

            <td>

                <div class="action-buttons">

                    <button

                        class="edit-btn"

                        onclick="editSpeaker(${index})">

                        <i class="fa-solid fa-pen"></i>

                    </button>

                    <button

                        class="delete-btn"

                        onclick="deleteSpeaker(${index})">

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </div>

            </td>

        </tr>

        `;

    });

    loadFeaturedSpeakers(speakers);

}

/* ==========================================
            ADD SPEAKER
========================================== */

const speakerForm =

document.getElementById("speakerForm");

if(speakerForm){

    speakerForm.addEventListener("submit",function(e){

        e.preventDefault();

        const speakers = getSpeakers();

        const speaker = {

            id:

                "SPK" + Date.now(),

            name:

                document.getElementById(

                    "speakerName"

                ).value.trim(),

            email:

                document.getElementById(

                    "speakerEmail"

                ).value.trim(),

            phone:

                document.getElementById(

                    "speakerPhone"

                ).value.trim(),

            organization:

                document.getElementById(

                    "speakerOrganization"

                ).value.trim(),

            expertise:

                document.getElementById(

                    "speakerExpertise"

                ).value,

            type:

                document.getElementById(

                    "speakerType"

                ).value,

            event:

                document.getElementById(

                    "speakerEvent"

                ).value,

            experience:

                document.getElementById(

                    "speakerExperience"

                ).value,

            bio:

                document.getElementById(

                    "speakerBio"

                ).value.trim()

        };

        speakers.push(speaker);

        saveSpeakers(speakers);

        speakerForm.reset();

        loadStatistics();

        loadSpeakers();

        alert("✅ Speaker added successfully.");

    });

}
/* ==========================================
            EDIT SPEAKER
========================================== */

function editSpeaker(index){

    const speakers = getSpeakers();

    const speaker = speakers[index];

    if(!speaker) return;

    document.getElementById("speakerName").value = speaker.name;

    document.getElementById("speakerEmail").value = speaker.email;

    document.getElementById("speakerPhone").value = speaker.phone;

    document.getElementById("speakerOrganization").value = speaker.organization;

    document.getElementById("speakerExpertise").value = speaker.expertise;

    document.getElementById("speakerType").value = speaker.type;

    document.getElementById("speakerEvent").value = speaker.event;

    document.getElementById("speakerExperience").value = speaker.experience;

    document.getElementById("speakerBio").value = speaker.bio;

    speakers.splice(index,1);

    saveSpeakers(speakers);

    loadStatistics();

    loadSpeakers();

}

/* ==========================================
            DELETE SPEAKER
========================================== */

function deleteSpeaker(index){

    if(!confirm("Delete this speaker?")){

        return;

    }

    const speakers = getSpeakers();

    speakers.splice(index,1);

    saveSpeakers(speakers);

    loadStatistics();

    loadSpeakers();

}

/* ==========================================
            SEARCH
========================================== */

const searchSpeaker =

document.getElementById("searchSpeaker");

if(searchSpeaker){

    searchSpeaker.addEventListener(

        "keyup",

        filterSpeakers

    );

}

/* ==========================================
            FILTER
========================================== */

const filterExpertise =

document.getElementById("filterExpertise");

if(filterExpertise){

    filterExpertise.addEventListener(

        "change",

        filterSpeakers

    );

}

/* ==========================================
            FILTER FUNCTION
========================================== */

function filterSpeakers(){

    const search =

        document.getElementById(

            "searchSpeaker"

        ).value.toLowerCase();

    const expertise =

        document.getElementById(

            "filterExpertise"

        ).value;

    let speakers = getSpeakers();

    speakers = speakers.filter(speaker=>{

        const matchSearch =

            speaker.name.toLowerCase().includes(search)

            ||

            speaker.organization.toLowerCase().includes(search)

            ||

            speaker.expertise.toLowerCase().includes(search)

            ||

            (speaker.event || "").toLowerCase().includes(search);

        const matchExpertise =

            expertise === "All"

            ||

            speaker.expertise === expertise;

        return matchSearch && matchExpertise;

    });

    loadSpeakers(speakers);

}
/* ==========================================
            FEATURED SPEAKERS
========================================== */

function loadFeaturedSpeakers(speakers = getSpeakers()) {

    const container = document.getElementById("featuredSpeakers");

    if (!container) return;

    container.innerHTML = "";

    if (speakers.length === 0) {

        container.innerHTML = `

            <div class="no-data">

                No speakers available.

            </div>

        `;

        return;

    }

    const featured = [...speakers]

        .sort((a, b) =>

            Number(b.experience || 0) -

            Number(a.experience || 0)

        )

        .slice(0, 4);

    featured.forEach(speaker => {

        const initials = speaker.name

            .split(" ")

            .map(word => word[0])

            .join("")

            .substring(0, 2)

            .toUpperCase();

        let badgeClass = "guest";

        if (speaker.type === "Keynote") {

            badgeClass = "keynote";

        }

        else if (speaker.type === "Panelist") {

            badgeClass = "panelist";

        }

        else if (speaker.type === "Workshop") {

            badgeClass = "workshop";

        }

        container.innerHTML += `

            <div class="speaker-card">

                <div class="speaker-avatar">

                    ${initials}

                </div>

                <h3>

                    ${speaker.name}

                </h3>

                <p>

                    <strong>Organization:</strong>

                    ${speaker.organization}

                </p>

                <p>

                    <strong>Expertise:</strong>

                    ${speaker.expertise}

                </p>

                <p>

                    <strong>Experience:</strong>

                    ${speaker.experience} Years

                </p>

                <p>

                    <strong>Event:</strong>

                    ${speaker.event || "Not Assigned"}

                </p>

                <span class="badge ${badgeClass}">

                    ${speaker.type}

                </span>

            </div>

        `;

    });

}

/* ==========================================
            REFRESH PAGE
========================================== */

function refreshPage() {

    loadEvents();

    loadStatistics();

    loadSpeakers();

    loadFeaturedSpeakers();

}

/* ==========================================
            AUTO REFRESH
========================================== */

window.addEventListener("storage", () => {

    refreshPage();

});

/* ==========================================
            INITIALIZE
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    if (currentUser.role !== "admin") {

        window.location.href = "user-dashboard.html";

        return;

    }

    document.getElementById("loggedUserName").textContent =

        currentUser.name;

    refreshPage();

});

/* ==========================================
            DEBUG
========================================== */

console.log("================================");

console.log("EventAI Speakers Loaded");

console.log("Admin :", currentUser.name);

console.log("================================");