// ============================================================
// DEMENCURE - FIREBASE APP
// ============================================================

console.log("DemenCure app.js loaded");

// ============================================================
// FIREBASE IMPORTS
// ============================================================

import { initializeApp } from
    "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendEmailVerification,
    sendPasswordResetEmail,
    signOut,
    onAuthStateChanged
} from
    "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    serverTimestamp
} from
    "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


// ============================================================
// FIREBASE CONFIGURATION
// ============================================================

const firebaseConfig = {

    apiKey:
        import.meta.env.VITE_FIREBASE_API_KEY,

    authDomain:
        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,

    projectId:
        import.meta.env.VITE_FIREBASE_PROJECT_ID,

    storageBucket:
        import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,

    messagingSenderId:
        import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,

    appId:
        import.meta.env.VITE_FIREBASE_APP_ID
};


// ============================================================
// CHECK ENVIRONMENT VARIABLES
// ============================================================

console.log("Firebase environment:", {
    apiKey: !!firebaseConfig.apiKey,
    authDomain: !!firebaseConfig.authDomain,
    projectId: !!firebaseConfig.projectId,
    storageBucket: !!firebaseConfig.storageBucket,
    messagingSenderId: !!firebaseConfig.messagingSenderId,
    appId: !!firebaseConfig.appId
});


// ============================================================
// INITIALIZE FIREBASE
// ============================================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

console.log("Firebase initialized successfully");


// ============================================================
// REGISTRATION
// ============================================================

const registerForm =
    document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            const nameInput =
                document.getElementById("name");

            const ageInput =
                document.getElementById("age");

            const emailInput =
                document.getElementById("email");

            const passwordInput =
                document.getElementById("password");

            const message =
                document.getElementById("message");


            const name =
                nameInput
                    ? nameInput.value.trim()
                    : "";

            const age =
                ageInput
                    ? ageInput.value
                    : "";

            const email =
                emailInput
                    ? emailInput.value.trim()
                    : "";

            const password =
                passwordInput
                    ? passwordInput.value
                    : "";


            if (!name || !email || !password) {

                if (message) {
                    message.style.color = "#dc2626";
                    message.textContent =
                        "Please fill in all required fields.";
                }

                return;
            }


            if (message) {

                message.style.color = "#6366f1";

                message.textContent =
                    "Creating your account...";
            }


            try {

                // ------------------------------------------------
                // CREATE AUTH ACCOUNT
                // ------------------------------------------------

                const userCredential =
                    await createUserWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );


                const user =
                    userCredential.user;


                console.log(
                    "Account created:",
                    user.uid
                );


                // ------------------------------------------------
                // SEND EMAIL VERIFICATION
                // ------------------------------------------------

                await sendEmailVerification(user);


                console.log(
                    "Verification email sent"
                );


                // ------------------------------------------------
                // CREATE FIRESTORE USER DOCUMENT
                // ------------------------------------------------

                await setDoc(
                    doc(
                        db,
                        "users",
                        user.uid
                    ),
                    {
                        name: name,
                        age: age
                            ? Number(age)
                            : null,

                        email: email,

                        createdAt:
                            serverTimestamp()
                    }
                );


                console.log(
                    "User document created"
                );


                // ------------------------------------------------
                // LOG OUT AFTER REGISTRATION
                // ------------------------------------------------

                await signOut(auth);


                if (message) {

                    message.style.color =
                        "#16a34a";

                    message.textContent =
                        "Account created! Please verify your email.";
                }


                alert(
                    "Account created successfully.\n\n" +
                    "A verification link has been sent to your email.\n\n" +
                    "Please verify your email before logging in."
                );


                registerForm.reset();


                setTimeout(
                    () => {

                        window.location.href =
                            "index.html";

                    },
                    500
                );

            }

            catch (error) {

                console.error(
                    "Registration error:",
                    error
                );


                if (message) {

                    message.style.color =
                        "#dc2626";


                    switch (error.code) {

                        case "auth/email-already-in-use":

                            message.textContent =
                                "This email is already registered.";

                            break;


                        case "auth/weak-password":

                            message.textContent =
                                "Password must be at least 6 characters.";

                            break;


                        case "auth/invalid-email":

                            message.textContent =
                                "Please enter a valid email address.";

                            break;


                        case "permission-denied":

                            message.textContent =
                                "Firestore permission denied. Check Firebase Security Rules.";

                            break;


                        default:

                            message.textContent =
                                error.message ||
                                "Registration failed. Please try again.";
                    }
                }
            }
        }
    );
}


