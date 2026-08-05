const API_BASE = window.EVENTAI_API_BASE || "/api";

const Api = {
   
    // AUTH TOKEN
    token: () => localStorage.getItem("accessToken"),

    // GENERIC REQUEST
    async request(
        path,
        {
            method = "GET",
            body,
            form = false,
            auth = true
        } = {}
    ) {

        const headers = {};

        // Add JWT for authenticated endpoints
        if (auth && this.token()) {
            headers.Authorization =
                `Bearer ${this.token()}`;
        }

        let payload;
        if (body !== undefined) {

            if (form) {

                headers["Content-Type"] =
                    "application/x-www-form-urlencoded";

                payload =
                    new URLSearchParams(body).toString();

            } else {

                headers["Content-Type"] =
                    "application/json";

                payload =
                    JSON.stringify(body);
            }
        }


        const res = await fetch(
            `${API_BASE}${path}`,
            {
                method,
                headers,
                body: payload
            }
        );


        if (res.status === 204) {
            return null;
        }


        const data =
            await res.json().catch(() => ({}));


        if (!res.ok) {

            const detail =
                Array.isArray(data.detail)

                    ? data.detail
                        .map(x =>
                            `${x.loc?.slice(-1)[0] || "field"}: ${x.msg}`
                        )
                        .join("; ")

                    : (
                        data.detail ||
                        data.message ||
                        `HTTP ${res.status}`
                    );


            throw new Error(detail);
        }


        return data;
    },


    // ==========================================
    // AUTH
    // ==========================================

    login: (email, password) =>
        Api.request(
            "/auth/login",
            {
                method: "POST",

                body: {
                    username: email,
                    password
                },

                form: true,
                auth: false
            }
        ),


    register: data =>
        Api.request(
            "/auth/register",
            {
                method: "POST",
                body: data,
                auth: false
            }
        ),


    me: () =>
        Api.request("/auth/me"),

    updateMe: data =>
        Api.request(
            "/auth/me",
            {
                method: "PUT",
                body: data
            }
        ),


    // ==========================================
    // EVENTS
    // ==========================================

    events: {

            list() {
                return Api.request(
                    "/events/",
                    {
                        auth: false
                    }
                );
            },

            get(id) {
                return Api.request(
                    `/events/${id}`,
                    {
                        auth: false
                    }
                );
            },

            create(data) {
                return Api.request(
                    "/events/",
                    {
                        method: "POST",
                        body: data
                    }
                );
            },

            update(id, data) {
                return Api.request(
                    `/events/${id}`,
                    {
                        method: "PUT",
                        body: data
                    }
                );
            },

            remove(id) {
                return Api.request(
                    `/events/${id}`,
                    {
                        method: "DELETE"
                    }
                );
            }

        },



    eventVendors: {

        list: () =>
            Api.request(
                "/event-vendors/",
                { auth: false }
            ),

        create: data =>
            Api.request(
                "/event-vendors/",
                {
                    method: "POST",
                    body: data
                }
            ),

        byEvent: eventId =>
            Api.request(
                `/event-vendors/event/${eventId}`,
                { auth: false }
            ),

        byVendor: vendorId =>
            Api.request(
                `/event-vendors/vendor/${vendorId}`,
                { auth: false }
            ),

        remove: assignmentId =>
            Api.request(
                `/event-vendors/${assignmentId}`,
                {
                    method: "DELETE"
                }
            )
    },


    // ==========================================
    // VENUES
    // ==========================================

    venues: {

        list: () =>
            Api.request(
                "/venues/",
                { auth: false }
            ),

        get: id =>
            Api.request(
                `/venues/${id}`,
                { auth: false }
            ),

        create: data =>
            Api.request(
                "/venues/",
                {
                    method: "POST",
                    body: data
                }
            ),

        update: (id, data) =>
            Api.request(
                `/venues/${id}`,
                {
                    method: "PUT",
                    body: data
                }
            ),

        remove: id =>
            Api.request(
                `/venues/${id}`,
                {
                    method: "DELETE"
                }
            )
    },


    // ==========================================
    // VENDORS
    // ==========================================

    vendors: {

        list: () =>
            Api.request(
                "/vendors/",
                { auth: false }
            ),

        create: data =>
            Api.request(
                "/vendors/",
                {
                    method: "POST",
                    body: data
                }
            ),

        update: (id, data) =>
            Api.request(
                `/vendors/${id}`,
                {
                    method: "PUT",
                    body: data
                }
            ),

        remove: id =>
            Api.request(
                `/vendors/${id}`,
                {
                    method: "DELETE"
                }
            )
    },


    // ==========================================
    // SPONSORS
    // ==========================================

    sponsors: {

        list: () =>
            Api.request(
                "/sponsors/",
                { auth: false }
            ),

        create: data =>
            Api.request(
                "/sponsors/",
                {
                    method: "POST",
                    body: data
                }
            ),

        update: (id, data) =>
            Api.request(
                `/sponsors/${id}`,
                {
                    method: "PUT",
                    body: data
                }
            ),

        remove: id =>
            Api.request(
                `/sponsors/${id}`,
                {
                    method: "DELETE"
                }
            )
    },
 
    /* ==========================================
            EVENT SPONSORS
    ========================================== */

    eventSponsors: {

        list() {
            return Api.request(
                "/event-sponsors/"
            );
        },

        create(data) {
            return Api.request(
                "/event-sponsors/",
                {
                    method: "POST",
                    body: data
                }
            );
        },

        byEvent(eventId) {
            return Api.request(
                `/event-sponsors/event/${eventId}`
            );
        },

        bySponsor(sponsorId) {
            return Api.request(
                `/event-sponsors/sponsor/${sponsorId}`
            );
        },

        remove(assignmentId) {
            return Api.request(
                `/event-sponsors/${assignmentId}`,
                {
                    method: "DELETE"
                }
            );
        }

    },


    // ==========================================
    // SPEAKERS
    // ==========================================

    speakers: {

        list: () =>
            Api.request(
                "/speakers/",
                { auth: false }
            ),

        create: data =>
            Api.request(
                "/speakers/",
                {
                    method: "POST",
                    body: data
                }
            ),

        update: (id, data) =>
            Api.request(
                `/speakers/${id}`,
                {
                    method: "PUT",
                    body: data
                }
            ),

        remove: id =>
            Api.request(
                `/speakers/${id}`,
                {
                    method: "DELETE"
                }
            )
    },

    eventSpeakers: {
        list: () =>
            Api.request("/event-speakers/", {
                auth: false
            }),

        create: data =>
            Api.request("/event-speakers/", {
                method: "POST",
                body: data
            }),

        remove: id =>
            Api.request(`/event-speakers/${id}`, {
                method: "DELETE"
            })
    },


    // ==========================================
    // SESSIONS
    // ==========================================

    sessions: {

        list: () =>
            Api.request(
                "/sessions/",
                { auth: false }
            ),

        create: data =>
            Api.request(
                "/sessions/",
                {
                    method: "POST",
                    body: data
                }
            ),

        update: (id, data) =>
            Api.request(
                `/sessions/${id}`,
                {
                    method: "PUT",
                    body: data
                }
            ),

        remove: id =>
            Api.request(
                `/sessions/${id}`,
                {
                    method: "DELETE"
                }
            )
    },


    // ==========================================
    // TICKETS
    // ==========================================

    tickets: {

        event(eventId) {
            return Api.request(
                `/tickets/event/${eventId}`,
                {
                    auth: false
                }
            );
        },

        get(ticketId) {
            return Api.request(
                `/tickets/${ticketId}`,
                {
                    auth: false
                }
            );
        },

        create(data) {
            return Api.request(
                "/tickets/",
                {
                    method: "POST",
                    body: data
                }
            );
        },

        view(registrationId) {
            return Api.request(
                `/tickets/view/${registrationId}`
            );
        }

    },


    // ==========================================
    // REGISTRATIONS
    // ==========================================

    registrations: {

        // Admin / Organizer - all registrations
        list() {
            return Api.request(
                "/registrations/",
                {
                    method: "GET",
                    auth: true
                }
            );
        },

        // Current logged-in user's registrations
        mine() {
            return Api.request(
                "/registrations/my",
                {
                    method: "GET",
                    auth: true
                }
            );
        },

        // Create registration
        create(data) {
            return Api.request(
                "/registrations/",
                {
                    method: "POST",
                    body: data,
                    auth: true
                }
            );
        },

        adminCreateAttendee(data) {

            return Api.request(
                "/registrations/admin-attendee",
                {
                    method: "POST",
                    body: data,
                    auth: true
                }
            );
        },

        // Cancel registration
        cancel(id) {
            return Api.request(
                `/registrations/${id}`,
                {
                    method: "DELETE",
                    auth: true
                }
            );
        },

        // Admin / Organizer - detailed attendees
        attendees() {
            return Api.request(
                "/registrations/attendees",
                {
                    method: "GET",
                    auth: true
                }
            );
        }

    },


    // ==========================================
    // CHECK-INS
    // ==========================================

    checkins: {

        // Create attendee check-in
        create(data) {
            return Api.request(
                "/checkins/",
                {
                    method: "POST",
                    body: data,
                    auth: true
                }
            );
        }

    },


    // ==========================================
    // ADMIN
    // IMPORTANT: JWT IS INCLUDED
    // ==========================================


    // ==========================================
    // ADMIN
    // IMPORTANT: JWT IS NOW INCLUDED
    // ==========================================

    // ==========================================
    // USERS - ADMIN
    // ==========================================

    users: {

        list() {

            return Api.request(
                "/admin/users"
            );
        }

    },

    analytics: () =>
        Api.request(
            "/admin/dashboard/analytics"
        ),


    charts: () =>
        Api.request(
            "/admin/dashboard/charts"
        ),


    // ==========================================
    // AI
    // ==========================================

    chat: (eventId, question) => {

        const body = {
            question: question
        };

        // Specific event mode
        if (
            eventId !== null &&
            eventId !== undefined &&
            eventId !== "" &&
            eventId !== "all"
        ) {
            body.event_id = Number(eventId);
        }

        // Platform-wide mode:
        // event_id is intentionally not sent.

        return Api.request(
            "/ai/chat/",
            {
                method: "POST",
                body: body,
                auth: true
            }
        );
    },

    // ==========================================
    // USER AI CHAT
    // ==========================================

    userChat: (question) =>

        Api.request(
            "/ai/chat/user",
            {
                method: "POST",

                body: {
                    event_id: null,
                    question: question
                },

                auth: true
            }
        ),
};


window.Api = Api;


// ==================================================
// REQUIRE LOGIN
// ==================================================

window.requireLogin = () => {

    if (!Api.token()) {

        location.href = "login.html";

        return false;
    }

    return true;
};


// ==================================================
// REQUIRE ADMIN
// ==================================================

window.requireAdmin = () => {

    if (!requireLogin()) {
        return false;
    }

    const roleId =
        Number(localStorage.getItem("roleId"));

    const userRole =
        localStorage.getItem("userRole");


    if (
        roleId !== 1 &&
        userRole !== "admin"
    ) {

        alert("Admin access required.");

        return false;
    }


    return true;
};


// ==================================================
// LOGOUT
// ==================================================

window.logout = () => {

    [
        "accessToken",
        "isLoggedIn",
        "userRole",
        "userName",
        "userEmail",
        "userId",
        "roleId"
    ].forEach(key =>
        localStorage.removeItem(key)
    );


    location.href = "login.html";
};