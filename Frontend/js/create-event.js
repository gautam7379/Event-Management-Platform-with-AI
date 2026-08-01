/* =====================================================
                EVENTAI - CREATE EVENT
===================================================== */

const createForm = document.getElementById("createForm");
const toast = document.getElementById("toast");

/* =====================================================
                DEFAULT VALUES
===================================================== */

const FIELD_DEFAULTS = {
    category: "General",
    time: "10:00",
    price: 0,
    capacity: 100,
    description: "Details coming soon."
};

const REQUIRED_FIELDS = [
    "name",
    "date",
    "venue"
];

/* =====================================================
                PREVIEW ELEMENTS
===================================================== */

const preview = {
    name: document.getElementById("previewName"),
    date: document.getElementById("previewDate"),
    time: document.getElementById("previewTime"),
    venue: document.getElementById("previewVenue"),
    category: document.getElementById("previewCategory"),
    price: document.getElementById("previewPrice"),
    seats: document.getElementById("previewSeats"),
    id: document.getElementById("previewId"),
    stamp: document.getElementById("previewStamp"),
    thumb: document.getElementById("previewThumb")
};

/* =====================================================
                CATEGORY BANNERS
===================================================== */

const CATEGORY_BANNERS = {

    AI: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200",

    Technology: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200",

    Cloud: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200",

    Business: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200",

    Workshop: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200",

    Competition: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200",

    Music: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1200",

    Sports: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200",

    Education: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200",

    Health: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200",

    Environment: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=1200",

    General: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200"
};

function getCategoryBanner(category) {
    return CATEGORY_BANNERS[category] || CATEGORY_BANNERS.General;
}

/* =====================================================
                DEMO EVENTS
===================================================== */

function initializeDemoEvents() {

    let events = JSON.parse(localStorage.getItem("events"));

    if (events && events.length > 0) return;

    events = [

        {
            id: 1,
            eventCode: "EVT-0001",
            name: "AI Summit 2026",
            category: "AI",
            date: "2026-08-15",
            time: "10:00",
            venue: "Kolkata",
            price: 1200,
            capacity: 500,
            registered: 352,
            description: "India's biggest AI conference.",
            banner: getCategoryBanner("AI"),
            status: "Upcoming"
        },

        {
            id: 2,
            eventCode: "EVT-0002",
            name: "Cloud Expo 2026",
            category: "Cloud",
            date: "2026-08-28",
            time: "11:00",
            venue: "Hyderabad",
            price: 1000,
            capacity: 400,
            registered: 247,
            description: "Cloud & DevOps conference.",
            banner: getCategoryBanner("Cloud"),
            status: "Upcoming"
        },

        {
            id: 3,
            eventCode: "EVT-0003",
            name: "Startup Connect",
            category: "Business",
            date: "2026-09-10",
            time: "09:30",
            venue: "Delhi",
            price: 700,
            capacity: 300,
            registered: 176,
            description: "Meet founders and investors.",
            banner: getCategoryBanner("Business"),
            status: "Upcoming"
        },

        {
            id: 4,
            eventCode: "EVT-0004",
            name: "Hackathon 2026",
            category: "Competition",
            date: "2026-10-10",
            time: "08:00",
            venue: "Bangalore",
            price: 500,
            capacity: 250,
            registered: 150,
            description: "24-hour coding marathon.",
            banner: getCategoryBanner("Competition"),
            status: "Upcoming"
        }

    ];

    localStorage.setItem("events", JSON.stringify(events));
}

/* =====================================================
                STORAGE HELPERS
===================================================== */

function getEvents() {
    initializeDemoEvents();
    return JSON.parse(localStorage.getItem("events")) || [];
}

function saveEvent(event) {

    const events = getEvents();

    events.push(event);

    localStorage.setItem(
        "events",
        JSON.stringify(events)
    );
}

function getNextId() {

    const events = getEvents();

    return events.length
        ? Math.max(...events.map(e => e.id)) + 1
        : 1;
}

/* =====================================================
                DATE HELPERS
===================================================== */

function formatDate(date) {

    if (!date) return "—";

    return new Date(date).toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}

function computeStatus(date) {

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const eventDate = new Date(date);

    return eventDate < today
        ? "Completed"
        : "Upcoming";
}

/* =====================================================
                VALIDATION HELPERS
===================================================== */

function clearErrors() {

    document.querySelectorAll(".error").forEach(error => {
        error.textContent = "";
    });

    document.querySelectorAll(".invalid").forEach(input => {
        input.classList.remove("invalid");
    });

}

function showError(field) {

    const input = document.getElementById(field);

    if (!input) return;

    input.classList.add("invalid");

}

function showToast(message, error = false) {

    toast.textContent = message;

    toast.className = error
        ? "toast error show"
        : "toast show";

    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}
/* =====================================================
                LIVE PREVIEW
===================================================== */

const previewFields = [
    "name",
    "date",
    "time",
    "venue",
    "category",
    "price",
    "capacity",
    "banner"
];

previewFields.forEach(id => {

    const input = document.getElementById(id);

    if (!input) return;

    input.addEventListener("input", updatePreview);

    input.addEventListener("change", updatePreview);

});

/* =====================================================
                UPDATE PREVIEW
===================================================== */

