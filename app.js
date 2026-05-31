let walletAddress = null;
let minedBalance = 0;
let claimedBalance = 0;
let miningInterval = null;
let mining = false;

const connectBtn = document.getElementById("connectBtn");
const mineBtn = document.getElementById("mineBtn");
const claimBtn = document.getElementById("claimBtn");

connectBtn.addEventListener("click", connectWallet);
mineBtn.addEventListener("click", toggleMining);
claimBtn.addEventListener("click", claimRewards);

async function connectWallet() {
  try {
    const resp = await window.solana.connect();
    walletAddress = resp.publicKey.toString();

    document.getElementById("wallet").textContent =
      walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4);

    document.getElementById("status").textContent =
      "Wallet Connected";
  } catch (err) {
    alert("Wallet connection canceled");
  }
}

function toggleMining() {
  if (!walletAddress) {
    alert("Connect wallet first");
    return;
  }

  if (!mining) {
    mining = true;
    mineBtn.textContent = "Stop Mining";

    miningInterval = setInterval(() => {
      minedBalance += 0.001;
      updateDisplay();
    }, 1000);

    document.getElementById("status").textContent =
      "Mining Active";
  } else {
    clearInterval(miningInterval);
    mining = false;
    mineBtn.textContent = "Start Mining";

    document.getElementById("status").textContent =
      "Mining Stopped";
  }
}

async function claimRewards() {
  if (minedBalance <= 0) {
    alert("No VLX to claim");
    return;
  }

  try {
    document.getElementById("status").textContent =
      "Processing Claim";

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

      alert("VLX Sent\nTX: " + result.signature);
    } else {
      alert("Claim canceled");
    }

  } catch (err) {
    alert("Claim failed");
    console.error(err);
  }
}

function updateDisplay() {
  document.getElementById("balance").textContent =
    minedBalance.toFixed(6) + " VLX";

  document.getElementById("claimed").textContent =
    claimedBalance.toFixed(6) + " VLX";
}