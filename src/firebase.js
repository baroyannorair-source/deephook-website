import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBjLRTMoozRW1GsPCw-Gk7KDA49dn-gQ",
  authDomain: "deephook-agency.firebaseapp.com",
  projectId: "deephook-agency",
  storageBucket: "deephook-agency.firebasestorage.app",
  messagingSenderId: "831067378662",
  appId: "1:831067378662:web:31625a5d688919885fbc27"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
