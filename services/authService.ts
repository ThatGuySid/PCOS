// authService.ts
// Place this file at: services/authService.ts

import {
    AuthError,
    createUserWithEmailAndPassword,
    deleteUser,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    User,
} from "firebase/auth";
import { auth } from "./firebaseConfig";

// ── Types ─────────────────────────────────────────────────────────────────────

export type AuthResult =
  | { success: true; user: User }
  | { success: false; error: string };

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

// ── Public API ────────────────────────────────────────────────────────────────

export async function signUp(
  email: string,
  password: string,
): Promise<AuthResult> {
  try {
    const credential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    return { success: true, user: credential.user };
  } catch (err) {
    return { success: false, error: friendlyError(err as AuthError) };
  }
}

export async function logIn(
  email: string,
  password: string,
): Promise<AuthResult> {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: credential.user };
  } catch (err) {
    return { success: false, error: friendlyError(err as AuthError) };
  }
}

export async function logOut(): Promise<{ success: boolean; error?: string }> {
  try {
    await signOut(auth);
    return { success: true };
  } catch (err) {
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
    const user = auth.currentUser;
    if (!user) {
      return { success: false, error: "No signed-in account found." };
    }

    await deleteUser(user);
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: friendlyError(err as AuthError),
    };
  }
}

export function subscribeToAuthState(
  callback: (user: User | null) => void,
): () => void {
  return onAuthStateChanged(auth, callback);
}

export function getCurrentUser(): User | null {
  return auth.currentUser;
}
