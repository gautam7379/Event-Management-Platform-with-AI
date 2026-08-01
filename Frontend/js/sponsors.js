/* ==========================================
            EVENTAI SPONSORS
========================================== */

/* ==========================================
            LOCAL STORAGE
========================================== */

function getSponsors(){

    return JSON.parse(

        localStorage.getItem("sponsors")

    ) || [];

}

function saveSponsors(sponsors){

    localStorage.setItem(

        "sponsors",

        JSON.stringify(sponsors)

    );

}

function getEvents(){

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

document.addEventListener("DOMContentLoaded",()=>{

    if(currentUser.role!=="admin"){

        window.location.href="user-dashboard.html";

        return;

    }

    document.getElementById("loggedUserName").textContent=

        currentUser.name;

    loadEvents();

    loadStatistics();

    loadSponsors();

});

/* ==========================================
            LOAD EVENTS
========================================== */

function loadEvents(){

    const select=

        document.getElementById("sponsorEvent");

    if(!select) return;

    select.innerHTML=

        `<option value="">Select Event</option>`;

    const events=getEvents();

    events.forEach(event=>{

        select.innerHTML+=`

        <option value="${event.name}">

            ${event.name}

        </option>

        `;

    });

}

/* ==========================================
            LOAD STATISTICS
========================================== */

function loadStatistics(){

    const sponsors=getSponsors();

    document.getElementById(

        "totalSponsors"

    ).textContent=sponsors.length;

    document.getElementById(

        "platinumSponsors"

    ).textContent=

        sponsors.filter(

            sponsor=>sponsor.level==="Platinum"

        ).length;

    document.getElementById(

        "assignedSponsors"

    ).textContent=

        sponsors.filter(

            sponsor=>sponsor.event!==""

        ).length;

    let totalFunding=0;

    sponsors.forEach(sponsor=>{

        totalFunding+=Number(

            sponsor.amount||0

        );

    });

    document.getElementById(

        "totalFunding"

    ).textContent=

        "₹"+

        totalFunding.toLocaleString("en-IN");

}
/* ==========================================
            LOAD SPONSORS
========================================== */

function loadSponsors(filteredSponsors = null){

    const table =

        document.getElementById("sponsorTable");

    if(!table) return;

    table.innerHTML = "";

    const sponsors =

        filteredSponsors || getSponsors();

    if(sponsors.length===0){

        table.innerHTML = `

        <tr>

            <td colspan="8"

                style="text-align:center;padding:20px;">

                No sponsors available.

            </td>

        </tr>

        `;

        loadTopSponsors([]);

        return;

    }

    sponsors.forEach((sponsor,index)=>{

        let badgeClass = sponsor.level.toLowerCase();

        let statusClass = sponsor.status.toLowerCase();

        table.innerHTML += `

        <tr>

            <td>${sponsor.id}</td>

            <td>${sponsor.name}</td>

            <td>${sponsor.company}</td>

            <td>

                <span class="badge ${badgeClass}">

                    ${sponsor.level}

                </span>

            </td>

            <td>

                ${sponsor.event || "-"}

            </td>

            <td>

                ₹${Number(sponsor.amount).toLocaleString("en-IN")}

            </td>

            <td>

                <span class="badge ${statusClass}">

                    ${sponsor.status}

                </span>

            </td>

            <td>

                <div class="action-buttons">

                    <button

                        class="edit-btn"

                        onclick="editSponsor(${index})">

                        <i class="fa-solid fa-pen"></i>

                    </button>

                    <button

                        class="delete-btn"

                        onclick="deleteSponsor(${index})">

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </div>

            </td>

        </tr>

        `;

    });

    loadTopSponsors(sponsors);

}

/* ==========================================
            ADD SPONSOR
========================================== */

const sponsorForm =

document.getElementById("sponsorForm");

if(sponsorForm){

    sponsorForm.addEventListener("submit",function(e){

        e.preventDefault();

        const sponsors = getSponsors();

        const sponsor = {

            id:

                "SPO" + Date.now(),

            name:

                document.getElementById(

                    "sponsorName"

                ).value.trim(),

            company:

                document.getElementById(

                    "companyName"

                ).value.trim(),

            email:

                document.getElementById(

                    "sponsorEmail"

                ).value.trim(),

            phone:

                document.getElementById(

                    "sponsorPhone"

                ).value.trim(),

            level:

                document.getElementById(

                    "sponsorLevel"

                ).value,

            amount:

                Number(

                    document.getElementById(

                        "sponsorAmount"

                    ).value

                ),

            event:

                document.getElementById(

                    "sponsorEvent"

                ).value,

            status:

                document.getElementById(

                    "sponsorStatus"

                ).value,

            notes:

                document.getElementById(

                    "sponsorNotes"

                ).value.trim()

        };

        sponsors.push(sponsor);

        saveSponsors(sponsors);

        sponsorForm.reset();

        loadStatistics();

        loadSponsors();

        alert("✅ Sponsor added successfully.");

    });

}
/* ==========================================
            EDIT SPONSOR
========================================== */

function editSponsor(index){

    const sponsors = getSponsors();

    const sponsor = sponsors[index];

    if(!sponsor) return;

    document.getElementById("sponsorName").value = sponsor.name;

    document.getElementById("companyName").value = sponsor.company;

    document.getElementById("sponsorEmail").value = sponsor.email;

    document.getElementById("sponsorPhone").value = sponsor.phone;

    document.getElementById("sponsorLevel").value = sponsor.level;

    document.getElementById("sponsorAmount").value = sponsor.amount;

    document.getElementById("sponsorEvent").value = sponsor.event;

    document.getElementById("sponsorStatus").value = sponsor.status;

    document.getElementById("sponsorNotes").value = sponsor.notes;

    sponsors.splice(index,1);

    saveSponsors(sponsors);

    loadStatistics();

    loadSponsors();

}

/* ==========================================
            DELETE SPONSOR
========================================== */

function deleteSponsor(index){

    if(!confirm("Delete this sponsor?")){

        return;

    }

    const sponsors = getSponsors();

    sponsors.splice(index,1);

    saveSponsors(sponsors);

    loadStatistics();

    loadSponsors();

}

/* ==========================================
            SEARCH
========================================== */

const searchSponsor =

document.getElementById("searchSponsor");

if(searchSponsor){

    searchSponsor.addEventListener(

        "keyup",

        filterSponsors

    );

}

/* ==========================================
            FILTER
========================================== */

const filterLevel =

document.getElementById("filterLevel");

if(filterLevel){

    filterLevel.addEventListener(

        "change",

        filterSponsors

    );

}

/* ==========================================
            FILTER FUNCTION
========================================== */

function filterSponsors(){

    const search =

        document.getElementById(

            "searchSponsor"

        ).value.toLowerCase();

    const level =

        document.getElementById(

            "filterLevel"

        ).value;

    let sponsors = getSponsors();

    sponsors = sponsors.filter(sponsor=>{

        const matchSearch =

            sponsor.name.toLowerCase().includes(search)

            ||

            sponsor.company.toLowerCase().includes(search)

            ||

            sponsor.level.toLowerCase().includes(search)

            ||

            (sponsor.event || "").toLowerCase().includes(search);

        const matchLevel =

            level==="All"

            ||

            sponsor.level===level;

        return matchSearch && matchLevel;

    });

    loadSponsors(sponsors);

}
/* ==========================================
            TOP SPONSORS
========================================== */

function loadTopSponsors(sponsors = getSponsors()) {

    const container = document.getElementById("topSponsors");

    if (!container) return;

    container.innerHTML = "";

    if (sponsors.length === 0) {

        container.innerHTML = `

            <div class="no-data">

                No sponsors available.

            </div>

        `;

        return;

    }

    const topSponsors = [...sponsors]

        .sort((a, b) =>

            Number(b.amount || 0) -

            Number(a.amount || 0)

        )

        .slice(0, 4);

    topSponsors.forEach(sponsor => {

        let badgeClass = sponsor.level.toLowerCase();

        container.innerHTML += `

            <div class="sponsor-card">

                <h3>

                    <i class="fa-solid fa-building"></i>

                    ${sponsor.company}

                </h3>

                <p>

                    <strong>Sponsor:</strong>

                    ${sponsor.name}

                </p>

                <p>

                    <strong>Level:</strong>

                    <span class="badge ${badgeClass}">

                        ${sponsor.level}

                    </span>

                </p>

                <p>

                    <strong>Event:</strong>

                    ${sponsor.event || "Not Assigned"}

                </p>

                <p>

                    <strong>Status:</strong>

                    ${sponsor.status}

                </p>

                <div class="contribution">

                    ₹${Number(sponsor.amount).toLocaleString("en-IN")}

                </div>

            </div>

        `;

    });

}

/* ==========================================
            REFRESH PAGE
========================================== */

function refreshPage(){

    loadEvents();

    loadStatistics();

    loadSponsors();

    loadTopSponsors();

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

    if(currentUser.role !== "admin"){

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

console.log("EventAI Sponsors Loaded");

console.log("Admin :", currentUser.name);

console.log("================================");