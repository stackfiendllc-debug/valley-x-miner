const connectBtn = document.getElementById("connectBtn");
const mineBtn = document.getElementById("mineBtn");
const walletEl = document.getElementById("wallet");
const balanceEl = document.getElementById("balance");
const statusEl = document.getElementById("status");

let walletAddress = null;
let mining = false;
let rewards = 0.000000050;
let claimedBalance = 0;
let miningInterval = null;

// CONNECT PHANTOM
connectBtn.addEventListener("click", async () => {
  if ("solana" in window) {
    const provider = window.solana;

    if (provider.isPhantom) {
      try {
        const resp = await provider.connect();
        walletAddress = resp.publicKey.toString();

        walletEl.textContent =
          walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4);

        // Load saved claimed balance
        const saved = localStorage.getItem(walletAddress);

        if (saved) {
          claimedBalance = parseFloat(saved);
          rewards = claimedBalance;
        }

        balanceEl.textContent = rewards.toFixed(9) + " VLX";
        statusEl.textContent = "Wallet Connected";

      } catch (err) {
        statusEl.textContent = "Connection cancelled";
      }
    }
  } else {
    window.open("https://phantom.app/", "_blank");
  }
});

// START / STOP MINING
mineBtn.addEventListener("click", () => {
  if (!walletAddress) {
    statusEl.textContent = "Connect wallet first";
    return;
  }

  if (!mining) {
    mining = true;
    mineBtn.textContent = "Stop Mining";
    statusEl.textContent = "Mining Active";

    miningInterval = setInterval(() => {
      rewards += 0.000000050;
      balanceEl.textContent = rewards.toFixed(9) + " VLX";
    }, 1000);

  } else {
    mining = false;
    mineBtn.textContent = "Start Mining";
    statusEl.textContent = "Mining Stopped";
    clearInterval(miningInterval);
  }
});

// CLAIM REWARDS
function claimRewards() {
  if (!walletAddress) {
    statusEl.textContent = "Connect wallet first";
    return;
  }

  claimedBalance = rewards;
  localStorage.setItem(walletAddress, claimedBalance);

  statusEl.textContent = "Rewards Claimed & Saved";
}

// Make claim button work
window.claimRewards = claimRewards;