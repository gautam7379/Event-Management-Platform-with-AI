// ==========================================
// EVENTAI TICKETS - BACKEND VERSION
// ==========================================

let tickets = [];

const currentUser = {
    name: localStorage.getItem("userName") || "User",
    role: localStorage.getItem("userRole") || "user"
};


// ==========================================
// ELEMENTS
// ==========================================

const ticketTable =
    document.getElementById("ticketTable");

const searchBox =
    document.getElementById("searchTicket");

const statusFilter =
    document.getElementById("statusFilter");

const emptyMessage =
    document.getElementById("emptyMessage");


// ==========================================
// LOAD USER
// ==========================================

function loadUser() {

    const userElement =
        document.getElementById("loggedUserName");

    if (userElement) {
        userElement.textContent =
            currentUser.name;
    }
}


// ==========================================
// LOAD TICKETS FROM BACKEND
// ==========================================

async function loadTicketsFromBackend() {

    try {

        console.log(
            "Loading tickets from backend..."
        );

        let registrations;


        // ----------------------------------
        // Admin / Organizer
        // ----------------------------------

        if (
            currentUser.role === "admin" ||
            currentUser.role === "organizer"
        ) {

            registrations =
                await Api.registrations.list();

        }

        // ----------------------------------
        // Normal User
        // ----------------------------------

        else {

            registrations =
                await Api.registrations.mine();

        }


        console.log(
            "REGISTRATIONS:",
            registrations
        );


        // ----------------------------------
        // Load complete ticket view
        // ----------------------------------

        const results =
            await Promise.allSettled(

                registrations.map(
                    registration =>
                        Api.tickets.view(
                            registration.id
                        )
                )

            );


        tickets = results

            .filter(
                result =>
                    result.status === "fulfilled"
            )

            .map(
                result =>
                    result.value
            );


        // Log failed tickets
        results.forEach(
            (result, index) => {

                if (
                    result.status === "rejected"
                ) {

                    console.warn(
                        "Could not load ticket for registration:",
                        registrations[index].id,
                        result.reason
                    );

                }

            }
        );


        console.log(
            "TICKETS FROM BACKEND:",
            tickets
        );


        loadStatistics();

        renderTickets(tickets);


    } catch (error) {

        console.error(
            "Ticket loading failed:",
            error
        );

        tickets = [];

        loadStatistics();

        renderTickets([]);

        alert(
            error.message ||
            "Failed to load tickets."
        );
    }
}


// ==========================================
// STATISTICS
// ==========================================

function loadStatistics() {

    const total =
        document.getElementById(
            "totalTickets"
        );

    const confirmed =
        document.getElementById(
            "confirmedTickets"
        );

    const pending =
        document.getElementById(
            "pendingTickets"
        );

    const cancelled =
        document.getElementById(
            "cancelledTickets"
        );


    if (total) {

        total.textContent =
            tickets.length;
    }


    if (confirmed) {

        confirmed.textContent =
            tickets.filter(
                ticket =>
                    String(ticket.status)
                        .toLowerCase()
                    === "confirmed"
            ).length;
    }


    if (pending) {

        pending.textContent =
            tickets.filter(
                ticket =>
                    String(ticket.status)
                        .toLowerCase()
                    === "pending"
            ).length;
    }


    if (cancelled) {

        cancelled.textContent =
            tickets.filter(
                ticket =>
                    String(ticket.status)
                        .toLowerCase()
                    === "cancelled"
            ).length;
    }
}


// ==========================================
// FORMAT DATE
// ==========================================

function formatDate(date) {

    if (!date) {
        return "-";
    }

    const parsed =
        new Date(
            date + "T00:00:00"
        );

    if (
        Number.isNaN(
            parsed.getTime()
        )
    ) {
        return date;
    }

    return parsed.toLocaleDateString(
        "en-IN"
    );
}


// ==========================================
// BADGE CLASS
// ==========================================

function getBadgeClass(status) {

    const value =
        String(status || "")
            .toLowerCase();

    if (value === "confirmed") {
        return "completed";
    }

    if (value === "pending") {
        return "pending";
    }

    if (value === "cancelled") {
        return "cancelled";
    }

    return "pending";
}


// ==========================================
// RENDER TICKETS
// ==========================================

function renderTickets(
    ticketList = tickets
) {

    if (!ticketTable) {
        return;
    }


    ticketTable.innerHTML = "";


    if (
        !ticketList ||
        ticketList.length === 0
    ) {

        if (emptyMessage) {

            emptyMessage.style.display =
                "block";
        }

        return;
    }


    if (emptyMessage) {

        emptyMessage.style.display =
            "none";
    }


    ticketTable.innerHTML =
        ticketList.map(ticket => {

            const badgeClass =
                getBadgeClass(
                    ticket.status
                );


            const ticketNumber =
                ticket.registration_number ||
                `REG-${ticket.registration_id}`;


            const price =
                Number(
                    ticket.price || 0
                );


            return `

                <tr>

                    <td>
                        ${ticketNumber}
                    </td>

                    <td>
                        ${ticket.holder_name || "-"}
                    </td>

                    <td>
                        ${ticket.event_name || "-"}
                    </td>

                    <td>
                        ${formatDate(ticket.date)}
                    </td>

                    <td>
                        ${ticket.venue || "-"}
                    </td>

                    <td>
                        ${
                            price > 0

                            ? "₹" +
                              price.toLocaleString(
                                  "en-IN"
                              )

                            : "Free"
                        }
                    </td>

                    <td>

                        <span
                            class="badge ${badgeClass}"
                        >

                            ${ticket.status || "-"}

                        </span>

                    </td>

                    <td>

                        <button
                            class="action-btn view"
                            onclick="viewTicket(
                                ${ticket.registration_id}
                            )"
                            title="View Ticket"
                        >

                            <i
                                class="fa-solid fa-eye"
                            ></i>

                        </button>


                        <button
                            class="action-btn edit"
                            onclick="downloadTicket(
                                ${ticket.registration_id}
                            )"
                            title="Download Ticket"
                        >

                            <i
                                class="fa-solid fa-download"
                            ></i>

                        </button>

                    </td>

                </tr>

            `;

        }).join("");
}


