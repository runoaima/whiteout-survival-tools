import {
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    OAuthProvider,
    signInWithPopup,
} from "firebase/auth";
import { auth } from "./firebase";

/* メールログイン */
export async function loginWithEmail(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
}

/* Googleログイン */
export async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
        return await signInWithPopup(auth, provider);
    } catch (e) {
        if (e instanceof Error && "code" in e && e.code === "auth/popup-closed-by-user") {
            return;
        }
        throw e;
    }

}

/* Appleログイン */
export async function loginWithApple() {
    const provider = new OAuthProvider("apple.com");
    try {
        return await signInWithPopup(auth, provider);
    } catch (e) {
        if (e instanceof Error && "code" in e && e.code === "auth/popup-closed-by-user") {
            return;
        }
        throw e;
    }

}
