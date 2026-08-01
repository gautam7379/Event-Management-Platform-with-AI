/* ==========================================
            EVENTAI AUTH
========================================== */

/* ==========================================
            PASSWORD TOGGLE
========================================== */

const password =
    document.getElementById("password");

const togglePassword =
    document.getElementById("togglePassword");

if (togglePassword) {

    togglePassword.addEventListener("click", () => {

        if (password.type === "password") {

            password.type = "text";

            togglePassword.classList.remove("fa-eye");

            togglePassword.classList.add("fa-eye-slash");

        }

        else {

            password.type = "password";

            togglePassword.classList.remove("fa-eye-slash");

            togglePassword.classList.add("fa-eye");

        }

    });

}

/* ==========================================
            LOGIN FORM
========================================== */

const loginForm =
    document.getElementById("loginForm");
/* ==========================================
            LOGIN
========================================== */

if (loginForm) {

    loginForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const email =
            document.getElementById("email")
            .value
            .trim()
            .toLowerCase();

        const passwordValue =
            document.getElementById("password")
            .value
            .trim();

        if (!email || !passwordValue) {

            alert("Please fill in all fields.");

            return;

        }

        /* ===================================
                ADMIN LOGIN
        =================================== */

        if (

            email === "admin@eventai.com"

            &&

            passwordValue === "admin123"

        ) {

            localStorage.setItem(
                "isLoggedIn",
                "true"
            );

            localStorage.setItem(
                "userRole",
                "admin"
            );

            localStorage.setItem(
                "userName",
                "Administrator"
            );

            localStorage.setItem(
                "userEmail",
                email
            );

            alert("Welcome Admin!");

            window.location.href =
                "dashboard.html";

            return;

        }

        /* ===================================
                USER LOGIN
        =================================== */

        const users =

            JSON.parse(

                localStorage.getItem("users")

            ) || [];

        const user = users.find(

            u =>

                u.email.toLowerCase() === email

                &&

                u.password === passwordValue

        );

        if (user) {

            localStorage.setItem(
                "isLoggedIn",
                "true"
            );

            localStorage.setItem(
                "userRole",
                "user"
            );

            localStorage.setItem(
                "userName",
                user.name
            );

            localStorage.setItem(
                "userEmail",
                user.email
            );

            alert("Welcome " + user.name + "!");

            /* USER GOES HERE */

            window.location.href =
                "user-dashboard.html";

            return;

        }

        alert("Invalid Email or Password.");

    });

}
/* ==========================================
            LOGOUT
========================================== */

function logout() {

    localStorage.removeItem("isLoggedIn");

    localStorage.removeItem("userRole");

    localStorage.removeItem("userName");

    localStorage.removeItem("userEmail");

    window.location.href = "login.html";

}

/* ==========================================
        LOGOUT BUTTON
========================================== */

const logoutBtn =
    document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", function (e) {

        e.preventDefault();

        logout();

    });

}

/* ==========================================
        SESSION CHECK
========================================== */

function checkLogin() {

    const loggedIn =
        localStorage.getItem("isLoggedIn");

    if (

        !loggedIn

        &&

        !window.location.pathname.includes("login.html")

        &&

        !window.location.pathname.includes("register.html")

    ) {

        window.location.href = "login.html";

        return;

    }

}

/* ==========================================
        ROLE PROTECTION
========================================== */

function checkRole() {

    const role = localStorage.getItem("userRole");

    const page = window.location.pathname.split("/").pop();

    // Admin dashboard
    if (page === "dashboard.html" && role !== "admin") {
        window.location.href = "user-dashboard.html";
        return;
    }

    // User dashboard
    if (page === "user-dashboard.html" && role !== "user") {
        window.location.href = "dashboard.html";
        return;
    }
}

/* ==========================================
        AUTO RUN
========================================== */

checkLogin();

checkRole();

/* ==========================================
        DEBUG
========================================== */

console.log(

    "Logged In :",

    localStorage.getItem("isLoggedIn")

);

console.log(

    "Role :",

    localStorage.getItem("userRole")

);

console.log(

    "User :",

    localStorage.getItem("userName")

);

console.log("EventAI Authentication Loaded");
