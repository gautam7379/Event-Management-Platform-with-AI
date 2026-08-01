/* ==========================================
            EVENTAI PROFILE
========================================== */

/* ==========================================
            CURRENT USER
========================================== */

const currentUser = {

    name: localStorage.getItem("userName") || "User",

    email: localStorage.getItem("userEmail") || "",

    role: localStorage.getItem("userRole") || "user"

};

/* ==========================================
            LOAD PROFILE
========================================== */

function loadProfile() {

    const savedProfile = JSON.parse(

        localStorage.getItem("profile_" + currentUser.email)

    ) || {};

    document.getElementById("loggedUserName").textContent =
        currentUser.name;

    document.getElementById("profileName").textContent =
        savedProfile.name || currentUser.name;

    document.getElementById("profileRole").textContent =
        savedProfile.designation || "Event Participant";

    document.getElementById("name").value =
        savedProfile.name || currentUser.name;

    document.getElementById("email").value =
        currentUser.email;

    document.getElementById("phone").value =
        savedProfile.phone || "";

    document.getElementById("organization").value =
        savedProfile.organization || "";

    document.getElementById("designation").value =
        savedProfile.designation || "";

    document.getElementById("location").value =
        savedProfile.location || "";

    document.getElementById("bio").value =
        savedProfile.bio || "";

    if(savedProfile.photo){

        document.getElementById("profilePhoto").src =
            savedProfile.photo;

    }

}

/* ==========================================
            SECURITY
========================================== */

document.addEventListener("DOMContentLoaded",()=>{

    if(currentUser.role!=="user"){

        window.location.href="dashboard.html";

        return;

    }

    loadProfile();

});
/* ==========================================
            SAVE PROFILE
========================================== */

const profileForm =

document.getElementById("profileForm");

if(profileForm){

    profileForm.addEventListener("submit",function(e){

        e.preventDefault();

        const profile = {

            name:

                document.getElementById("name").value.trim(),

            email:

                currentUser.email,

            phone:

                document.getElementById("phone").value.trim(),

            organization:

                document.getElementById("organization").value.trim(),

            designation:

                document.getElementById("designation").value.trim(),

            location:

                document.getElementById("location").value.trim(),

            bio:

                document.getElementById("bio").value.trim()

        };

        // Preserve existing photo if available
        const oldProfile = JSON.parse(

            localStorage.getItem(

                "profile_" + currentUser.email

            )

        ) || {};

        if(oldProfile.photo){

            profile.photo = oldProfile.photo;

        }

        localStorage.setItem(

            "profile_" + currentUser.email,

            JSON.stringify(profile)

        );

        // Update current session name
        localStorage.setItem(

            "userName",

            profile.name

        );

        // Update page immediately
        document.getElementById("profileName").textContent =

            profile.name;

        document.getElementById("profileRole").textContent =

            profile.designation ||

            "Event Participant";

        document.getElementById("loggedUserName").textContent =

            profile.name;

        alert("✅ Profile updated successfully.");

    });

}
/* ==========================================
            PROFILE PHOTO
========================================== */

const uploadPhoto =

document.getElementById("uploadPhoto");

if(uploadPhoto){

    uploadPhoto.addEventListener("change",function(e){

        const file = e.target.files[0];

        if(!file) return;

        const reader = new FileReader();

        reader.onload = function(event){

            const image = event.target.result;

            document.getElementById("profilePhoto").src = image;

            const profile = JSON.parse(

                localStorage.getItem(

                    "profile_" + currentUser.email

                )

            ) || {};

            profile.photo = image;

            localStorage.setItem(

                "profile_" + currentUser.email,

                JSON.stringify(profile)

            );

        };

        reader.readAsDataURL(file);

    });

}

/* ==========================================
            PROFILE STATISTICS
========================================== */

