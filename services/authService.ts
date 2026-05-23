// authService.ts
// Place this file at: services/authService.ts

import {
    AuthError,
    createUserWithEmailAndPassword,
    deleteUser,
    onAuthStateChanged,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
    User,
} from "firebase/auth";
import { auth } from "./firebaseConfig";

function authDebug(...args: unknown[]) {
  console.log("[authService]", ...args);
}

function authWarn(...args: unknown[]) {
  console.warn("[authService]", ...args);
}

// ── Types ─────────────────────────────────────────────────────────────────────

export type AuthResult =
  | { success: true; user: User }
  | { success: false; error: string };

type AuthTimeout = { timedOut: true };

// ── Helpers ───────────────────────────────────────────────────────────────────

function friendlyError(err: AuthError): string {
  switch (err.code) {
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Incorrect email or password.";
    case "auth/requires-recent-login":
      return "Please sign in again and retry deleting your account.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";
    default:
      return err.message || "Something went wrong. Please try again.";
  }
}

function timeoutAfter(ms: number): Promise<AuthTimeout> {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ timedOut: true }), ms);
  });
}

async function withAuthTimeout<T>(
  promise: Promise<T>,
  ms = 15000,
): Promise<T | AuthTimeout> {
  return Promise.race([promise, timeoutAfter(ms)]);
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function signUp(
  email: string,
  password: string,
): Promise<AuthResult> {
  try {
    authDebug("signUp start", { email: email.trim().toLowerCase() });
    const credential = await withAuthTimeout(
      createUserWithEmailAndPassword(auth, email, password),
    );
    if ((credential as AuthTimeout).timedOut) {
      return {
        success: false,
        error: "Network timeout. Please try again.",
      };
    }
    authDebug("signUp success", { uid: credential.user.uid });
    return { success: true, user: credential.user };
  } catch (err) {
    const authErr = err as AuthError;
    authWarn("signUp failed", { code: authErr.code, message: authErr.message });
    return { success: false, error: friendlyError(err as AuthError) };
  }
}

export async function logIn(
  email: string,
  password: string,
): Promise<AuthResult> {
  try {
    authDebug("logIn start", { email: email.trim().toLowerCase() });
    const credential = await withAuthTimeout(
      signInWithEmailAndPassword(auth, email, password),
    );
    if ((credential as AuthTimeout).timedOut) {
      return {
        success: false,
        error: "Network timeout. Please try again.",
      };
    }
    authDebug("logIn success", { uid: credential.user.uid });
    return { success: true, user: credential.user };
  } catch (err) {
    const authErr = err as AuthError;
    authWarn("logIn failed", { code: authErr.code, message: authErr.message });
    return { success: false, error: friendlyError(err as AuthError) };
  }
}

export async function logOut(): Promise<{ success: boolean; error?: string }> {
  try {
    authDebug("logOut start");
    await signOut(auth);
    authDebug("logOut success");
    return { success: true };
  } catch (err) {
    const authErr = err as AuthError;
    authWarn("logOut failed", { code: authErr.code, message: authErr.message });
    return {
      success: false,
      error: friendlyError(err as AuthError),
    };
  }
}

export async function deleteCurrentUserAccount(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    authDebug("deleteCurrentUserAccount start");
    const user = auth.currentUser;
    if (!user) {
      authWarn("deleteCurrentUserAccount failed", {
        reason: "no-current-user",
      });
      return { success: false, error: "No signed-in account found." };
    }

    await deleteUser(user);
    authDebug("deleteCurrentUserAccount success", { uid: user.uid });
    return { success: true };
  } catch (err) {
    const authErr = err as AuthError;
    authWarn("deleteCurrentUserAccount failed", {
      code: authErr.code,
      message: authErr.message,
    });
    return {
      success: false,
      error: friendlyError(err as AuthError),
    };
  }
}

export function subscribeToAuthState(
  callback: (user: User | null) => void,
): () => void {
  authDebug("subscribeToAuthState start");
  return onAuthStateChanged(auth, callback);
}

export function getCurrentUser(): User | null {
  return auth.currentUser;
}

export async function resetPassword(
  email: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    authDebug("resetPassword start", { email: email.trim().toLowerCase() });
    const result = await withAuthTimeout(sendPasswordResetEmail(auth, email));
    if ((result as AuthTimeout).timedOut) {
      return {
        success: false,
        error: "Network timeout. Please try again.",
      };
    }
    authDebug("resetPassword success");
    return { success: true };
  } catch (error: unknown) {
    const authErr = error as AuthError;
    authWarn("resetPassword failed", {
      code: authErr.code,
      message: authErr.message,
    });
    return { success: false, error: authErr.message };
  }
}
