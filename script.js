let balance = 0;
let mining = false;
let walletConnected = false;
let walletAddress = "";

const balanceEl = document.getElementById("balance");
const mineBtn = document.getElementById("mineBtn");
const walletBtn = document.getElementById("walletBtn");
const statusEl = document.getElementById("status");

function updateBalance() {
  if (!walletConnected) {
    balanceEl.textContent = "0.00 VLX";
    return;
  }

  balanceEl.textContent = balance.toFixed(2) + " VLX";
}

function getWalletKey(address) {
  return "vlx_" + address;
}

function mine() {
  if (mining && walletConnected) {
    balance += 0.25;
    localStorage.setItem(getWalletKey(walletAddress), balance);
    updateBalance();
  }
}

mineBtn.addEventListener("click", () => {
  if (!walletConnected) {
    statusEl.textContent = "Connect wallet first";
    return;
  }

  mining = !mining;

  mineBtn.textContent = mining
    ? "Stop Mining"
    : "Start Mining";

  statusEl.textContent = mining
    ? "Mining active..."
    : "Mining paused";
});

walletBtn.addEventListener("click", async () => {
  if (window.solana && window.solana.isPhantom) {
    try {
      const response = await window.solana.connect();

      walletAddress = response.publicKey.toString();
      walletConnected = true;

      balance = parseFloat(
        localStorage.getItem(getWalletKey(walletAddress))
      ) || 0;

      walletBtn.textContent = "Connected";
      statusEl.textContent =
        walletAddress.slice(0, 6) +
        "..." +
        walletAddress.slice(-4);

      updateBalance();
    } catch (err) {
      statusEl.textContent = "Connection failed";
    }
  } else {
    window.open(
      "https://phantom.app/ul/browse/https://stackfiendllc-debug.github.io/valley-x-miner/",
      "_blank"
    );
  }
});

updateBalance();

setInterval(mine, 3000);