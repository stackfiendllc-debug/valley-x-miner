document.addEventListener("DOMContentLoaded", () => {
  const CLAIM_URL = "https://vjalivzqoiqnuadbkrce.supabase.co/functions/v1/claim-vlx";

  let wallet = localStorage.getItem("wallet") || null;
  let balance = parseFloat(localStorage.getItem("vlxBalance")) || 0;
  let mining = false;
  let hash = 0;

  const connectBtn = document.getElementById("connectBtn");
  const mineBtn = document.getElementById("mineBtn");
  const claimBtn = document.getElementById("claimBtn");

  const walletText = document.getElementById("walletText");
  const balanceText = document.getElementById("balanceText");
  const hashRate = document.getElementById("hashRate");
  const statusText = document.getElementById("statusText");

  function updateUI() {
    walletText.textContent = wallet
      ? wallet.slice(0, 8) + "..." + wallet.slice(-6)
      : "Not Connected";

    balanceText.textContent = balance.toFixed(9) + " VLX";
    hashRate.textContent = hash + " H/s";

    claimBtn.disabled = balance < 0.01;
    mineBtn.disabled = !wallet;
  }

  async function connectWallet() {
    if (!window.solana?.isPhantom) {
      alert("Open inside Phantom browser");
      return;
    }

    try {
      const resp = await window.solana.connect();
      wallet = resp.publicKey.toString();
      localStorage.setItem("wallet", wallet);
      updateUI();
    } catch {
      alert("Connection failed");
    }
  }

  function startMining() {
    if (mining) return;

    mining = true;
    statusText.textContent = "Mining";

    setInterval(() => {
      hash = Math.floor(Math.random() * 900 + 100);
      balance += 0.00005;

      localStorage.setItem("vlxBalance", balance);
      updateUI();
    }, 30000);
  }

  async function claimVLX() {
    try {
      statusText.textContent = "Claiming";

      const res = await fetch(CLAIM_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer public"
        },
        body: JSON.stringify({
          wallet,
          amount: balance
        })
      });

      if (!res.ok) throw new Error();

      balance = 0;
      localStorage.setItem("vlxBalance", 0);

      statusText.textContent = "Claimed";
      updateUI();

      alert("VLX claimed successfully");

    } catch {
      statusText.textContent = "Claim Failed";
      alert("Claim failed");
    }
  }

  connectBtn.onclick = connectWallet;
  mineBtn.onclick = startMining;
  claimBtn.onclick = claimVLX;

  updateUI();
});