import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendEmailVerification,
    sendPasswordResetEmail,
    signOut
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


// ==============================
// FIREBASE CONFIGURATION
// ==============================

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// ==============================
// INITIALIZE FIREBASE
// ==============================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


// ==============================
// REGISTRATION
// ==============================

const registerForm =
    document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async (e) => {

        e.preventDefault();


        const name =
            document.getElementById("name").value.trim();

        const age =
            document.getElementById("age").value;

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;

        const message =
            document.getElementById("message");


        message.style.color = "#6366f1";

        message.textContent =
            "Creating your account...";


        try {

            // ==============================
            // CREATE FIREBASE ACCOUNT
            // ==============================

            const userCredential =
                await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


            const user =
                userCredential.user;


            // ==============================
            // SEND EMAIL VERIFICATION
            // ==============================

            await sendEmailVerification(user);


            // ==============================
            // SAVE USER DATA
            // ==============================

            await setDoc(
                doc(db, "users", user.uid),
                {
                    name: name,
                    age: Number(age),
                    email: email,
                    createdAt: serverTimestamp()
                }
            );


            // ==============================
            // SIGN USER OUT
            // ==============================

            await signOut(auth);


            // ==============================
            // SUCCESS MESSAGE
            // ==============================

            message.style.color = "#16a34a";

            message.textContent =
                "Account created! A verification link has been sent to your email.";


            registerForm.reset();


            alert(
                "Account created successfully!\n\n" +
                "A verification link has been sent to your email.\n\n" +
                "Please verify your email before logging in."
            );


            // Go back to login
            setTimeout(() => {

                window.location.href =
                    "index.html";

            }, 1000);


        }

        catch (error) {

            console.error(
                "Registration error:",
                error
            );


            message.style.color =
                "#dc2626";


            if (
                error.code ===
                "auth/email-already-in-use"
            ) {

                message.textContent =
                    "This email is already registered.";

            }


            else if (
                error.code ===
                "auth/weak-password"
            ) {

                message.textContent =
                    "Password must be at least 6 characters.";

            }


            else if (
                error.code ===
                "auth/invalid-email"
            ) {

                message.textContent =
                    "Please enter a valid email address.";

            }


            else {

                message.textContent =
                    "Registration failed. Please try again.";

            }

        }

    });

}


// ==============================
// LOGIN
// ==============================

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener("submit", async (e) => {

        e.preventDefault();


        const email =
            document.getElementById("email")
                .value
                .trim();


        const password =
            document.getElementById("password")
                .value;


        const message =
            document.getElementById("message");


        message.style.color =
            "#6366f1";


        message.textContent =
            "Signing in...";


        try {

            // ==============================
            // LOGIN
            // ==============================

            const userCredential =
                await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


            const user =
                userCredential.user;


            // ==============================
            // CHECK EMAIL VERIFICATION
            // ==============================

            await user.reload();


            if (!user.emailVerified) {

                await signOut(auth);


                message.style.color =
                    "#dc2626";


                message.textContent =
                    "Please verify your email before logging in.";


                alert(
                    "Your email address has not been verified yet.\n\n" +
                    "Please check your inbox and click the verification link."
                );


                return;
            }


            // ==============================
            // VERIFIED USER
            // ==============================

            console.log(
                "Logged in:",
                user.uid
            );


            message.style.color =
                "#16a34a";


            message.textContent =
                "Login successful!";


            setTimeout(() => {

                window.location.href =
                    "dashboard.html";

            }, 800);

        }


        catch (error) {

            console.error(
                "Login error:",
                error
            );


            message.style.color =
                "#dc2626";


            if (
                error.code ===
                    "auth/invalid-credential" ||
                error.code ===
                    "auth/wrong-password" ||
                error.code ===
                    "auth/user-not-found"
            ) {

                message.textContent =
                    "Incorrect email or password.";

            }


            else {

                message.textContent =
                    "Login failed. Please try again.";

            }

        }

    });

}


// ==============================
// FORGOT PASSWORD
// ==============================

const forgotPassword =
    document.getElementById("forgotPassword");


if (forgotPassword) {

    forgotPassword.addEventListener(
        "click",
        async (e) => {

            e.preventDefault();


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


                if (
                    error.code ===
                    "auth/invalid-email"
                ) {

                    alert(
                        "Please enter a valid email address."
                    );

                }


                else if (
                    error.code ===
                    "auth/user-not-found"
                ) {

                    alert(
                        "No account found with this email address."
                    );

                }


                else {

                    alert(
                        "Unable to send password reset email. Please try again."
                    );

                }

            }

        }
    );

}


// ==============================
// RESEND VERIFICATION EMAIL
// ==============================

const resendVerification =
    document.getElementById(
        "resendVerification"
    );


if (resendVerification) {

    resendVerification.addEventListener(
        "click",
        async (e) => {

            e.preventDefault();


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

                // Temporarily sign in
                const userCredential =
                    await signInWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );


                const user =
                    userCredential.user;


                await user.reload();


                // Already verified
                if (user.emailVerified) {

                    alert(
                        "Your email is already verified."
                    );


                    await signOut(auth);

                    return;
                }


                // Send verification email
                await sendEmailVerification(user);


                // Sign out again
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
                    "Unable to resend verification email. " +
                    "Please check your email and password."
                );

            }

        }
    );

}


// ==============================
// SHOW / HIDE PASSWORD
// ==============================

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


// ==============================
// DASHBOARD USER DATA
// ==============================

