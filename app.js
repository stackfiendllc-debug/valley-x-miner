const connectBtn = document.getElementById("connectBtn");
const mineBtn = document.getElementById("mineBtn");
const walletDisplay = document.getElementById("wallet");
const balanceDisplay = document.getElementById("balance");
const statusDisplay = document.getElementById("status");

let walletAddress = null;
let mining = false;
let reward = 0;

// Your VLX mint (keep for later real upgrade)
const VLX_MINT = "4G72cw8r5YgLjaH7xjzHK8JA8duwUqq2vj9u9bkjMGCg";


// -------------------------
// CONNECT WALLET (FIXED)
// -------------------------
connectBtn.addEventListener("click", async () => {
  try {

    const provider = window.phantom?.solana || window.solana;

    console.log("Phantom provider:", provider);

    // ❗ If Phantom not found
    if (!provider) {
      statusDisplay.textContent = "Phantom not detected";

      // ONLY show install page (NOT auto redirect)
      alert("Phantom wallet not found. Please install it from phantom.app");

      return;
    }

    const resp = await provider.connect();

    walletAddress = resp.publicKey.toString();

    walletDisplay.textContent =
      walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4);

    statusDisplay.textContent = "Connected ✔";

    loadBalance();

  } catch (err) {
    console.error("Connect error:", err);
    statusDisplay.textContent = "Connection Failed";
  }
});


// -------------------------
// MINING (SIMULATION ONLY)
// -------------------------
mineBtn.addEventListener("click", () => {

  if (!walletAddress) {
    alert("Connect wallet first");
    return;
  }

  if (!mining) {
    mining = true;
    mineBtn.textContent = "Stop Mining";
    statusDisplay.textContent = "Mining Active";

    setInterval(() => {
      if (!mining) return;

      reward += 0.00000005;

      balanceDisplay.textContent =
        reward.toFixed(9) + " VLX (Pending)";
    }, 10000);

  } else {
    mining = false;
    mineBtn.textContent = "Start Mining";
    statusDisplay.textContent = "Idle";
  }
});


// -------------------------
// BALANCE PLACEHOLDER (SAFE)
// -------------------------
function loadBalance() {
  balanceDisplay.textContent = "0.000000000 VLX";
}