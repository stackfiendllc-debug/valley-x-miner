let walletAddress = null;
let minedVLX = parseFloat(localStorage.getItem("minedVLX")) || 0;
let mining = false;
let miningInterval;

updateMiningDisplay();

async function connectWallet() {
  if (window.solana && window.solana.isPhantom) {
    const response = await window.solana.connect();
    walletAddress = response.publicKey.toString();

    document.getElementById("wallet-status").innerText =
      walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4);
  } else {
    alert("Install Phantom Wallet");
  }
}

function startMining() {
  if (!walletAddress) {
    alert("Connect wallet first");
    return;
  }

  if (mining) return;

  mining = true;
  document.getElementById("logo").classList.add("mining");

  miningInterval = setInterval(() => {
    const hashRate = Math.floor(Math.random() * 150 + 50);
    const earned = hashRate / 100000;

    minedVLX += earned;

    document.getElementById("hashRate").innerText = hashRate;
    updateMiningDisplay();

    localStorage.setItem("minedVLX", minedVLX);
  }, 1000);
}

function stopMining() {
  mining = false;
  clearInterval(miningInterval);
  document.getElementById("logo").classList.remove("mining");
}

function updateMiningDisplay() {
  document.getElementById("vlxBalance").innerText =
    minedVLX.toFixed(4);
}

async function claimVLX() {
  if (!walletAddress) {
    alert("Connect wallet first");
    return;
  }

  if (minedVLX <= 0) {
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
          amount: minedVLX
        })
      }
    );

    const data = await response.json();

    if (data.success) {
      alert(`Claimed ${data.claimed} VLX`);
      minedVLX = 0;
      localStorage.setItem("minedVLX", 0);
      updateMiningDisplay();
    } else {
      alert(data.error);
    }

  } catch (err) {
    alert("Claim failed");
    console.error(err);
  }
}