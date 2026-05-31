let walletAddress = null;
let mining = false;
let reward = 0;
let interval = null;

async function connectWallet() {
  try {
    const resp = await window.solana.connect();
    walletAddress = resp.publicKey.toString();

    document.getElementById("wallet").innerText =
      walletAddress.slice(0,6) + "..." + walletAddress.slice(-4);

    document.getElementById("status").innerText =
      "Connected";

  } catch {
    document.getElementById("status").innerText =
      "Connection Failed";
  }
}

function startMining() {
  if (!walletAddress) {
    alert("Connect wallet first");
    return;
  }

  if (mining) return;

  mining = true;

  interval = setInterval(() => {
    reward += 0.000000050;

    document.getElementById("rewardDisplay").innerText =
      reward.toFixed(9) + " VLX";

  }, 1000);

  document.getElementById("status").innerText =
    "Mining Active";
}

function stopMining() {
  clearInterval(interval);
  mining = false;

  document.getElementById("status").innerText =
    "Mining Stopped";
}

async function claimVLX() {
  try {
    document.getElementById("status").innerText =
      "Processing Claim...";

    const res = await fetch(
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

    const data = await res.json();

    alert("Claim Success");

    reward = 0;

    document.getElementById("rewardDisplay").innerText =
      "0.000000000 VLX";

    document.getElementById("status").innerText =
      data.signature || "Claim Complete";

  } catch (err) {
    document.getElementById("status").innerText =
      "Claim Failed";
  }
}