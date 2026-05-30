const connectBtn = document.getElementById("connectBtn");
const mineBtn = document.getElementById("mineBtn");
const walletDisplay = document.getElementById("wallet");
const balanceDisplay = document.getElementById("balance");
const statusDisplay = document.getElementById("status");

// SUPABASE
const SUPABASE_URL = "PASTE_YOUR_SUPABASE_URL";
const SUPABASE_KEY = "PASTE_YOUR_SUPABASE_ANON_KEY";

let walletAddress = null;
let miningInterval = null;
let mining = false;

// ---------------------
// SUPABASE REQUEST
// ---------------------
async function db(endpoint, method, body = null) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, {
    method,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation"
    },
    body: body ? JSON.stringify(body) : null
  });

  return res.json();
}

// ---------------------
// CONNECT WALLET
// ---------------------
connectBtn.addEventListener("click", async () => {
  try {
    const provider = window.phantom?.solana || window.solana;

    if (!provider) {
      alert("Install Phantom Wallet");
      return;
    }

    const resp = await provider.connect();
    walletAddress = resp.publicKey.toString();

    walletDisplay.textContent =
      walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4);

    statusDisplay.textContent = "Connected ✔";

    await registerMiner();
    await loadMiner();

  } catch (err) {
    console.error(err);
    statusDisplay.textContent = "Connection Failed";
  }
});

// ---------------------
// REGISTER
// ---------------------
async function registerMiner() {
  try {
    await db("miners", "POST", [{
      wallet: walletAddress
    }]);
  } catch {}
}

// ---------------------
// LOAD MINER
// ---------------------
async function loadMiner() {
  const miner = await db(
    `miners?wallet=eq.${walletAddress}`,
    "GET"
  );

  if (miner.length) {
    balanceDisplay.textContent =
      Number(miner[0].rewards).toFixed(9) + " VLX";
  }
}

// ---------------------
// START / STOP MINING
// ---------------------
mineBtn.addEventListener("click", async () => {
  if (!walletAddress) {
    alert("Connect wallet first");
    return;
  }

  mining = !mining;

  if (mining) {
    mineBtn.textContent = "Stop Mining";
    statusDisplay.textContent = "Mining Live ⛏";

    miningInterval = setInterval(async () => {
      const miner = await db(
        `miners?wallet=eq.${walletAddress}`,
        "GET"
      );

      if (!miner.length) return;

      let rewards = Number(miner[0].rewards) + 0.00000005;
      let total = Number(miner[0].total_mined) + 0.00000005;

      await db(
        `miners?wallet=eq.${walletAddress}`,
        "PATCH",
        {
          rewards,
          total_mined: total,
          mining: true
        }
      );

      balanceDisplay.textContent =
        rewards.toFixed(9) + " VLX";

    }, 10000);

  } else {
    clearInterval(miningInterval);

    await db(
      `miners?wallet=eq.${walletAddress}`,
      "PATCH",
      { mining: false }
    );

    mineBtn.textContent = "Start Mining";
    statusDisplay.textContent = "Idle";
  }
});

// ---------------------
// CLAIM REWARDS
// ---------------------
async function claimRewards() {
  const miner = await db(
    `miners?wallet=eq.${walletAddress}`,
    "GET"
  );

  if (!miner.length) return;

  const amount = Number(miner[0].rewards);

  if (amount <= 0) {
    alert("No rewards to claim");
    return;
  }

  await db("claims", "POST", [{
    wallet: walletAddress,
    amount
  }]);

  await db(
    `miners?wallet=eq.${walletAddress}`,
    "PATCH",
    {
      rewards: 0,
      last_claim: new Date().toISOString()
    }
  );

  balanceDisplay.textContent = "0.000000000 VLX";

  alert(`Claimed ${amount.toFixed(9)} VLX`);
}

window.claimRewards = claimRewards;