import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDCJC-9qG1klPuVgVgypwTPmXrNGjmoFJ8",
  authDomain: "valley-x-miner.firebaseapp.com",
  projectId: "valley-x-miner",
  storageBucket: "valley-x-miner.firebasestorage.app",
  messagingSenderId: "564050490743",
  appId: "1:564050490743:web:421b8f7c42d50ed4d15d72"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let walletAddress = localStorage.getItem("vlxWallet");
let balance = 0;
let miningStarted = false;

const connectBtn = document.getElementById("connectBtn");
const mineBtn = document.getElementById("mineBtn");
const walletDisplay = document.getElementById("wallet");
const balanceDisplay = document.getElementById("balance");

if (walletAddress) {
  loadWalletData();
}

connectBtn.addEventListener("click", async () => {
  const provider = window.phantom?.solana || window.solana;

  if (provider?.isPhantom) {
    try {
      const resp = await provider.connect();
      walletAddress = resp.publicKey.toString();

      localStorage.setItem("vlxWallet", walletAddress);

      await loadWalletData();

    } catch (err) {
      alert("Phantom connection failed");
    }
  } else {
    window.location.href =
      "https://phantom.app/ul/browse/https://stackfiendllc-debug.github.io/valley-x-miner/";
  }
});

mineBtn.addEventListener("click", async () => {
  if (!walletAddress) {
    alert("Connect wallet first");
    return;
  }

  if (miningStarted) return;
  miningStarted = true;

  setInterval(async () => {
    balance += 0.000000050;

    await updateDoc(doc(db, "miners", walletAddress), {
      balance: balance
    });

    updateBalance();
  }, 30000);
});

async function loadWalletData() {
  walletDisplay.textContent =
    walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4);

  const userRef = doc(db, "miners", walletAddress);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    balance = userSnap.data().balance || 0;
  } else {
    await setDoc(userRef, {
      wallet: walletAddress,
      balance: 0
    });
  }

  updateBalance();
}

function updateBalance() {
  balanceDisplay.textContent = balance.toFixed(9) + " VLX";
}