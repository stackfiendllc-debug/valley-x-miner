let mining = false;
let rewards = 0;

async function connectWallet() {
  const response = await window.solana.connect();

  document.getElementById("wallet").innerText =
    response.publicKey.toString();
}

function startMining() {
  mining = true;

  const interval = setInterval(() => {
    if (!mining) {
      clearInterval(interval);
      return;
    }

    rewards += 0.001;

    document.getElementById(
      "rewardDisplay"
    ).innerText =
      rewards.toFixed(6) + " VLX";

  }, 1000);
}

function stopMining() {
  mining = false;
}

async function claimVLX() {
  try {
    const wallet =
      window.solana.publicKey.toString();

    const response = await fetch(
      "https://vjalivzqoiqnuadbkrce.supabase.co/functions/v1/claim-vlx",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          wallet,
          amount: rewards
        })
      }
    );

    const data = await response.json();

    if (data.success) {
      alert(
        "Claim successful\nTX: " +
        data.signature
      );

      rewards = 0;

      document.getElementById(
        "rewardDisplay"
      ).innerText =
        "0.000000 VLX";
    } else {
      alert(data.error);
    }

  } catch (err) {
    alert("Claim failed");
    console.error(err);
  }
}