/* ==========================================
            EVENTAI VENDORS
========================================== */

/* ==========================================
            LOCAL STORAGE
========================================== */

function getVendors() {

    return JSON.parse(

        localStorage.getItem("vendors")

    ) || [];

}

function saveVendors(vendors) {

    localStorage.setItem(

        "vendors",

        JSON.stringify(vendors)

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
            EDIT MODE
========================================== */

let editingVendorIndex = -1;

/* ==========================================
            LOAD EVENTS
========================================== */

function loadEvents() {

    const select = document.getElementById("vendorEvent");

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
            SECURITY
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    if (currentUser.role !== "admin") {

        window.location.href = "user-dashboard.html";

        return;

    }

    document.getElementById("loggedUserName").textContent =

        currentUser.name;

    loadEvents();

    refreshPage();

});

/* ==========================================
            LOAD STATISTICS
========================================== */

function loadStatistics() {

    const vendors = getVendors();

    document.getElementById("totalVendors").textContent =

        vendors.length;

    document.getElementById("activeVendors").textContent =

        vendors.filter(

            vendor => vendor.status === "Active"

        ).length;

    const categories = [

        ...new Set(

            vendors.map(

                vendor => vendor.category

            )

        )

    ];

    document.getElementById("serviceCategories").textContent =

        categories.length;

    let totalBudget = 0;

    vendors.forEach(vendor => {

        totalBudget += Number(vendor.budget || 0);

    });

    document.getElementById("vendorBudget").textContent =

        "₹" +

        totalBudget.toLocaleString("en-IN");

}
/* ==========================================
            LOAD VENDORS
========================================== */

function loadVendors(filteredVendors = null) {

    const table = document.getElementById("vendorTable");

    if (!table) return;

    const vendors = filteredVendors || getVendors();

    table.innerHTML = "";

    if (vendors.length === 0) {

        table.innerHTML = `

        <tr>

            <td colspan="9" style="text-align:center;padding:20px;">

                No vendors available.

            </td>

        </tr>

        `;

        loadTopVendors([]);

        return;

    }

    let html = "";

    vendors.forEach((vendor, index) => {

        html += `

        <tr>

            <td>${vendor.id}</td>

            <td>${vendor.name}</td>

            <td>${vendor.category}</td>

            <td>${vendor.event || "-"}</td>

            <td>${vendor.contact}</td>

            <td>${vendor.phone}</td>

            <td>₹${Number(vendor.budget).toLocaleString("en-IN")}</td>

            <td>

                <span class="badge ${vendor.status === "Active" ? "active" : "inactive"}">

                    ${vendor.status}

                </span>

            </td>

            <td>

                <div class="action-buttons">

                    <button

                        class="edit-btn"

                        onclick="editVendor('${vendor.id}')">

                        <i class="fa-solid fa-pen"></i>

                    </button>

                    <button

                        class="delete-btn"

                        onclick="deleteVendor('${vendor.id}')">

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </div>

            </td>

        </tr>

        `;

    });

    table.innerHTML = html;

    loadTopVendors(vendors);

}

/* ==========================================
            ADD / UPDATE VENDOR
========================================== */

const vendorForm = document.getElementById("vendorForm");

if (vendorForm) {

    vendorForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const vendors = getVendors();

        const vendor = {

            id: editingVendorIndex === -1
                ? "VEN" + Date.now()
                : vendors[editingVendorIndex].id,

            name: document.getElementById("vendorName").value.trim(),

            category: document.getElementById("vendorCategory").value,

            event: document.getElementById("vendorEvent").value,

            contact: document.getElementById("vendorContact").value.trim(),

            phone: document.getElementById("vendorPhone").value.trim(),

            email: document.getElementById("vendorEmail").value.trim(),

            budget: Number(document.getElementById("vendorBudgetInput").value),

            status: document.getElementById("vendorStatus").value

        };

        if (editingVendorIndex === -1) {

            vendors.push(vendor);

            alert("✅ Vendor added successfully.");

        } else {

            vendors[editingVendorIndex] = vendor;

            editingVendorIndex = -1;

            alert("✅ Vendor updated successfully.");

        }

        saveVendors(vendors);

        vendorForm.reset();

        loadStatistics();

        loadVendors();

    });

}

/* ==========================================
            EDIT VENDOR
========================================== */

