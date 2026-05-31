document.addEventListener("DOMContentLoaded", () => {
  const SUPABASE_URL = "https://vjalivzqoiqnuadbkrce.supabase.co";
  const CLAIM_URL = `${SUPABASE_URL}/functions/v1/claim-vlx`;

  const MIN_CLAIM = 0.01;
  const MINE_RATE = 0.00005;

  let wallet = localStorage.getItem("wallet") || null;
  let minedVLX = parseFloat(localStorage.getItem("vlxBalance")) || 0;
  let mining = false;

  const connectBtn = document.getElementById("connectBtn");
  const mineBtn = document.getElementById("mineBtn");
  const claimBtn = document.getElementById("claimBtn");
  const walletText = document.getElementById("walletText");
  const balanceText = document.getElementById("balanceText");
  const logo = document.getElementById("logo");

  function updateUI() {
    walletText.textContent = wallet
      ? `${wallet.slice(0, 6)}...${wallet.slice(-4)}`
      : "Not Connected";

    balanceText.textContent = `${minedVLX.toFixed(9)} VLX`;

    mineBtn.disabled = !wallet;
    claimBtn.disabled = !wallet || minedVLX < MIN_CLAIM;
  }

  async function connectWallet() {
    try {
      if (!window.solana) {
        alert("Open this inside Phantom browser");
        return;
      }

      const resp = await window.solana.connect();
      wallet = resp.publicKey.toString();

      localStorage.setItem("wallet", wallet);

      updateUI();
    } catch (err) {
      console.error(err);
      alert("Phantom connection failed");
    }
  }

  function startMining() {
    if (!wallet) {
      alert("Connect wallet first");
      return;
    }

    if (mining) return;

    mining = true;

    if (logo) logo.classList.add("mining-glow");

    setInterval(() => {
      minedVLX += MINE_RATE;
      localStorage.setItem("vlxBalance", minedVLX);
      updateUI();
    }, 30000);
  }

  async function claimVLX() {
    if (minedVLX < MIN_CLAIM) {
      alert(`Minimum claim is ${MIN_CLAIM} VLX`);
      return;
    }

    try {
      const res = await fetch(CLAIM_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer public"
        },
        body: JSON.stringify({
          wallet,
          amount: minedVLX
        })
      });

      if (!res.ok) throw new Error("Claim failed");

      minedVLX = 0;
      localStorage.setItem("vlxBalance", 0);

      alert("Claim successful");
      updateUI();

    } catch (err) {
      alert(err.message);
    }
  }

  connectBtn.addEventListener("click", connectWallet);
  mineBtn.addEventListener("click", startMining);
  claimBtn.addEventListener("click", claimVLX);

  updateUI();
});