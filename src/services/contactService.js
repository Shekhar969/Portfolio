import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";

export async function submitContactMessage({ name, email, subject, message }) {
  await addDoc(collection(db, "contactMessages"), {
    name: name.trim(),
    email: email.trim(),
    subject: subject.trim(),
    message: message.trim(),
    createdAt: serverTimestamp(),
    status: "unread",
  });
}