function editVendor(vendorId) {

    const vendors = getVendors();

    const index = vendors.findIndex(

        vendor => vendor.id === vendorId

    );

    if (index === -1) return;

    const vendor = vendors[index];

    document.getElementById("vendorName").value = vendor.name;

    document.getElementById("vendorCategory").value = vendor.category;

    document.getElementById("vendorEvent").value = vendor.event || "";

    document.getElementById("vendorContact").value = vendor.contact;

    document.getElementById("vendorPhone").value = vendor.phone;

    document.getElementById("vendorEmail").value = vendor.email;

    document.getElementById("vendorBudgetInput").value = vendor.budget;

    editingVendorIndex = index;

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}
/* ==========================================
            DELETE VENDOR
========================================== */

function deleteVendor(vendorId){

    if(!confirm("Delete this vendor?")){

        return;

    }

    let vendors = getVendors();

    vendors = vendors.filter(

        vendor => vendor.id !== vendorId

    );

    saveVendors(vendors);

    loadStatistics();

    loadVendors();

}

/* ==========================================
            SEARCH
========================================== */

const searchVendor =

document.getElementById("searchVendor");

if(searchVendor){

    searchVendor.addEventListener(

        "keyup",

        filterVendors

    );

}

/* ==========================================
            FILTER CATEGORY
========================================== */

const filterCategory =

document.getElementById("filterCategory");

if(filterCategory){

    filterCategory.addEventListener(

        "change",

        filterVendors

    );

}

/* ==========================================
            FILTER FUNCTION
========================================== */

function filterVendors(){

    const search =

        document.getElementById(

            "searchVendor"

        ).value.toLowerCase();

    const category =

        document.getElementById(

            "filterCategory"

        ).value;

    let vendors = getVendors();

    vendors = vendors.filter(vendor=>{

        const matchSearch =

            vendor.name.toLowerCase().includes(search)

            ||

            vendor.contact.toLowerCase().includes(search)

            ||

            vendor.category.toLowerCase().includes(search)

            ||

            (vendor.event || "").toLowerCase().includes(search);

        const matchCategory =

            category === "All"

            ||

            vendor.category === category;

        return matchSearch && matchCategory;

    });

    loadVendors(vendors);

}
/* ==========================================
            TOP VENDORS
========================================== */

function loadTopVendors(vendors = getVendors()) {

    const container = document.getElementById("topVendors");

    if (!container) return;

    container.innerHTML = "";

    if (vendors.length === 0) {

        container.innerHTML = `

            <div class="no-data">

                No vendors available.

            </div>

        `;

        return;

    }

    const topVendors = [...vendors]

        .sort((a, b) => Number(b.budget || 0) - Number(a.budget || 0))

        .slice(0, 4);

    topVendors.forEach(vendor => {

        container.innerHTML += `

            <div class="vendor-card">

                <h3>

                    <i class="fa-solid fa-store"></i>

                    ${vendor.name}

                </h3>

                <p>

                    <strong>Category:</strong>

                    ${vendor.category}

                </p>

                <p>

                    <strong>Event:</strong>

                    ${vendor.event || "Not Assigned"}

                </p>

                <p>

                    <strong>Contact:</strong>

                    ${vendor.contact}

                </p>

                <p>

                    <strong>Phone:</strong>

                    ${vendor.phone}

                </p>

                <p>

                    <strong>Budget:</strong>

                    ₹${Number(vendor.budget).toLocaleString("en-IN")}

                </p>

                <span class="badge ${vendor.status === "Active" ? "active" : "inactive"}">

                    ${vendor.status}

                </span>

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

    loadVendors();

    loadTopVendors();

}

/* ==========================================
            AUTO REFRESH
========================================== */

window.addEventListener("storage",()=>{

    refreshPage();

});

/* ==========================================
            INITIALIZE
========================================== */

document.addEventListener("DOMContentLoaded",()=>{

    if(currentUser.role!=="admin"){

        window.location.href="user-dashboard.html";

        return;

    }

    document.getElementById("loggedUserName").textContent=

        currentUser.name;

    refreshPage();

});

/* ==========================================
            DEBUG
========================================== */

console.log("================================");

console.log("EventAI Vendors Loaded");

console.log("Admin :",currentUser.name);

console.log("Total Vendors :",getVendors().length);

console.log("================================");