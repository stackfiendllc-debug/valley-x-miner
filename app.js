let walletAddress = null;
let minedBalance = 0;
let claimedBalance = 0;
let mining = false;
let miningInterval;

const connectBtn = document.getElementById("connectBtn");
const mineBtn = document.getElementById("mineBtn");

connectBtn.addEventListener("click", connectWallet);
mineBtn.addEventListener("click", toggleMining);

async function connectWallet() {
  try {
    const provider = window.solana;

    if (!provider || !provider.isPhantom) {
      alert("Install Phantom Wallet");
      return;
    }

    const response = await provider.connect();
    walletAddress = response.publicKey.toString();

    document.getElementById("wallet").textContent =
      walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4);

    document.getElementById("status").textContent =
      "Wallet Connected";

  } catch (err) {
    console.error(err);
    alert("Wallet connection canceled");
  }
}

function toggleMining() {
  if (!walletAddress) {
    alert("Connect wallet first");
    return;
  }

  if (!mining) {
    startMining();
  } else {
    stopMining();
  }
}

function startMining() {
  mining = true;
  mineBtn.textContent = "Stop Mining";

  document.getElementById("status").textContent =
    "Mining Active";

  miningInterval = setInterval(() => {
    minedBalance += 0.001;
    updateDisplay();
  }, 1000);
}

function stopMining() {
  mining = false;
  mineBtn.textContent = "Start Mining";

  clearInterval(miningInterval);

  document.getElementById("status").textContent =
    "Mining Stopped";
}

async function claimRewards() {
  if (!walletAddress) {
    alert("Connect wallet first");
    return;
  }

  if (minedBalance <= 0) {
    alert("No VLX to claim");
    return;
  }

  try {
    document.getElementById("status").textContent =
      "Processing Claim...";

    const response = await fetch(
      "https://vjalivzqoiqnuadbkrce.supabase.co/functions/v1/claim-vlx",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          wallet: walletAddress,
          amount: minedBalance
        })
      }
    );

    const result = await response.json();

    if (result.signature) {
      claimedBalance += minedBalance;
      minedBalance = 0;

      updateDisplay();

      document.getElementById("status").textContent =
        "Claim Successful";

      alert("VLX Sent!\nTX: " + result.signature);

    } else {
      throw new Error(result.error || "Claim canceled");
    }

  } catch (err) {
    console.error(err);

    document.getElementById("status").textContent =
      "Claim Failed";

    alert(err.message);
  }
}

function updateDisplay() {
  document.getElementById("balance").textContent =
    minedBalance.toFixed(6) + " VLX";

  document.getElementById("claimed").textContent =
    claimedBalance.toFixed(6) + " VLX";
}