function updatePreview() {

    const name =
        document.getElementById("name").value.trim();

    const date =
        document.getElementById("date").value;

    const time =
        document.getElementById("time").value.trim();

    const venue =
        document.getElementById("venue").value.trim();

    const category =
        document.getElementById("category").value.trim() ||
        FIELD_DEFAULTS.category;

    const price =
        document.getElementById("price").value;

    const capacity =
        document.getElementById("capacity").value;

    const bannerInput =
        document.getElementById("banner").value.trim();

    /* -------------------------------
            TEXT PREVIEW
    -------------------------------- */

    preview.name.textContent =
        name || "Your Event Name";

    preview.date.textContent =
        formatDate(date);

    preview.time.textContent =
        time || FIELD_DEFAULTS.time;

    preview.venue.textContent =
        venue || "Venue";

    preview.category.textContent =
        category;

    preview.price.textContent =
        price && Number(price) > 0
            ? `₹${Number(price).toLocaleString()}`
            : "Free";

    preview.seats.textContent =
        capacity || FIELD_DEFAULTS.capacity;

    preview.id.textContent =
        `EVT-${String(getNextId()).padStart(4, "0")}`;

    /* -------------------------------
            STATUS BADGE
    -------------------------------- */

    const status = computeStatus(date);

    preview.stamp.textContent = status;

    preview.stamp.className =
        status === "Completed"
            ? "badge completed"
            : "badge upcoming";

    /* -------------------------------
            IMAGE PREVIEW
    -------------------------------- */

    const banner =
        bannerInput ||
        getCategoryBanner(category);

    preview.thumb.innerHTML = `
        <img
            src="${banner}"
            alt="Banner"
            onerror="this.src='${getCategoryBanner("General")}'"
        >
    `;

}

/* =====================================================
                INITIAL PREVIEW
===================================================== */

updatePreview();

/* =====================================================
                DATE RESTRICTION
===================================================== */

const dateInput = document.getElementById("date");

if (dateInput) {

    const today = new Date();

    today.setHours(0,0,0,0);

    dateInput.min = today.toISOString().split("T")[0];

}

/* =====================================================
                NUMBER INPUT FIXES
===================================================== */

const priceInput = document.getElementById("price");

if (priceInput) {

    priceInput.addEventListener("input", () => {

        if (priceInput.value < 0)
            priceInput.value = 0;

        updatePreview();

    });

}

const capacityInput = document.getElementById("capacity");

if (capacityInput) {

    capacityInput.addEventListener("input", () => {

        if (capacityInput.value < 1)
            capacityInput.value = 1;

        updatePreview();

    });

}

/* =====================================================
                AUTO CATEGORY BANNER
===================================================== */

const categoryInput =
    document.getElementById("category");

const bannerInput =
    document.getElementById("banner");

if (categoryInput && bannerInput) {

    categoryInput.addEventListener("change", () => {

        if (bannerInput.value.trim() === "") {

            updatePreview();

        }

    });

}
/* =====================================================
                FORM SUBMISSION
===================================================== */

createForm.addEventListener("submit", function (e) {

    e.preventDefault();

    clearErrors();

    const formData = new FormData(createForm);

    const values = Object.fromEntries(formData.entries());

    /* ==========================================
                REQUIRED FIELD CHECK
    ========================================== */

    let valid = true;

    REQUIRED_FIELDS.forEach(field => {

        if (!values[field] || values[field].trim() === "") {

            showError(field);

            valid = false;

        }

    });

    if (!valid) {

        showToast(
            "Please fill all required fields.",
            true
        );

        return;
    }

    /* ==========================================
                DATE VALIDATION
    ========================================== */

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(values.date);

    if (selectedDate < today) {

        showToast(
            "Event date cannot be in the past.",
            true
        );

        return;
    }

    /* ==========================================
                DUPLICATE CHECK
    ========================================== */

    const events = getEvents();

    const duplicate = events.find(event =>

        event.name.trim().toLowerCase() ===
        values.name.trim().toLowerCase()

    );

    if (duplicate) {

        showToast(
            "An event with this name already exists.",
            true
        );

        return;
    }

    /* ==========================================
                CREATE EVENT
    ========================================== */

    const nextId = getNextId();

    const event = {

        id: nextId,

        eventCode: `EVT-${String(nextId).padStart(4, "0")}`,

        name: values.name.trim(),

        category:
            values.category.trim() ||
            FIELD_DEFAULTS.category,

        date: values.date,

        time:
            values.time.trim() ||
            FIELD_DEFAULTS.time,

        venue: values.venue.trim(),

        price:
            values.price !== ""
                ? Number(values.price)
                : FIELD_DEFAULTS.price,

        capacity:
            values.capacity !== ""
                ? Number(values.capacity)
                : FIELD_DEFAULTS.capacity,

        registered: 0,

        description:
            values.description.trim() ||
            FIELD_DEFAULTS.description,

        banner:
            values.banner.trim() ||
            getCategoryBanner(
                values.category.trim() ||
                FIELD_DEFAULTS.category
            ),

        status:
            computeStatus(values.date),

        createdAt:
            new Date().toISOString()

    };

    /* ==========================================
                SAVE
    ========================================== */

    saveEvent(event);

    updatePreview();

    showToast(
        `"${event.name}" created successfully!`
    );

    /* ==========================================
                RESET
    ========================================== */

    createForm.reset();

    updatePreview();

    setTimeout(() => {

        window.location.href = "events.html";

    }, 1200);

});

/* =====================================================
                INITIALIZE
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    initializeDemoEvents();

    updatePreview();

    const dateInput = document.getElementById("date");

    if (dateInput) {

        const today = new Date();

        today.setHours(0,0,0,0);

        dateInput.min =
            today.toISOString().split("T")[0];

    }

});