const connectBtn = document.getElementById("connectBtn");
const mineBtn = document.getElementById("mineBtn");
const walletDisplay = document.getElementById("wallet");
const balanceDisplay = document.getElementById("balance");
const statusDisplay = document.getElementById("status");

let walletAddress = null;

// VLX token mint (YOUR COIN)
const VLX_MINT = "4G72cw8r5YgLjaH7xjzHK8JA8duwUqq2vj9u9bkjMGCg";

// Mining state
let mining = false;
let miningInterval = null;
let pendingRewards = 0;


// -----------------------------
// CONNECT PHANTOM WALLET
// -----------------------------
connectBtn.addEventListener("click", async () => {
  const provider = window.solana;

  if (!provider?.isPhantom) {
    window.open("https://phantom.app/", "_blank");
    return;
  }

  try {
    const resp = await provider.connect();
    walletAddress = resp.publicKey.toString();

    walletDisplay.textContent =
      walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4);

    statusDisplay.textContent = "Wallet Connected";

    await loadBalance();

  } catch (err) {
    console.error(err);
    statusDisplay.textContent = "Connection Failed";
  }
});


// -----------------------------
// REAL VLX BALANCE FROM SOLANA
// -----------------------------
async function loadBalance() {
  if (!walletAddress) return;

  try {
    const response = await fetch("https://api.mainnet-beta.solana.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getTokenAccountsByOwner",
        params: [
          walletAddress,
          { mint: VLX_MINT },
          { encoding: "jsonParsed" }
        ]
      })
    });

    const data = await response.json();

    let balance = 0;

    const accounts = data?.result?.value || [];

    for (const acc of accounts) {
      const amount =
        acc?.account?.data?.parsed?.info?.tokenAmount?.uiAmount;

      if (amount) balance += amount;
    }

    balanceDisplay.textContent = balance.toFixed(9) + " VLX";

  } catch (err) {
    console.error("Balance error:", err);
    balanceDisplay.textContent = "0.000000000 VLX";
  }
}


// -----------------------------
// MINING (REWARD SIMULATION UI)
// -----------------------------
mineBtn.addEventListener("click", () => {
  if (!walletAddress) {
    alert("Connect wallet first");
    return;
  }

  // STOP MINING
  if (mining) {
    mining = false;
    clearInterval(miningInterval);

    mineBtn.textContent = "Start Mining";
    statusDisplay.textContent = "Mining Stopped";

    return;
  }

  // START MINING
  mining = true;
  mineBtn.textContent = "Stop Mining";
  statusDisplay.textContent = "Mining Active";

  miningInterval = setInterval(() => {
    pendingRewards += 0.000000050;

    balanceDisplay.textContent =
      pendingRewards.toFixed(9) + " VLX (Pending)";
  }, 30000);
});