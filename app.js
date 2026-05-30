const connectBtn = document.getElementById("connectBtn");
const mineBtn = document.getElementById("mineBtn");
const walletDisplay = document.getElementById("wallet");
const balanceDisplay = document.getElementById("balance");

let walletAddress = null;

const VLX_MINT = "4G72cw8r5YgLjaH7xjzHK8JA8duwUqq2vj9u9bkjMGCg";

// Connect Phantom
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

    await loadBalance();

  } catch (err) {
    console.error("Wallet connection failed:", err);
  }
});