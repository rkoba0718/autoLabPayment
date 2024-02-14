import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCfshnhhC7cus-IN-buc40bd1JqTHYWCu4",
  authDomain: "autolabpayment.firebaseapp.com",
  projectId: "autolabpayment",
  storageBucket: "autolabpayment.appspot.com",
  messagingSenderId: "965886734708",
  appId: "1:965886734708:web:f99675e919f0462fe67c21",
  measurementId: "G-3YSD0BMZ5R",
};

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);