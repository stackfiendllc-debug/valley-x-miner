let balance = localStorage.getItem("vlxBalance")
  ? parseFloat(localStorage.getItem("vlxBalance"))
  : 0;

let mining = localStorage.getItem("vlxMining") === "true";

const balanceEl = document.getElementById("balance");
const mineBtn = document.getElementById("mineBtn");
const walletBtn = document.getElementById("walletBtn");
const statusEl = document.getElementById("status");

function updateBalance() {
  balanceEl.textContent = balance.toFixed(2) + " VLX";
  localStorage.setItem("vlxBalance", balance);
}

function mine() {
  if (mining) {
    balance += 0.25;
    updateBalance();
  }
}

mineBtn.addEventListener("click", () => {
  mining = !mining;
  localStorage.setItem("vlxMining", mining);

  if (mining) {
    mineBtn.textContent = "Stop Mining";
    statusEl.textContent = "Mining active...";
  } else {
    mineBtn.textContent = "Start Mining";
    statusEl.textContent = "Mining paused";
  }
});

walletBtn.addEventListener("click", async () => {
  if (window.solana && window.solana.isPhantom) {
    try {
      await window.solana.connect();
      statusEl.textContent = "Phantom Connected";
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

if (mining) {
  mineBtn.textContent = "Stop Mining";
  statusEl.textContent = "Mining active...";
}

updateBalance();
setInterval(mine, 3000);