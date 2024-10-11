import { auth } from "./firebase_config";

const admin = require("firebase-admin");

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
});


interface AdminDetails {
    uid: string,
    name: string,
    role: "admin" | "super_admin",
    permissions: {
        can_view_schedules: boolean,
        can_modify_schedules: boolean,
        can_accept_request: boolean,
        can_create_accounts: boolean
    }
}

function CreateAdmin(user: AdminDetails) {
    
    const userRef = admin.database().ref(`users/${user.uid}`);
    return userRef.set(user);
}


