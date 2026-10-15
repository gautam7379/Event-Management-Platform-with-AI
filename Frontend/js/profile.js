/* ==========================================
              EVENTAI PROFILE
========================================== */

let currentProfile = null;
let registrations = [];
let events = [];
let tickets = [];

const $ = id => document.getElementById(id);


/* ==========================================
              INITIALIZE
========================================== */

document.addEventListener("DOMContentLoaded", async () => {

    if (!requireLogin()) return;

    try {

        await loadProfile();
        await loadProfileData();

    } catch (error) {

        console.error("PROFILE ERROR:", error);

        alert(
            error.message ||
            "Failed to load profile"
        );
    }

});


/* ==========================================
        LOAD PROFILE FROM BACKEND
========================================== */

async function loadProfile() {

    currentProfile = await Api.me();

    console.log(
        "PROFILE FROM DATABASE:",
        currentProfile
    );

    const fullName = [
        currentProfile.first_name,
        currentProfile.last_name
    ]
    .filter(Boolean)
    .join(" ");

    // Top bar
    $("loggedUserName").textContent =
        fullName || "User";

    // Left card
    $("profileName").textContent =
        fullName || "User";

    $("profileRole").textContent =
        currentProfile.designation ||
        "Event Participant";

    // Form
    $("name").value =
        fullName;

    $("email").value =
        currentProfile.email || "";

    $("phone").value =
        currentProfile.phone || "";

    $("organization").value =
        currentProfile.organization || "";

    $("designation").value =
        currentProfile.designation || "";

    $("location").value =
        currentProfile.location || "";

    $("bio").value =
        currentProfile.bio || "";

    // Profile image
    setProfileImage(
        currentProfile.profile_image,
        fullName
    );

    // Only keep basic login/session display data locally
    localStorage.setItem(
        "userName",
        fullName
    );

    localStorage.setItem(
        "userEmail",
        currentProfile.email || ""
    );
}


/* ==========================================
             PROFILE IMAGE
========================================== */