// ============================================================
// LOGIN
// ============================================================

const loginForm =
    document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const emailInput =
                document.getElementById("email");

            const passwordInput =
                document.getElementById("password");

            const message =
                document.getElementById("message");


            const email =
                emailInput
                    ? emailInput.value.trim()
                    : "";

            const password =
                passwordInput
                    ? passwordInput.value
                    : "";


            if (!email || !password) {

                if (message) {

                    message.style.color =
                        "#dc2626";

                    message.textContent =
                        "Please enter your email and password.";
                }

                return;
            }


            if (message) {

                message.style.color =
                    "#6366f1";

                message.textContent =
                    "Signing in...";
            }


            try {

                // ------------------------------------------------
                // SIGN IN
                // ------------------------------------------------

                const userCredential =
                    await signInWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );


                const user =
                    userCredential.user;


                console.log(
                    "Login successful:",
                    user.uid
                );


                // ------------------------------------------------
                // REFRESH USER
                // ------------------------------------------------

                await user.reload();


                // ------------------------------------------------
                // EMAIL VERIFICATION CHECK
                // ------------------------------------------------

                if (!user.emailVerified) {

                    await signOut(auth);


                    if (message) {

                        message.style.color =
                            "#dc2626";

                        message.textContent =
                            "Please verify your email before logging in.";
                    }


                    alert(
                        "Your email address has not been verified.\n\n" +
                        "Please check your inbox and click the verification link."
                    );


                    return;
                }


                // ------------------------------------------------
                // SUCCESS
                // ------------------------------------------------

                if (message) {

                    message.style.color =
                        "#16a34a";

                    message.textContent =
                        "Login successful!";
                }


                setTimeout(
                    () => {

                        window.location.href =
                            "dashboard.html";

                    },
                    500
                );

            }

            catch (error) {

                console.error(
                    "Login error:",
                    error
                );


                if (message) {

                    message.style.color =
                        "#dc2626";


                    switch (error.code) {

                        case "auth/invalid-credential":

                        case "auth/wrong-password":

                        case "auth/user-not-found":

                            message.textContent =
                                "Incorrect email or password.";

                            break;


                        case "auth/invalid-email":

                            message.textContent =
                                "Please enter a valid email address.";

                            break;


                        case "auth/too-many-requests":

                            message.textContent =
                                "Too many attempts. Please try again later.";

                            break;


                        default:

                            message.textContent =
                                error.message ||
                                "Login failed. Please try again.";
                    }
                }
            }
        }
    );
}


// ============================================================
// FORGOT PASSWORD
// ============================================================

const forgotPassword =
    document.getElementById("forgotPassword");

if (forgotPassword) {

    forgotPassword.addEventListener(
        "click",
        async (event) => {

            event.preventDefault();


            const emailInput =
                document.getElementById("email");


            const email =
                emailInput
                    ? emailInput.value.trim()
                    : "";


            if (!email) {

                alert(
                    "Please enter your email address first."
                );

                return;
            }


            try {

                await sendPasswordResetEmail(
                    auth,
                    email
                );


                alert(
                    "Password reset email sent successfully.\n\n" +
                    "Please check your inbox."
                );

            }

            catch (error) {

                console.error(
                    "Password reset error:",
                    error
                );


                switch (error.code) {

                    case "auth/invalid-email":

                        alert(
                            "Please enter a valid email address."
                        );

                        break;


                    case "auth/user-not-found":

                        alert(
                            "No account found with this email address."
                        );

                        break;


                    default:

                        alert(
                            "Unable to send password reset email."
                        );
                }
            }
        }
    );
}


// ============================================================
// RESEND VERIFICATION EMAIL
// ============================================================

const resendVerification =
    document.getElementById(
        "resendVerification"
    );

