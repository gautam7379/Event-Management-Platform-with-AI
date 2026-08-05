// ======================================================
// Vendor Management
// Database-backed Event ↔ Vendor assignment
// ======================================================

let vendors = [];
let events = [];
let assignments = [];
let editing = null;

const $ = id => document.getElementById(id);


// ======================================================
// LOAD EVENTS
// ======================================================

async function loadEvents() {

    events = await Api.events.list();

    const select = $("vendorEvent");

    if (!select) return;

    select.innerHTML =
        `<option value="">Select Event</option>` +
        events.map(event => `
            <option value="${event.id}">
                ${event.event_name}
            </option>
        `).join("");
}


// ======================================================
// LOAD EVENT-VENDOR ASSIGNMENTS
// ======================================================

async function loadAssignments() {

    assignments = await Api.eventVendors.list();
}


// ======================================================
// GET EVENT NAMES FOR VENDOR
// ======================================================

function getVendorEventNames(vendorId) {

    const vendorAssignments =
        assignments.filter(
            assignment =>
                Number(assignment.vendor_id) === Number(vendorId)
        );

    const names =
        vendorAssignments
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


// ======================================================
// REFRESH
// ======================================================

async function refresh() {

    [
        vendors,
        events,
        assignments
    ] = await Promise.all([
        Api.vendors.list(),
        Api.events.list(),
        Api.eventVendors.list()
    ]);

    $("totalVendors").textContent =
        vendors.length;

    $("activeVendors").textContent =
        vendors.filter(
            vendor => vendor.status === "Active"
        ).length;

    $("serviceCategories").textContent =
        new Set(
            vendors.map(
                vendor => vendor.vendor_type
            )
        ).size;

    $("vendorBudget").textContent =
        "₹" +
        vendors.reduce(
            (total, vendor) =>
                total + Number(vendor.cost || 0),
            0
        ).toLocaleString("en-IN");

    render(vendors);
}


// ======================================================
// RENDER TABLE
// ======================================================

function render(list) {

    const table = $("vendorTable");

    if (!table) return;

    if (!list.length) {

        table.innerHTML = `
            <tr>
                <td colspan="9">
                    No vendors available.
                </td>
            </tr>
        `;

        return;
    }


    table.innerHTML =
        list.map(vendor => {

            const eventNames =
                getVendorEventNames(vendor.id);

            return `
                <tr>

                    <td>
                        ${vendor.id}
                    </td>

                    <td>
                        ${vendor.vendor_name}
                    </td>

                    <td>
                        ${vendor.vendor_type}
                    </td>

                    <td>
                        ${eventNames}
                    </td>

                    <td>
                        ${vendor.contact_person || "-"}
                    </td>

                    <td>
                        ${vendor.phone || "-"}
                    </td>

                    <td>
                        ₹${Number(
                            vendor.cost || 0
                        ).toLocaleString("en-IN")}
                    </td>

                    <td>
                        ${vendor.status}
                    </td>

                    <td>

                        <button
                            type="button"
                            onclick="editVendor(${vendor.id})"
                        >
                            Edit
                        </button>

                        <button
                            type="button"
                            onclick="deleteVendor(${vendor.id})"
                        >
                            Delete
                        </button>

                    </td>

                </tr>
            `;
        }).join("");
}


// ======================================================
// EDIT VENDOR
// ======================================================

window.editVendor = id => {

    const vendor =
        vendors.find(
            vendor =>
                Number(vendor.id) === Number(id)
        );

    if (!vendor) return;

    editing = id;

    $("vendorName").value =
        vendor.vendor_name;

    $("vendorCategory").value =
        vendor.vendor_type;

    $("vendorContact").value =
        vendor.contact_person || "";

    $("vendorPhone").value =
        vendor.phone || "";

    $("vendorEmail").value =
        vendor.email || "";

    $("vendorBudgetInput").value =
        vendor.cost;

    $("vendorStatus").value =
        vendor.status;


    // Find currently assigned event
    const assignment =
        assignments.find(
            item =>
                Number(item.vendor_id) ===
                Number(id)
        );

    $("vendorEvent").value =
        assignment
            ? String(assignment.event_id)
            : "";
};


// ======================================================
// DELETE VENDOR
// ======================================================

window.deleteVendor = async id => {

    if (
        !confirm(
            "Are you sure you want to delete this vendor?"
        )
    ) {
        return;
    }

    try {

        // Remove vendor-event assignments first
        const vendorAssignments =
            assignments.filter(
                assignment =>
                    Number(assignment.vendor_id) ===
                    Number(id)
            );


        for (const assignment of vendorAssignments) {

            await Api.eventVendors.remove(
                assignment.id
            );
        }


        // Delete vendor
        await Api.vendors.remove(id);

        await refresh();

    } catch (error) {

        console.error(
            "Delete Vendor Error:",
            error
        );

        alert(error.message);
    }
};


// ======================================================
// SAVE / UPDATE VENDOR
// ======================================================

$("vendorForm")?.addEventListener(
    "submit",
    async event => {

        event.preventDefault();

        const selectedEventId =
            Number(
                $("vendorEvent").value
            );


        const data = {

            vendor_name:
                $("vendorName")
                    .value
                    .trim(),

            vendor_type:
                $("vendorCategory").value,

            contact_person:
                $("vendorContact")
                    .value
                    .trim() || null,

            email:
                $("vendorEmail")
                    .value
                    .trim() || null,

            phone:
                $("vendorPhone")
                    .value
                    .trim() || null,

            address: null,

            service_description: null,

            cost:
                Number(
                    $("vendorBudgetInput")
                        .value || 0
                ),

            status:
                $("vendorStatus").value
        };


        try {

            // =========================================
            // CREATE NEW VENDOR
            // =========================================

            if (!editing) {

                const createdVendor =
                    await Api.vendors.create(data);


                // Assign event after vendor created
                if (selectedEventId) {

                    await Api.eventVendors.create({

                        event_id:
                            selectedEventId,

                        vendor_id:
                            createdVendor.id
                    });
                }

            }

            // =========================================
            // UPDATE EXISTING VENDOR
            // =========================================

            else {

                await Api.vendors.update(
                    editing,
                    data
                );


                const oldAssignments =
                    assignments.filter(
                        assignment =>
                            Number(
                                assignment.vendor_id
                            ) ===
                            Number(editing)
                    );


                // -------------------------------------
                // Selected an event
                // -------------------------------------

                if (selectedEventId) {

                    const alreadyAssigned =
                        oldAssignments.find(
                            assignment =>
                                Number(
                                    assignment.event_id
                                ) ===
                                selectedEventId
                        );


                    // Remove previous assignments
                    for (
                        const assignment
                        of oldAssignments
                    ) {

                        if (
                            Number(
                                assignment.event_id
                            ) !==
                            selectedEventId
                        ) {

                            await Api.eventVendors.remove(
                                assignment.id
                            );
                        }
                    }


                    // Add new assignment
                    if (!alreadyAssigned) {

                        await Api.eventVendors.create({

                            event_id:
                                selectedEventId,

                            vendor_id:
                                Number(editing)
                        });
                    }

                }

                // -------------------------------------
                // No event selected
                // Remove assignments
                // -------------------------------------

                else {

                    for (
                        const assignment
                        of oldAssignments
                    ) {

                        await Api.eventVendors.remove(
                            assignment.id
                        );
                    }
                }
            }


            // =========================================
            // RESET
            // =========================================

            editing = null;

            event.target.reset();

            await refresh();

            alert(
                "Vendor saved successfully."
            );

        } catch (error) {

            console.error(
                "Vendor Save Error:",
                error
            );

            alert(error.message);
        }
    }
);


// ======================================================
// SEARCH
// ======================================================

$("searchVendor")?.addEventListener(
    "input",
    event => {

        applyFilters();
    }
);


// ======================================================
// CATEGORY FILTER
// ======================================================

$("filterCategory")?.addEventListener(
    "change",
    () => {

        applyFilters();
    }
);


// ======================================================
// APPLY SEARCH + CATEGORY FILTER
// ======================================================

function applyFilters() {

    const search =
        $("searchVendor")
            ?.value
            .trim()
            .toLowerCase() || "";

    const category =
        $("filterCategory")
            ?.value || "All";


    const filtered =
        vendors.filter(vendor => {

            const matchesSearch =
                vendor.vendor_name
                    .toLowerCase()
                    .includes(search);


            const matchesCategory =
                category === "All" ||
                vendor.vendor_type === category;


            return (
                matchesSearch &&
                matchesCategory
            );
        });


    render(filtered);
}


// ======================================================
// TOP VENDORS
// ======================================================

function renderTopVendors() {

    const container =
        $("topVendors");

    if (!container) return;


    const top =
        [...vendors]
            .sort(
                (a, b) =>
                    Number(b.cost || 0) -
                    Number(a.cost || 0)
            )
            .slice(0, 3);


    if (!top.length) {

        container.innerHTML =
            "<p>No vendors available.</p>";

        return;
    }


    container.innerHTML =
        top.map(vendor => `
            <div class="card">

                <i class="fa-solid fa-store"></i>

                <h3>
                    ${vendor.vendor_name}
                </h3>

                <p>
                    ${vendor.vendor_type}
                </p>

                <p>
                    ${getVendorEventNames(
                        vendor.id
                    )}
                </p>

            </div>
        `).join("");
}


// ======================================================
// INITIALIZE PAGE
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        if (!requireLogin()) {
            return;
        }


        const loggedUser =
            $("loggedUserName");

        if (loggedUser) {

            loggedUser.textContent =
                localStorage.getItem(
                    "userName"
                ) || "User";
        }


        try {

            // Load actual DB information
            await loadEvents();

            await loadAssignments();

            await refresh();

            renderTopVendors();

        } catch (error) {

            console.error(
                "Vendor Initialization Error:",
                error
            );

            alert(error.message);
        }
    }
);