const userNameElement = document.getElementById("userName");
const userRoleElement = document.getElementById("userRole");
const welcomeNameElement = document.getElementById("welcomeName");
const userAvatarElement = document.getElementById("userAvatar");

const profileName = document.getElementById("profileName");
const profileRole = document.getElementById("profileRole");
const profileEmail = document.getElementById("profileEmail");
const profileAge = document.getElementById("profileAge");
const profileRoleDetail = document.getElementById("profileRoleDetail");
const profileAvatar = document.getElementById("profileAvatar");


// ==============================
// DASHBOARD AUTH
// ==============================

if (userNameElement) {

    auth.onAuthStateChanged(async (user) => {

        // No user logged in
        if (!user) {
            window.location.href = "index.html";
            return;
        }

        console.log("Logged in UID:", user.uid);

        try {

            // Get Firestore user document
            const userRef = doc(db, "users", user.uid);
            const userSnapshot = await getDoc(userRef);

            if (!userSnapshot.exists()) {

                console.error(
                    "No Firestore user document found for UID:",
                    user.uid
                );

                userNameElement.textContent = "User";
                welcomeNameElement.textContent = "User";

                if (profileName) {
                    profileName.textContent = "User";
                }

                if (profileEmail) {
                    profileEmail.textContent =
                        user.email || "Not available";
                }

                if (profileAge) {
                    profileAge.textContent = "Not available";
                }

                if (userAvatarElement) {
                    userAvatarElement.textContent = "U";
                }

                if (profileAvatar) {
                    profileAvatar.textContent = "U";
                }

                return;
            }

            // Get Firestore data
            const userData = userSnapshot.data();

            console.log("User data:", userData);

            const name = userData.name || "User";
            const email = userData.email || user.email || "Not available";
            const age = userData.age || "Not available";

            // You removed roles from the project,
            // so display User instead.
            const role = "User";


            // ==============================
            // NAVBAR
            // ==============================

            if (userNameElement) {
                userNameElement.textContent = name;
            }

            if (userRoleElement) {
                userRoleElement.textContent = role;
            }

            if (welcomeNameElement) {
                welcomeNameElement.textContent = name;
            }

            if (userAvatarElement) {
                userAvatarElement.textContent =
                    name.charAt(0).toUpperCase();
            }


            // ==============================
            // PROFILE
            // ==============================

            if (profileName) {
                profileName.textContent = name;
            }

            if (profileEmail) {
                profileEmail.textContent = email;
            }

            if (profileAge) {
                profileAge.textContent = age;
            }

            if (profileRole) {
                profileRole.textContent = "User";
            }

            if (profileRoleDetail) {
                profileRoleDetail.textContent = "User";
            }

            if (profileAvatar) {
                profileAvatar.textContent =
                    name.charAt(0).toUpperCase();
            }

        }

        catch (error) {

            console.error(
                "Error fetching user data:",
                error
            );

            // Don't leave the page permanently showing Loading...
            userNameElement.textContent = "Unable to load";
            welcomeNameElement.textContent = "User";

            if (profileName) {
                profileName.textContent = "Unable to load";
            }

        }

    });

}


// ==============================
// DASHBOARD AUTH CHECK
// ==============================

if (userNameElement) {

    auth.onAuthStateChanged(
        async (user) => {

            // ==============================
            // NO USER
            // ==============================

            if (!user) {

                window.location.href =
                    "index.html";

                return;
            }


            // ==============================
            // CHECK EMAIL VERIFICATION
            // ==============================

            await user.reload();


            if (!user.emailVerified) {

                await signOut(auth);

                window.location.href =
                    "index.html";

                return;
            }


            try {

                // ==============================
                // GET USER DATA
                // ==============================

                const userRef =
                    doc(
                        db,
                        "users",
                        user.uid
                    );


                const userSnapshot =
                    await getDoc(userRef);


                if (
                    userSnapshot.exists()
                ) {

                    const userData =
                        userSnapshot.data();


                    console.log(
                        "User data:",
                        userData
                    );


                    const name =
                        userData.name ||
                        "User";


                    const email =
                        userData.email ||
                        user.email ||
                        "Not available";


                    const age =
                        userData.age ||
                        "Not available";


                    // ==============================
                    // DASHBOARD NAME
                    // ==============================

                    if (
                        userNameElement
                    ) {

                        userNameElement.textContent =
                            name;

                    }


                    if (
                        welcomeNameElement
                    ) {

                        welcomeNameElement.textContent =
                            name;

                    }


                    // ==============================
                    // AVATAR
                    // ==============================

                    if (
                        userAvatarElement
                    ) {

                        userAvatarElement.textContent =
                            name
                                .charAt(0)
                                .toUpperCase();

                    }


                    // ==============================
                    // PROFILE
                    // ==============================

                    if (
                        profileName
                    ) {

                        profileName.textContent =
                            name;

                    }


                    if (
                        profileEmail
                    ) {

                        profileEmail.textContent =
                            email;

                    }


                    if (
                        profileAge
                    ) {

                        profileAge.textContent =
                            age;

                    }


                    if (
                        profileAvatar
                    ) {

                        profileAvatar.textContent =
                            name
                                .charAt(0)
                                .toUpperCase();

                    }

                }


                else {

                    console.log(
                        "User document does not exist."
                    );

                }

            }


            catch (error) {

                console.error(
                    "Error fetching user data:",
                    error
                );

            }

        }
    );

}


// ==============================
// LOGOUT
// ==============================

const logoutButton =
    document.getElementById(
        "logoutButton"
    );


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async () => {

            try {

                await signOut(auth);


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