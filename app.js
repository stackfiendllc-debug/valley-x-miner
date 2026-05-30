const connectBtn = document.getElementById("connectBtn");
const mineBtn = document.getElementById("mineBtn");
const walletDisplay = document.getElementById("wallet");
const balanceDisplay = document.getElementById("balance");
const statusDisplay = document.getElementById("status");

let walletAddress = null;
let mining = false;
let reward = 0;

connectBtn.addEventListener("click", async () => {
  try {
    const provider = window.phantom?.solana || window.solana;

    if (!provider) {
      statusDisplay.textContent = "Phantom not detected";
      alert("Install Phantom Wallet extension in Chrome");
      return;
    }

    const resp = await provider.connect();

    walletAddress = resp.publicKey.toString();

    walletDisplay.textContent =
      walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4);

    statusDisplay.textContent = "Connected ✔";

  } catch (err) {
    console.error(err);
    statusDisplay.textContent = "Connection Failed";
  }
});

mineBtn.addEventListener("click", () => {
  if (!walletAddress) {
    alert("Connect wallet first");
    return;
  }

  mining = !mining;

  if (mining) {
    mineBtn.textContent = "Stop Mining";
    statusDisplay.textContent = "Mining Active";

    const interval = setInterval(() => {
      if (!mining) {
        clearInterval(interval);
        return;
      }

      reward += 0.00000005;
      balanceDisplay.textContent = reward.toFixed(9) + " VLX";
    }, 10000);

  } else {
    mineBtn.textContent = "Start Mining";
    statusDisplay.textContent = "Idle";
  }
});