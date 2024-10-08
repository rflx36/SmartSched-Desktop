import { AuthErrorCodes, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "./firebase_config"





export const AuthCreateUser = async (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
}

export const AuthSignIn = async (email: string, password: string) => {
    let message = "";
    await signInWithEmailAndPassword(auth, email, password)
        .catch((err) => {
            if (err.message.includes(AuthErrorCodes.INVALID_EMAIL)) {
                message = "Invalid Email.";
            }
            else if (err.message.includes(AuthErrorCodes.INVALID_LOGIN_CREDENTIALS)) {
                message = "Invalid Email or Password";
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


