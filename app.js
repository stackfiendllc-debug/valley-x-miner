const connectBtn = document.getElementById("connectBtn");
const mineBtn = document.getElementById("mineBtn");
const walletDisplay = document.getElementById("wallet");
const balanceDisplay = document.getElementById("balance");
const statusDisplay = document.getElementById("status");

let walletAddress = null;

// 🔵 Your VLX mint address
const VLX_MINT = "4G72cw8r5YgLjaH7xjzHK8JA8duwUqq2vj9u9bkjMGCg";


// -----------------------------
// PHANTOM CONNECT (MODERN FLOW)
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

    statusDisplay.textContent = "Connected";

    await loadBalance();

  } catch (err) {
    console.error("Connection error:", err);
    statusDisplay.textContent = "Connection Failed";
  }
});


// -----------------------------
// REAL VLX BALANCE FETCH
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
    console.error("Balance fetch error:", err);
    balanceDisplay.textContent = "0.000000000 VLX";
  }
}


// -----------------------------
// MINING BUTTON (PLACEHOLDER ONLY)
// -----------------------------
mineBtn.addEventListener("click", () => {
  alert("Mining will be upgraded to staking/rewards in next version.");
});