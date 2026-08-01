/* ==========================================
   EVENTAI REGISTER
========================================== */

/* ==========================================
   PASSWORD TOGGLE
========================================== */

const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

const togglePassword = document.getElementById("togglePassword");
const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");

if (togglePassword) {

    togglePassword.addEventListener("click", () => {

        if (password.type === "password") {

            password.type = "text";

            togglePassword.classList.remove("fa-eye");
            togglePassword.classList.add("fa-eye-slash");

        } else {

            password.type = "password";

            togglePassword.classList.remove("fa-eye-slash");
            togglePassword.classList.add("fa-eye");

        }

    });

}

if (toggleConfirmPassword) {

    toggleConfirmPassword.addEventListener("click", () => {

        if (confirmPassword.type === "password") {

            confirmPassword.type = "text";

            toggleConfirmPassword.classList.remove("fa-eye");
            toggleConfirmPassword.classList.add("fa-eye-slash");

        } else {

            confirmPassword.type = "password";

            toggleConfirmPassword.classList.remove("fa-eye-slash");
            toggleConfirmPassword.classList.add("fa-eye");

        }

    });

}

/* ==========================================
   REGISTER
========================================== */

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const name =
            document.getElementById("name").value.trim();

        const email =
            document.getElementById("email").value.trim().toLowerCase();

        const pass =
            password.value.trim();

        const confirmPass =
            confirmPassword.value.trim();

        /* ===============================
            VALIDATION
        =============================== */

        if (!name || !email || !pass || !confirmPass) {

            alert("Please fill in all fields.");

            return;

        }

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {

            alert("Please enter a valid email address.");

            return;

        }

        if (pass.length < 6) {

            alert("Password must be at least 6 characters.");

            return;

        }

        if (pass !== confirmPass) {

            alert("Passwords do not match.");

            return;

        }

        /* ===============================
            GET USERS
        =============================== */

        let users =
            JSON.parse(localStorage.getItem("users")) || [];

        /* ===============================
            DUPLICATE EMAIL
        =============================== */

        const exists =
            users.some(user => user.email === email);

        if (exists) {

            alert("An account with this email already exists.");

            return;

        }

        /* ===============================
            CREATE USER
        =============================== */

        const newUser = {

            id:
                users.length > 0
                    ? Math.max(...users.map(user => user.id)) + 1
                    : 1,

            name: name,

            email: email,

            password: pass,

            role: "user",

            joined: new Date().toLocaleDateString("en-IN")

        };

        /* ===============================
            SAVE USER
        =============================== */

        users.push(newUser);

        localStorage.setItem(

            "users",

            JSON.stringify(users)

        );

        alert("Registration Successful!");

        registerForm.reset();

        setTimeout(() => {

            window.location.href = "login.html";

        }, 500);

    });

}

/* ==========================================
   END
========================================== */

console.log("EventAI Register Loaded");