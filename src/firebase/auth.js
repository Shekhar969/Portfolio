import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "./config";

export const ADMIN_UID = import.meta.env.VITE_ADMIN_UID;

export const signIn = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const signOutAdmin = () => signOut(auth);

export const subscribeToAuth = (callback) => onAuthStateChanged(auth, callback);

export function getAuthErrorMessage(error) {
  switch (error?.code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
    case "auth/invalid-email":
      return "Incorrect email or password.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a few minutes and try again.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";
    default:
      return "Could not sign in. Please try again.";
  }
}