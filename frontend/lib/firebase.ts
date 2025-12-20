let firebaseAuth: any = null;

/**
 * Firebase Auth をクライアントでのみ初期化して返す
 */
export async function getFirebaseAuth() {
  if (firebaseAuth) return firebaseAuth;

  // 🔴 ここで初めて firebase を読む
  const { initializeApp, getApps, getApp } = await import("firebase/app");
  const { getAuth } = await import("firebase/auth");

  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  };

  const app =
    getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

  firebaseAuth = getAuth(app);
  return firebaseAuth;
}
