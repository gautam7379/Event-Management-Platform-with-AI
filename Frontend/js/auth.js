const password = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");


// ================================
// SHOW / HIDE PASSWORD
// ================================

if (togglePassword && password) {

    togglePassword.onclick = () => {

        password.type =
            password.type === "password"
                ? "text"
                : "password";
    };
}


// ================================
// LOGIN
// ================================

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",

        async (e) => {

            e.preventDefault();

            const btn =
                loginForm.querySelector(
                    "button[type=submit]"
                );

            try {

                btn.disabled = true;


                // -----------------------------
                // 1. LOGIN
                // -----------------------------

                const email =
                    document
                        .getElementById("email")
                        .value
                        .trim();

                const passwordValue =
                    password.value;


                const token =
                    await Api.login(
                        email,
                        passwordValue
                    );


                // -----------------------------
                // 2. SAVE JWT
                // -----------------------------

                localStorage.setItem(
                    "accessToken",
                    token.access_token
                );

                localStorage.setItem(
                    "isLoggedIn",
                    "true"
                );


                // -----------------------------
                // 3. GET USER FROM BACKEND
                // -----------------------------

                const me =
                    await Api.me();


                console.log(
                    "Logged in user:",
                    me
                );


                // -----------------------------
                // 4. SAVE SESSION INFORMATION
                // -----------------------------

                localStorage.setItem(
                    "userId",
                    String(me.id)
                );

                localStorage.setItem(
                    "roleId",
                    String(me.role_id)
                );

                localStorage.setItem(
                    "userName",
                    `${me.first_name} ${me.last_name}`.trim()
                );

                localStorage.setItem(
                    "userEmail",
                    me.email
                );


                // -----------------------------
                // 5. DETERMINE ROLE
                // -----------------------------

                let role = "user";


                if (Number(me.role_id) === 1) {

                    role = "admin";

                } else if (
                    Number(me.role_id) === 2
                ) {

                    role = "organizer";
                }


                localStorage.setItem(
                    "userRole",
                    role
                );


                console.log(
                    "Role:",
                    role
                );


                // -----------------------------
                // 6. REDIRECT
                // -----------------------------

                if (role === "user") {

                    location.href =
                        "user-dashboard.html";

                } else {

                    location.href =
                        "dashboard.html";
                }


            } catch (err) {

                console.error(
                    "Login failed:",
                    err
                );

                alert(
                    err.message ||
                    "Login failed"
                );

            } finally {

                if (btn) {
                    btn.disabled = false;
                }
            }
        }
    );
}


// ================================
// LOGOUT
// ================================

document.addEventListener(
    "click",

    (e) => {

        if (
            e.target.closest("#logoutBtn")
        ) {

            e.preventDefault();

            logout();
        }
    }
);