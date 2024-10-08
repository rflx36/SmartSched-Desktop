import { AuthErrorCodes, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth"
import { auth } from "./firebase_config"





export const AuthCreateUser = async (email: string, password: string, name: string) => {
    const promise = await createUserWithEmailAndPassword(auth, email, password);
    if (auth.currentUser) {
        updateProfile(auth.currentUser, {
            displayName: name
        })
    }
    return promise;
}

export const AuthSignIn = async (email: string, password: string) => {
    let message = "";
    await signInWithEmailAndPassword(auth, email, password)
        .catch((err) => {
            if (err.message.includes(AuthErrorCodes.INVALID_EMAIL)) {
                message = (email == "") ? "Email cannot be empty" : "Invalid Email.";
            }
            else if (err.message.includes(AuthErrorCodes.INVALID_LOGIN_CREDENTIALS)) {
                message = "Invalid Email or Password";
            }
            else if (err.code == "auth/missing-password"){
                message = "Password cannot be empty";
            }
            else {
                message = `${err.code} ${err.message}`;
            }
        })
    return message;
}

export const AuthSignOut = () => {
    return auth.signOut();
}


