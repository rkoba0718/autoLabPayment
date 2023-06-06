import { getAuth, signInWithEmailAndPassword, UserCredential } from "firebase/auth";
import { app } from "./firebase";

export const login = (): Promise<UserCredential> => {
  const auth = getAuth(app);
  const email = "test@test.jp";
  const password = "testtest";
  const data = signInWithEmailAndPassword(auth, email, password);
  console.log(data);
  return data;
};