if (resendVerification) {

    resendVerification.addEventListener(
        "click",
        async (event) => {

            event.preventDefault();


            const emailInput =
                document.getElementById("email");

            const passwordInput =
                document.getElementById("password");


            const email =
                emailInput
                    ? emailInput.value.trim()
                    : "";

            const password =
                passwordInput
                    ? passwordInput.value
                    : "";


            if (!email || !password) {

                alert(
                    "Enter your email and password first."
                );

                return;
            }


            try {

                // ------------------------------------------------
                // TEMPORARY SIGN IN
                // ------------------------------------------------

                const userCredential =
                    await signInWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );


                const user =
                    userCredential.user;


                await user.reload();


                // ------------------------------------------------
                // ALREADY VERIFIED
                // ------------------------------------------------

                if (user.emailVerified) {

                    alert(
                        "Your email is already verified."
                    );


                    await signOut(auth);

                    return;
                }


                // ------------------------------------------------
                // SEND VERIFICATION
                // ------------------------------------------------

                await sendEmailVerification(user);


                // ------------------------------------------------
                // SIGN OUT
                // ------------------------------------------------

                await signOut(auth);


                alert(
                    "A new verification email has been sent.\n\n" +
                    "Please check your inbox."
                );

            }

            catch (error) {

                console.error(
                    "Resend verification error:",
                    error
                );


                alert(
                    "Unable to resend verification email.\n\n" +
                    "Please check your email and password."
                );
            }
        }
    );
}


// ============================================================
// SHOW / HIDE PASSWORD
// ============================================================

const togglePassword =
    document.getElementById(
        "togglePassword"
    );

if (togglePassword) {

    togglePassword.addEventListener(
        "click",
        () => {

            const password =
                document.getElementById(
                    "password"
                );


            if (!password) {
                return;
            }


            if (
                password.type ===
                "password"
            ) {

                password.type =
                    "text";

                togglePassword.textContent =
                    "Hide";

            }

            else {

                password.type =
                    "password";

                togglePassword.textContent =
                    "Show";
            }
        }
    );
}


// ============================================================
// DASHBOARD ELEMENTS
// ============================================================

const userNameElement =
    document.getElementById(
        "userName"
    );

const userRoleElement =
    document.getElementById(
        "userRole"
    );

const welcomeNameElement =
    document.getElementById(
        "welcomeName"
    );

const userAvatarElement =
    document.getElementById(
        "userAvatar"
    );


const profileName =
    document.getElementById(
        "profileName"
    );

const profileRole =
    document.getElementById(
        "profileRole"
    );

const profileEmail =
    document.getElementById(
        "profileEmail"
    );

const profileAge =
    document.getElementById(
        "profileAge"
    );

const profileRoleDetail =
    document.getElementById(
        "profileRoleDetail"
    );

const profileAvatar =
    document.getElementById(
        "profileAvatar"
    );


// ============================================================
// LOAD DASHBOARD USER
// ============================================================

