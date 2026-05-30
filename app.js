const connectBtn = document.getElementById("connectBtn");
const mineBtn = document.getElementById("mineBtn");
const walletDisplay = document.getElementById("wallet");
const balanceDisplay = document.getElementById("balance");
const statusDisplay = document.getElementById("status");

let walletAddress = null;

// Your VLX mint
const VLX_MINT = "4G72cw8r5YgLjaH7xjzHK8JA8duwUqq2vj9u9bkjMGCg";

// Mining state
let mining = false;
let reward = 0;

---

# 🟢 CONNECT WALLET (SAFE PHANTOM METHOD)

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
      walletAddress.slice(0,6) + "..." + walletAddress.slice(-4);

    statusDisplay.textContent = "Connected";

    loadBalance();

  } catch (e) {
    statusDisplay.textContent = "Connection Failed";
  }
});

---

# 💰 REAL BALANCE (RPC ONLY)

async function loadBalance() {
  if (!walletAddress) return;

  try {
    const res = await fetch("https://api.mainnet-beta.solana.com", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        jsonrpc:"2.0",
        id:1,
        method:"getTokenAccountsByOwner",
        params:[
          walletAddress,
          { mint: VLX_MINT },
          { encoding:"jsonParsed" }
        ]
      })
    });

    const data = await res.json();

    let bal = 0;

    (data.result?.value || []).forEach(acc => {
      const amt = acc.account.data.parsed.info.tokenAmount.uiAmount;
      if (amt) bal += amt;
    });

    balanceDisplay.textContent = bal.toFixed(9) + " VLX";

  } catch (e) {
    balanceDisplay.textContent = "0.000000000 VLX";
  }
}

---

# ⛏️ MINING (CLEAN REWARD SYSTEM)

mineBtn.addEventListener("click", () => {
  if (!walletAddress) {
    alert("Connect wallet first");
    return;
  }

  if (!mining) {
    mining = true;
    statusDisplay.textContent = "Mining Active";
    mineBtn.textContent = "Stop Mining";

    setInterval(() => {
      if (!mining) return;

      reward += 0.00000005;

      balanceDisplay.textContent =
        reward.toFixed(9) + " VLX (Pending)";
    }, 10000);

  } else {
    mining = false;
    statusDisplay.textContent = "Idle";
    mineBtn.textContent = "Start Mining";
  }
});