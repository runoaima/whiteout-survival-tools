import { auth } from "./firebase";

/* メールログイン */
export async function loginWithEmail(email: string, password: string) {
    const { signInWithEmailAndPassword } = await import("firebase/auth");
    return signInWithEmailAndPassword(auth, email, password);
}

/* Googleログイン */
export async function loginWithGoogle() {
    const {
        GoogleAuthProvider,
        signInWithPopup,
    } = await import("firebase/auth");

    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
}

/* Appleログイン */
export async function loginWithApple() {
    const {
        OAuthProvider,
        signInWithPopup,
    } = await import("firebase/auth");

    const provider = new OAuthProvider("apple.com");
    return signInWithPopup(auth, provider);
}
