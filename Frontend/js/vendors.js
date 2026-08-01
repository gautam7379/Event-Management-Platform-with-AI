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

        window.location.href = "user-dashboard.html";

        return;

    }

    document.getElementById("loggedUserName").textContent =

        currentUser.name;

    loadStatistics();

    loadVendors();

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

        totalBudget += Number(

            vendor.budget || 0

        );

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

    table.innerHTML = "";

    const vendors = filteredVendors || getVendors();

    if (vendors.length === 0) {

        table.innerHTML = `

        <tr>

            <td colspan="8" style="text-align:center;padding:20px;">

                No vendors available.

            </td>

        </tr>

        `;

        loadTopVendors([]);

        return;

    }

    vendors.forEach((vendor, index) => {

        table.innerHTML += `

        <tr>

            <td>${vendor.id}</td>

            <td>${vendor.name}</td>

            <td>${vendor.category}</td>

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

                        onclick="editVendor(${index})">

                        <i class="fa-solid fa-pen"></i>

                    </button>

                    <button

                        class="delete-btn"

                        onclick="deleteVendor(${index})">

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </div>

            </td>

        </tr>

        `;

    });

    loadTopVendors(vendors);

}

/* ==========================================
            ADD VENDOR
========================================== */

const vendorForm = document.getElementById("vendorForm");

if (vendorForm) {

    vendorForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const vendors = getVendors();

        const vendor = {

            id: "VEN" + Date.now(),

            name: document.getElementById("vendorName").value.trim(),

            category: document.getElementById("vendorCategory").value,

            contact: document.getElementById("vendorContact").value.trim(),

            phone: document.getElementById("vendorPhone").value.trim(),

            email: document.getElementById("vendorEmail").value.trim(),

            budget: Number(document.getElementById("vendorBudgetInput").value),

            status: "Active"

        };

        vendors.push(vendor);

        saveVendors(vendors);

        vendorForm.reset();

        loadStatistics();

        loadVendors();

        alert("✅ Vendor added successfully.");

    });

}
/* ==========================================
            EDIT VENDOR
========================================== */

function editVendor(index){

    const vendors = getVendors();

    const vendor = vendors[index];

    if(!vendor) return;

    document.getElementById("vendorName").value = vendor.name;

    document.getElementById("vendorCategory").value = vendor.category;

    document.getElementById("vendorContact").value = vendor.contact;

    document.getElementById("vendorPhone").value = vendor.phone;

    document.getElementById("vendorEmail").value = vendor.email;

    document.getElementById("vendorBudgetInput").value = vendor.budget;

    vendors.splice(index,1);

    saveVendors(vendors);

    loadStatistics();

    loadVendors();

}

/* ==========================================
            DELETE VENDOR
========================================== */

function deleteVendor(index){

    if(!confirm("Delete this vendor?")){

        return;

    }

    const vendors = getVendors();

    vendors.splice(index,1);

    saveVendors(vendors);

    loadStatistics();

    loadVendors();

}

/* ==========================================
            SEARCH VENDOR
========================================== */

const searchVendor =

document.getElementById("searchVendor");

if(searchVendor){

    searchVendor.addEventListener("keyup",filterVendors);

}

/* ==========================================
            FILTER CATEGORY
========================================== */

const filterCategory =

document.getElementById("filterCategory");

if(filterCategory){

    filterCategory.addEventListener("change",filterVendors);

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

            vendor.category.toLowerCase().includes(search);

        const matchCategory =

            category==="All"

            ||

            vendor.category===category;

        return matchSearch && matchCategory;

    });

    loadVendors(vendors);

}
/* ==========================================
            TOP VENDORS
========================================== */

function loadTopVendors(vendors = getVendors()) {

    const container =

        document.getElementById("topVendors");

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

        .sort((a, b) =>

            Number(b.budget || 0) -

            Number(a.budget || 0)

        )

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

                    <strong>Contact:</strong>

                    ${vendor.contact}

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

    loadStatistics();

    loadVendors();

    loadTopVendors();

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

console.log("EventAI Vendors Loaded");

console.log("Admin :", currentUser.name);

console.log("================================");