let balance = 0;
let walletConnected = false;
let miningInterval = null;

const connectBtn = document.getElementById("connectWallet");
const mineBtn = document.getElementById("startMining");
const balanceEl = document.getElementById("walletBalance");
const statusEl = document.getElementById("walletStatus");

connectBtn.addEventListener("click", () => {
  walletConnected = true;
  statusEl.textContent = "Wallet Connected";
  connectBtn.textContent = "Connected";
});

mineBtn.addEventListener("click", () => {
  if (!walletConnected) {
    alert("Connect Phantom Wallet first.");
    return;
  }

  if (miningInterval) return;

  statusEl.textContent = "Mining Active";

  miningInterval = setInterval(() => {
    balance += 0.000000050;
    balanceEl.textContent = balance.toFixed(9) + " VLX";
  }, 30000);
});