function loadStatistics(){

    const attendees = JSON.parse(

        localStorage.getItem("attendees")

    ) || [];

    const tickets = JSON.parse(

        localStorage.getItem("tickets")

    ) || [];

    const events = JSON.parse(

        localStorage.getItem("events")

    ) || [];

    const myAttendees = attendees.filter(

        attendee =>

        attendee.email === currentUser.email

    );

    const myTickets = tickets.filter(

        ticket =>

        ticket.email === currentUser.email

    );

    document.getElementById("registeredEvents").textContent =

        myAttendees.length;

    document.getElementById("ticketCount").textContent =

        myTickets.length;

    let completed = 0;

    myAttendees.forEach(attendee=>{

        const event = events.find(

            e=>e.id==attendee.eventId

        );

        if(

            event &&

            event.status==="Completed"

        ){

            completed++;

        }

    });

    document.getElementById("completedEvents").textContent =

        completed;

}

/* ==========================================
            RECENT TICKETS
========================================== */

function loadRecentTickets(){

    const table =

        document.getElementById("recentTickets");

    if(!table) return;

    table.innerHTML = "";

    const tickets = JSON.parse(

        localStorage.getItem("tickets")

    ) || [];

    const myTickets = tickets.filter(

        ticket=>ticket.email===currentUser.email

    );

    if(myTickets.length===0){

        table.innerHTML=`

        <tr>

            <td colspan="4"

                style="text-align:center;padding:20px;">

                No tickets available.

            </td>

        </tr>

        `;

        return;

    }

    myTickets.slice(-5).reverse().forEach(ticket=>{

        table.innerHTML+=`

        <tr>

            <td>

                ${ticket.ticketId}

            </td>

            <td>

                ${ticket.eventName}

            </td>

            <td>

                ${new Date(ticket.date).toLocaleDateString("en-IN")}

            </td>

            <td>

                <span class="badge completed">

                    ${ticket.status}

                </span>

            </td>

        </tr>

        `;

    });

}
/* ==========================================
            RECENT ACTIVITY
========================================== */

function loadRecentActivity() {

    const activityList =

        document.getElementById("activityTimeline");

    if (!activityList) return;

    activityList.innerHTML = "";

    const attendees = JSON.parse(

        localStorage.getItem("attendees")

    ) || [];

    const myActivities = attendees.filter(

        attendee =>

        attendee.email === currentUser.email

    );

    if (myActivities.length === 0) {

        activityList.innerHTML = `

            <li>

                <strong>No recent activity.</strong>

                <small>Register for an event to see activity.</small>

            </li>

        `;

        return;

    }

    myActivities.slice(-5).reverse().forEach(activity => {

        activityList.innerHTML += `

            <li>

                <strong>

                    Registered for

                    ${activity.eventName}

                </strong>

                <small>

                    ${new Date(activity.registrationDate || Date.now())
                        .toLocaleDateString("en-IN")}

                </small>

            </li>

        `;

    });

}

/* ==========================================
            ACHIEVEMENTS
========================================== */

function loadAchievements() {

    const attendees = JSON.parse(

        localStorage.getItem("attendees")

    ) || [];

    const tickets = JSON.parse(

        localStorage.getItem("tickets")

    ) || [];

    const myEvents = attendees.filter(

        attendee =>

        attendee.email === currentUser.email

    ).length;

    const myTickets = tickets.filter(

        ticket =>

        ticket.email === currentUser.email

    ).length;

    document.getElementById("badgeEvents").textContent =

        myEvents;

    document.getElementById("badgeTickets").textContent =

        myTickets;

    let level = "Beginner";

    if (myEvents >= 5) {

        level = "Explorer";

    }

    if (myEvents >= 10) {

        level = "Expert";

    }

    if (myEvents >= 20) {

        level = "Champion";

    }

    document.getElementById("badgeParticipation").textContent =

        level;

}

/* ==========================================
            REFRESH PROFILE
========================================== */

function refreshProfile() {

    loadProfile();

    loadStatistics();

    loadRecentTickets();

    loadRecentActivity();

    loadAchievements();

}

/* ==========================================
            AUTO REFRESH
========================================== */

window.addEventListener("storage", () => {

    refreshProfile();

});

/* ==========================================
            INITIALIZE
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    if (currentUser.role !== "user") {

        window.location.href = "dashboard.html";

        return;

    }

    refreshProfile();

});

/* ==========================================
            DEBUG
========================================== */

console.log("===================================");

console.log("EventAI Profile Loaded");

console.log("User :", currentUser.name);

console.log("Email :", currentUser.email);

console.log("===================================");