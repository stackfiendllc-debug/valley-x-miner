import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc
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
let miningInterval = null;

const connectBtn = document.getElementById("connectBtn");
const mineBtn = document.getElementById("mineBtn");
const walletDisplay = document.getElementById("wallet");
const balanceDisplay = document.getElementById("balance");

async function loadWalletData() {
  if (!walletAddress) return;

  const ref = doc(db, "miners", walletAddress);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    balance = snap.data().balance || 0;
  } else {
    await setDoc(ref, {
      wallet: walletAddress,
      balance: 0
    });
    balance = 0;
  }

  walletDisplay.textContent =
    walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4);

  updateBalance();
}

connectBtn.addEventListener("click", async () => {
  const provider = window.phantom?.solana || window.solana;

  if (provider?.isPhantom) {
    const resp = await provider.connect();

    walletAddress = resp.publicKey.toString();
    localStorage.setItem("vlxWallet", walletAddress);

    await loadWalletData();
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

  if (miningInterval) return;

  miningInterval = setInterval(async () => {
    balance += 0.000000050;

    await setDoc(doc(db, "miners", walletAddress), {
      wallet: walletAddress,
      balance: balance
    });

    updateBalance();
  }, 30000);
});

function updateBalance() {
  balanceDisplay.textContent = balance.toFixed(9) + " VLX";
}

// Load Firebase balance on page open
loadWalletData();