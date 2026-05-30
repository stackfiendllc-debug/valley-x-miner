import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDCJC-9qG1klPuVgVgypwTPmXrNGjmoFJ8",
  authDomain: "valley-x-miner.firebaseapp.com",
  projectId: "valley-x-miner",
  storageBucket: "valley-x-miner.firebasestorage.app",
  messagingSenderId: "564050490743",
  appId: "1:564050490743:web:421b8f7c42d50ed4d15d72",
  measurementId: "G-5VWEVH3MEE"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let balance = 0;
let mining = false;

window.startMining = async function () {
  if (!window.walletAddress) {
    alert("Connect Phantom first");
    return;
  }

  if (mining) return;
  mining = true;

  setInterval(async () => {
    balance += 0.00000005;

    document.getElementById("balance").innerText =
      "Balance: " + balance.toFixed(9) + " VLX";

    await setDoc(doc(db, "miners", window.walletAddress), {
      balance: balance,
      wallet: window.walletAddress
    });

  }, 30000);
};