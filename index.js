let wallet = null;
let mining = false;
let reward = 0;
let miningInterval;

async function connectWallet() {
  if (window.solana && window.solana.isPhantom) {
    const response = await window.solana.connect();
    wallet = response.publicKey.toString();

    document.getElementById("walletAddress").innerText =
      wallet.slice(0, 6) + "..." + wallet.slice(-4);
  } else {
    alert("Install Phantom Wallet");
  }
}

function startMining() {
  if (mining) return;

  mining = true;

  miningInterval = setInterval(() => {
    reward += 0.00005;

    const hash = Math.floor(Math.random() * 400 + 600);

    document.getElementById("rewardDisplay").innerText =
      reward.toFixed(6) + " VLX";

    document.getElementById("hashRate").innerText =
      hash + " H/s";

  }, 1000);
}

function stopMining() {
  mining = false;
  clearInterval(miningInterval);
}

async function claimVLX() {
  if (!wallet) {
    alert("Connect wallet first");
    return;
  }

  alert("Claim processing...");

  try {
    const response = await fetch(
      "https://YOUR-SUPABASE-FUNCTION.supabase.co/functions/v1/claim",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          wallet,
          amount: reward
        })
      }
    );

    const data = await response.json();

    if (response.ok) {
      alert("VLX Claimed Successfully");
      reward = 0;
      document.getElementById("rewardDisplay").innerText =
        "0.000000 VLX";
    } else {
      alert(data.error || "Claim failed");
    }

  } catch (err) {
    alert("Failed to fetch");
  }
}