// ==========================================
// FILTER
// ==========================================

function filterTickets() {

    const search =
        searchBox
            ? searchBox.value
                .trim()
                .toLowerCase()
            : "";


    const status =
        statusFilter
            ? statusFilter.value
            : "All";


    const filtered =
        tickets.filter(ticket => {


            const ticketNumber =
                String(
                    ticket.registration_number ||
                    ticket.registration_id ||
                    ""
                ).toLowerCase();


            const holder =
                String(
                    ticket.holder_name || ""
                ).toLowerCase();


            const eventName =
                String(
                    ticket.event_name || ""
                ).toLowerCase();


            const email =
                String(
                    ticket.email || ""
                ).toLowerCase();


            const matchesSearch =

                ticketNumber.includes(search)

                ||

                holder.includes(search)

                ||

                eventName.includes(search)

                ||

                email.includes(search);


            const matchesStatus =

                status === "All"

                ||

                String(ticket.status)
                    .toLowerCase()

                ===

                status.toLowerCase();


            return (
                matchesSearch &&
                matchesStatus
            );

        });


    renderTickets(filtered);
}


// ==========================================
// VIEW TICKET
// ==========================================

async function viewTicket(
    registrationId
) {

    try {

        const ticket =
            await Api.tickets.view(
                registrationId
            );


        const modal =
            document.getElementById(
                "ticketModal"
            );


        const content =
            document.getElementById(
                "ticketContent"
            );


        if (!modal || !content) {
            return;
        }


        const price =
            Number(
                ticket.price || 0
            );


        content.innerHTML = `

            <div
                style="
                    padding:20px;
                    line-height:2;
                "
            >

                <h2>
                    ${ticket.event_name}
                </h2>


                <p>
                    <strong>
                        Ticket:
                    </strong>

                    ${ticket.registration_number}
                </p>


                <p>
                    <strong>
                        Holder:
                    </strong>

                    ${ticket.holder_name}
                </p>


                <p>
                    <strong>
                        Email:
                    </strong>

                    ${ticket.email}
                </p>


                <p>
                    <strong>
                        Event:
                    </strong>

                    ${ticket.event_name}
                </p>


                <p>
                    <strong>
                        Venue:
                    </strong>

                    ${ticket.venue}
                </p>


                <p>
                    <strong>
                        Date:
                    </strong>

                    ${formatDate(ticket.date)}
                </p>


                <p>
                    <strong>
                        Category:
                    </strong>

                    ${ticket.ticket_category}
                </p>


                <p>
                    <strong>
                        Price:
                    </strong>

                    ${
                        price > 0

                        ? "₹" +
                          price.toLocaleString(
                              "en-IN"
                          )

                        : "Free"
                    }
                </p>


                <p>
                    <strong>
                        Status:
                    </strong>

                    ${ticket.status}
                </p>


                <br>


                <button
                    class="action-btn edit"
                    onclick="
                        downloadTicket(
                            ${ticket.registration_id}
                        )
                    "
                >

                    <i
                        class="fa-solid fa-download"
                    ></i>

                    Download Ticket

                </button>

            </div>

        `;


        modal.style.display =
            "block";


    } catch (error) {

        console.error(
            "View ticket failed:",
            error
        );

        alert(
            error.message ||
            "Unable to load ticket."
        );
    }
}


// ==========================================
// DOWNLOAD TICKET PDF
// ==========================================

async function downloadTicket(
    registrationId
) {

    try {

        const token =
            localStorage.getItem(
                "accessToken"
            );


        if (!token) {

            alert(
                "Please login again."
            );

            return;
        }


        const response =
            await fetch(
                `/api/registrations/${registrationId}/download`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );


        if (!response.ok) {

            const error =
                await response
                    .json()
                    .catch(() => ({}));


            throw new Error(
                error.detail ||
                "Ticket download failed."
            );
        }


        const blob =
            await response.blob();


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
            `ticket-${registrationId}.pdf`;


        document.body.appendChild(
            link
        );


        link.click();


        link.remove();


        URL.revokeObjectURL(
            url
        );


    } catch (error) {

        console.error(
            "Download failed:",
            error
        );

        alert(
            error.message
        );
    }
}


// ==========================================
// SEARCH EVENTS
// ==========================================

if (searchBox) {

    searchBox.addEventListener(
        "input",
        filterTickets
    );
}


if (statusFilter) {

    statusFilter.addEventListener(
        "change",
        filterTickets
    );
}


// ==========================================
// INITIALIZE
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        loadUser();

        await loadTicketsFromBackend();

    }
);


// ==========================================
// EXPORT
// ==========================================

window.viewTicket =
    viewTicket;

window.downloadTicket =
    downloadTicket;


// ==========================================
// DEBUG
// ==========================================

console.log(
    "EventAI Tickets Backend Version Loaded"
);