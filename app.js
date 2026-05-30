const connectBtn = document.getElementById("connectBtn");
const mineBtn = document.getElementById("mineBtn");
const walletEl = document.getElementById("wallet");
const balanceEl = document.getElementById("balance");
const claimedEl = document.getElementById("claimed");
const statusEl = document.getElementById("status");

let walletAddress = null;
let mining = false;
let rewards = 0.000000050;
let claimedBalance = 0;
let miningInterval = null;

const TREASURY_WALLET =
  "4G72cw8r5YgLjaH7xjzHK8JA8duwUqq2vj9u9bkjMGCg";

// CONNECT WALLET
connectBtn.addEventListener("click", async () => {
  if ("solana" in window) {
    const provider = window.solana;

    if (provider.isPhantom) {
      try {
        const resp = await provider.connect();
        walletAddress = resp.publicKey.toString();

        walletEl.textContent =
          walletAddress.slice(0, 6) + "..." +
          walletAddress.slice(-4);

        const saved = localStorage.getItem(walletAddress);

        if (saved) {
          claimedBalance = parseFloat(saved);
        }

        claimedEl.textContent =
          claimedBalance.toFixed(9) + " VLX";

        rewards = 0.000000050;

        balanceEl.textContent =
          rewards.toFixed(9) + " VLX";

        statusEl.textContent = "Wallet Connected";

      } catch (err) {
        statusEl.textContent = "Connection Cancelled";
      }
    }
  } else {
    window.open("https://phantom.app/", "_blank");
  }
});

// START / STOP MINING
mineBtn.addEventListener("click", () => {
  if (!walletAddress) {
    statusEl.textContent = "Connect Wallet First";
    return;
  }

  if (!mining) {
    mining = true;
    mineBtn.textContent = "Stop Mining";
    statusEl.textContent = "Mining Active";

    miningInterval = setInterval(() => {
      rewards += 0.000000050;

      balanceEl.textContent =
        rewards.toFixed(9) + " VLX";
    }, 1000);

  } else {
    mining = false;
    mineBtn.textContent = "Start Mining";
    statusEl.textContent = "Mining Stopped";

    clearInterval(miningInterval);
  }
});

// CLAIM REWARDS
async function claimRewards() {
  if (!walletAddress) {
    statusEl.textContent = "Connect Wallet First";
    return;
  }

  try {
    const provider = window.solana;

    const connection =
      new solanaWeb3.Connection(
        "https://api.mainnet-beta.solana.com",
        "confirmed"
      );

    const transaction =
      new solanaWeb3.Transaction();

    const memoInstruction =
      new solanaWeb3.TransactionInstruction({
        keys: [],
        programId: new solanaWeb3.PublicKey(
          "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
        ),
        data: new TextEncoder().encode(
          `VLX CLAIM | ${walletAddress} | ${rewards.toFixed(9)}`
        )
      });

    transaction.add(memoInstruction);

    transaction.feePayer = provider.publicKey;

    const { blockhash } =
      await connection.getLatestBlockhash();

    transaction.recentBlockhash = blockhash;

    const signed =
      await provider.signTransaction(transaction);

    const signature =
      await connection.sendRawTransaction(
        signed.serialize()
      );

    await connection.confirmTransaction(signature);

    claimedBalance += rewards;

    localStorage.setItem(
      walletAddress,
      claimedBalance
    );

    claimedEl.textContent =
      claimedBalance.toFixed(9) + " VLX";

    rewards = 0.000000050;

    balanceEl.textContent =
      rewards.toFixed(9) + " VLX";

    statusEl.textContent = "Rewards Claimed";

    window.open(
      `https://solscan.io/tx/${signature}`,
      "_blank"
    );

  } catch (err) {
    statusEl.textContent = "Claim Cancelled";
  }
}

window.claimRewards = claimRewards;