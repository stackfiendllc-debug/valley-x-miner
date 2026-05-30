document.addEventListener("DOMContentLoaded", () => {
  const walletBtn = document.getElementById("walletBtn");
  const mineBtn = document.getElementById("mineBtn");
  const balanceEl = document.getElementById("balance");
  const statusEl = document.getElementById("status");
  const walletStatus = document.getElementById("walletStatus");
  const walletDisplay = document.getElementById("walletDisplay");
  const pulse = document.getElementById("miningPulse");

  let connected = false;
  let balance = 0;
  let miningInterval;

  walletBtn.addEventListener("click", () => {
    connected = true;

    walletStatus.textContent = "Connected";
    walletDisplay.textContent = "VLX...MINER";
    statusEl.textContent = "Wallet Connected";
  });

  mineBtn.addEventListener("click", () => {
    if (!connected) {
      statusEl.textContent = "Connect wallet first";
      return;
    }

    if (miningInterval) return;

    statusEl.textContent = "Mining Active";
    pulse.classList.add("active");

    miningInterval = setInterval(() => {
      balance += 0.0008;   // much lower mining rate
      balanceEl.textContent = balance.toFixed(6) + " VLX";
    }, 5000); // every 5 seconds
  });
});