function setProfileImage(image, name) {

    const profilePhoto =
        $("profilePhoto");

    if (!profilePhoto) return;

    if (image) {

        profilePhoto.src = image;

    } else {

        profilePhoto.src =
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                name || "User"
            )}&background=2563EB&color=fff&size=200`;
    }
}


/* ==========================================
            SAVE PROFILE
========================================== */

$("profileForm")?.addEventListener(
    "submit",
    async event => {

        event.preventDefault();

        try {

            const fullName =
                $("name").value.trim();

            if (!fullName) {

                alert("Full name is required.");
                return;
            }

            const parts =
                fullName.split(/\s+/);

            const firstName =
                parts.shift();

            const lastName =
                parts.join(" ");

            const payload = {

                first_name:
                    firstName,

                last_name:
                    lastName || "",

                phone:
                    $("phone").value.trim() || null,

                organization:
                    $("organization").value.trim() || null,

                designation:
                    $("designation").value.trim() || null,

                location:
                    $("location").value.trim() || null,

                bio:
                    $("bio").value.trim() || null
            };

            console.log(
                "SENDING PROFILE UPDATE:",
                payload
            );

            const updated =
                await Api.updateMe(payload);

            console.log(
                "UPDATED PROFILE:",
                updated
            );

            currentProfile = updated;

            await loadProfile();

            alert(
                "Profile updated successfully."
            );

        } catch (error) {

            console.error(
                "UPDATE PROFILE ERROR:",
                error
            );

            alert(
                error.message ||
                "Profile update failed"
            );
        }
    }
);


/* ==========================================
             PROFILE PHOTO
========================================== */

$("uploadPhoto")?.addEventListener(
    "change",
    event => {

        const file =
            event.target.files[0];

        if (!file) return;


        if (file.size > 2 * 1024 * 1024) {

            alert(
                "Image must be smaller than 2 MB."
            );

            event.target.value = "";

            return;
        }


        const reader =
            new FileReader();


        reader.onload =
            async readerEvent => {

                try {

                    const image =
                        readerEvent.target.result;

                    // Preview
                    $("profilePhoto").src =
                        image;

                    const updated =
                        await Api.updateMe({

                            profile_image:
                                image

                        });

                    currentProfile =
                        updated;

                    console.log(
                        "PROFILE PHOTO SAVED:",
                        updated
                    );

                    alert(
                        "Profile photo updated successfully."
                    );

                } catch (error) {

                    console.error(
                        "PHOTO ERROR:",
                        error
                    );

                    setProfileImage(
                        currentProfile?.profile_image,
                        $("name").value
                    );

                    alert(
                        error.message ||
                        "Profile photo update failed"
                    );
                }
            };


        reader.readAsDataURL(file);
    }
);


/* ==========================================
      LOAD REGISTRATION / EVENT DATA
========================================== */

async function loadProfileData() {

    // -------------------------------
    // Registrations
    // -------------------------------

    try {

        registrations =
            await Api.registrations.mine();

    } catch (error) {

        console.error(
            "Registration loading error:",
            error
        );

        registrations = [];
    }


    // -------------------------------
    // Events
    // -------------------------------

    try {

        events =
            await Api.events.list();

    } catch (error) {

        console.error(
            "Event loading error:",
            error
        );

        events = [];
    }


    // -------------------------------
    // Tickets
    // -------------------------------

    tickets = [];

    for (const event of events) {

        try {

            const eventTickets =
                await Api.tickets.event(
                    event.id
                );

            tickets.push(
                ...eventTickets
            );

        } catch (error) {

            console.warn(
                `Tickets unavailable for event ${event.id}`
            );
        }
    }


    console.log(
        "REGISTRATIONS:",
        registrations
    );

    console.log(
        "EVENTS:",
        events
    );

    console.log(
        "TICKETS:",
        tickets
    );


    loadStatistics();
    loadRecentTickets();
    loadRecentActivity();
    loadAchievements();
}


/* ==========================================
             STATISTICS
========================================== */

function loadStatistics() {

    const activeRegistrations =
        registrations.filter(registration =>

            String(
                registration.status
            ).toLowerCase() !== "cancelled"

        );


    const completed =
        activeRegistrations.filter(registration => {

            const event =
                events.find(
                    event =>
                        Number(event.id) ===
                        Number(registration.event_id)
                );

            if (!event) return false;

            return String(
                event.status
            ).toLowerCase() === "completed";

        });


    $("registeredEvents").textContent =
        activeRegistrations.length;

    $("ticketCount").textContent =
        activeRegistrations.length;

    $("completedEvents").textContent =
        completed.length;
}


/* ==========================================
             RECENT TICKETS
========================================== */

function loadRecentTickets() {

    const table =
        $("recentTickets");

    if (!table) return;


    const activeRegistrations =
        registrations
            .filter(registration =>

                String(
                    registration.status
                ).toLowerCase() !== "cancelled"

            )
            .sort((a, b) =>

                new Date(
                    b.registration_date || 0
                ) -
                new Date(
                    a.registration_date || 0
                )

            )
            .slice(0, 5);


    if (!activeRegistrations.length) {

        table.innerHTML = `

            <tr>

                <td colspan="4"
                    style="text-align:center;padding:20px;">

                    No tickets available.

                </td>

            </tr>
        `;

        return;
    }


    table.innerHTML =
        activeRegistrations.map(
            registration => {

                const event =
                    events.find(
                        event =>
                            Number(event.id) ===
                            Number(registration.event_id)
                    );


                const date =
                    registration.registration_date
                        ? new Date(
                            registration.registration_date
                        ).toLocaleDateString("en-IN")
                        : "-";


                return `

                    <tr>

                        <td>
                            ${registration.id}
                        </td>

                        <td>
                            ${event?.event_name || "-"}
                        </td>

                        <td>
                            ${date}
                        </td>

                        <td>

                            <span class="badge">

                                ${registration.status || "-"}

                            </span>

                        </td>

                    </tr>
                `;
            }
        ).join("");
}


/* ==========================================
             RECENT ACTIVITY
========================================== */

function loadRecentActivity() {

    const list =
        $("activityTimeline");

    if (!list) return;


    const recent =
        [...registrations]
            .sort((a, b) =>

                new Date(
                    b.registration_date || 0
                ) -
                new Date(
                    a.registration_date || 0
                )

            )
            .slice(0, 5);


    if (!recent.length) {

        list.innerHTML = `

            <li>

                <strong>
                    No recent activity.
                </strong>

                <small>
                    Register for an event to see activity.
                </small>

            </li>
        `;

        return;
    }


    list.innerHTML =
        recent.map(registration => {

            const event =
                events.find(
                    event =>
                        Number(event.id) ===
                        Number(registration.event_id)
                );


            const date =
                registration.registration_date
                    ? new Date(
                        registration.registration_date
                    ).toLocaleDateString("en-IN")
                    : "-";


            return `

                <li>

                    <strong>

                        ${registration.status === "Cancelled"
                            ? "Cancelled registration for"
                            : "Registered for"}

                        ${event?.event_name || "event"}

                    </strong>

                    <small>
                        ${date}
                    </small>

                </li>
            `;

        }).join("");
}


/* ==========================================
             ACHIEVEMENTS
========================================== */

function loadAchievements() {

    const active =
        registrations.filter(registration =>

            String(
                registration.status
            ).toLowerCase() !== "cancelled"

        );


    const count =
        active.length;


    $("badgeEvents").textContent =
        count;

    $("badgeTickets").textContent =
        count;


    let level =
        "Beginner";

    if (count >= 5)
        level = "Explorer";

    if (count >= 10)
        level = "Expert";

    if (count >= 20)
        level = "Champion";


    $("badgeParticipation").textContent =
        level;
}


console.log(
    "EventAI backend profile module loaded"
);