let balance = 0;
let mining = false;

const connectBtn = document.getElementById("connectBtn");
const mineBtn = document.getElementById("mineBtn");
const testBtn = document.getElementById("testBtn");

const walletAddress = document.getElementById("walletAddress");
const balanceDisplay = document.getElementById("balance");
const status = document.getElementById("status");

connectBtn.addEventListener("click", async () => {
  if ("solana" in window) {
    try {
      const resp = await window.solana.connect();
      walletAddress.textContent = resp.publicKey.toString();
      status.textContent = "Phantom Connected";
    } catch {
      status.textContent = "Connection Cancelled";
    }
  } else {
    status.textContent = "Install Phantom Wallet";
  }
});

mineBtn.addEventListener("click", () => {
  if (mining) return;

  mining = true;
  status.textContent = "Mining Started";

  setInterval(() => {
    balance += 0.00000005;
    balanceDisplay.textContent = balance.toFixed(8) + " VLX";
  }, 30000);
});

testBtn.addEventListener("click", () => {
  status.textContent = "Test Successful";
});