if (userNameElement) {

    console.log(
        "Dashboard detected. Waiting for Firebase user..."
    );


    onAuthStateChanged(
        auth,
        async (user) => {

            // ------------------------------------------------
            // NO USER
            // ------------------------------------------------

            if (!user) {

                console.log(
                    "No authenticated user."
                );


                window.location.href =
                    "index.html";

                return;
            }


            console.log(
                "Authenticated UID:",
                user.uid
            );


            try {

                // ------------------------------------------------
                // REFRESH AUTH USER
                // ------------------------------------------------

                await user.reload();


                // ------------------------------------------------
                // EMAIL VERIFICATION
                // ------------------------------------------------

                if (!user.emailVerified) {

                    console.log(
                        "Email is not verified."
                    );


                    await signOut(auth);


                    window.location.href =
                        "index.html";

                    return;
                }


                // ------------------------------------------------
                // DEFAULT VALUES
                // ------------------------------------------------

                let name =
                    user.displayName ||
                    "User";

                let email =
                    user.email ||
                    "Not available";

                let age =
                    "Not available";


                // ------------------------------------------------
                // GET FIRESTORE USER DOCUMENT
                // ------------------------------------------------

                const userRef =
                    doc(
                        db,
                        "users",
                        user.uid
                    );


                console.log(
                    "Reading Firestore:",
                    `users/${user.uid}`
                );


                const userSnapshot =
                    await getDoc(userRef);


                // ------------------------------------------------
                // FIRESTORE DOCUMENT EXISTS
                // ------------------------------------------------

                if (userSnapshot.exists()) {

                    const userData =
                        userSnapshot.data();


                    console.log(
                        "Firestore user data:",
                        userData
                    );


                    name =
                        userData.name ||
                        "User";


                    email =
                        userData.email ||
                        user.email ||
                        "Not available";


                    age =
                        userData.age !== undefined &&
                        userData.age !== null
                            ? userData.age
                            : "Not available";
                }


                // ------------------------------------------------
                // DOCUMENT DOES NOT EXIST
                // ------------------------------------------------

                else {

                    console.warn(
                        "No Firestore document found for UID:",
                        user.uid
                    );


                    // Authentication data is still usable

                    name =
                        user.displayName ||
                        "User";

                    email =
                        user.email ||
                        "Not available";
                }


                // =================================================
                // UPDATE NAVBAR
                // =================================================

                if (userNameElement) {

                    userNameElement.textContent =
                        name;
                }


                if (userRoleElement) {

                    userRoleElement.textContent =
                        "User";
                }


                if (welcomeNameElement) {

                    welcomeNameElement.textContent =
                        name;
                }


                // =================================================
                // AVATAR
                // =================================================

                const firstLetter =
                    name
                        .charAt(0)
                        .toUpperCase();


                if (userAvatarElement) {

                    userAvatarElement.textContent =
                        firstLetter;
                }


                if (profileAvatar) {

                    profileAvatar.textContent =
                        firstLetter;
                }


                // =================================================
                // PROFILE
                // =================================================

                if (profileName) {

                    profileName.textContent =
                        name;
                }


                if (profileEmail) {

                    profileEmail.textContent =
                        email;
                }


                if (profileAge) {

                    profileAge.textContent =
                        age;
                }


                // Project has only one user type

                if (profileRole) {

                    profileRole.textContent =
                        "User";
                }


                if (profileRoleDetail) {

                    profileRoleDetail.textContent =
                        "User";
                }


                console.log(
                    "Dashboard data loaded successfully."
                );

            }

            catch (error) {

                console.error(
                    "FIRESTORE/DASHBOARD ERROR:",
                    error
                );


                // =================================================
                // FALLBACK
                // =================================================

                const fallbackName =
                    user.displayName ||
                    "User";


                if (userNameElement) {

                    userNameElement.textContent =
                        fallbackName;
                }


                if (welcomeNameElement) {

                    welcomeNameElement.textContent =
                        fallbackName;
                }


                if (profileName) {

                    profileName.textContent =
                        fallbackName;
                }


                if (profileEmail) {

                    profileEmail.textContent =
                        user.email ||
                        "Not available";
                }


                if (profileAge) {

                    profileAge.textContent =
                        "Unable to load";
                }


                if (userRoleElement) {

                    userRoleElement.textContent =
                        "User";
                }


                if (profileRole) {

                    profileRole.textContent =
                        "User";
                }


                if (profileRoleDetail) {

                    profileRoleDetail.textContent =
                        "User";
                }


                const firstLetter =
                    fallbackName
                        .charAt(0)
                        .toUpperCase();


                if (userAvatarElement) {

                    userAvatarElement.textContent =
                        firstLetter;
                }


                if (profileAvatar) {

                    profileAvatar.textContent =
                        firstLetter;
                }


                // ------------------------------------------------
                // IMPORTANT ERROR MESSAGE
                // ------------------------------------------------

                if (
                    error.code ===
                    "permission-denied"
                ) {

                    console.error(
                        "Firestore permission denied. " +
                        "Check Firestore Security Rules."
                    );
                }
            }
        }
    );
}


// ============================================================
// LOGOUT
// ============================================================

const logoutButton =
    document.getElementById(
        "logoutButton"
    );

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async () => {

            try {

                console.log(
                    "Logging out..."
                );


                await signOut(auth);


                console.log(
                    "Logout successful"
                );


                window.location.href =
                    "index.html";

            }

            catch (error) {

                console.error(
                    "Logout error:",
                    error
                );


                alert(
                    "Unable to logout. Please try again."
                );
            }
        }
    );
}