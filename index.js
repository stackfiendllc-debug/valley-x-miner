let provider = null;
let walletAddress = null;
let miningInterval = null;
let reward = 0;

async function connectWallet() {
  try {
    if (!window.solana || !window.solana.isPhantom) {
      alert("Install Phantom Wallet");
      return;
    }

    provider = window.solana;
    const response = await provider.connect();

    walletAddress = response.publicKey.toString();

    document.getElementById("wallet").innerText =
      walletAddress.slice(0, 6) +
      "..." +
      walletAddress.slice(-4);

  } catch (err) {
    alert("Wallet connection canceled");
    console.error(err);
  }
}

function startMining() {
  if (!walletAddress) {
    alert("Connect wallet first");
    return;
  }

  if (miningInterval) return;

  miningInterval = setInterval(() => {
    reward += 0.001;

    document.getElementById("rewardDisplay").innerText =
      reward.toFixed(6) + " VLX";
  }, 1000);
}

function stopMining() {
  clearInterval(miningInterval);
  miningInterval = null;
}

async function claimVLX() {
  if (reward <= 0) {
    alert("No VLX to claim");
    return;
  }

  try {
    const response = await fetch(
      "https://vjalivzqoiqnuadbkrce.supabase.co/functions/v1/claim-vlx",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          wallet: walletAddress,
          amount: reward
        })
      }
    );

    const data = await response.json();

    if (data.signature) {
      alert("Claim Successful\nTX: " + data.signature);

      reward = 0;

      document.getElementById("rewardDisplay").innerText =
        "0.000000 VLX";
    } else {
      alert("Claim canceled");
    }

  } catch (err) {
    alert("Claim failed");
    console.error(err);
  }
}