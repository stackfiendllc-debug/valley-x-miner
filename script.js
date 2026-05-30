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
    walletDisplay.textContent = "TEST...1234";
    statusEl.textContent = "Button works — Wallet Connected";

    alert("Connect button is working");
  });

  mineBtn.addEventListener("click", () => {
    if (!connected) {
      alert("Connect wallet first");
      return;
    }

    statusEl.textContent = "Mining Active";
    pulse.classList.add("active");

    miningInterval = setInterval(() => {
      balance += 0.25;
      balanceEl.textContent = balance.toFixed(2) + " VLX";
    }, 3000);
  });
});