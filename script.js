const SUPABASE_URL = "https://vjalivzqoiqnuadbkrce.supabase.co";

const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqYWxpdnpxb2lxbnVhZGJrcmNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxMTI5NDMsImV4cCI6MjA5NTY4ODk0M30.nIh-u0GHpQkBPQWLN7UKETagAJOoaIbVml3TCtEJpoE";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

const walletBtn = document.getElementById("walletBtn");
const mineBtn = document.getElementById("mineBtn");
const balanceEl = document.getElementById("balance");
const statusEl = document.getElementById("status");
const walletStatus = document.getElementById("walletStatus");
const walletDisplay = document.getElementById("walletDisplay");
const pulse = document.getElementById("miningPulse");

let walletConnected = false;
let mining = false;
let balance = 0;
let walletAddress = "";
let miningInterval = null;

walletBtn.addEventListener("click", async () => {
  statusEl.textContent = "Connecting...";

  try {
    if (window.solana?.isPhantom) {
      const resp = await window.solana.connect();
      walletAddress = resp.publicKey.toString();
    } else {
      walletAddress = "TEST_" + Math.floor(Math.random() * 999999);
    }

    walletConnected = true;

    walletStatus.textContent = "Connected";

    walletDisplay.textContent =
      walletAddress.slice(0, 4) +
      "..." +
      walletAddress.slice(-4);

    statusEl.textContent = "Wallet Connected";

    await saveWallet();

  } catch (err) {
    console.error(err);
    statusEl.textContent = "Connection failed";
  }
});

mineBtn.addEventListener("click", async () => {
  if (!walletConnected) {
    statusEl.textContent = "Connect wallet first";
    return;
  }

  if (mining) return;

  mining = true;

  statusEl.textContent = "Mining Active";

  pulse.classList.add("active");

  miningInterval = setInterval(async () => {
    balance += 0.25;

    balanceEl.textContent =
      balance.toFixed(2) + " VLX";

    await updateBalance();

  }, 3000);
});

async function saveWallet() {
  try {
    await supabase.from("miners").upsert([
      {
        wallet: walletAddress,
        balance: balance
      }
    ]);
  } catch (err) {
    console.error("Save wallet error:", err);
  }
}

async function updateBalance() {
  try {
    await supabase
      .from("miners")
      .update({ balance })
      .eq("wallet", walletAddress);
  } catch (err) {
    console.error("Update balance error:", err);
  }
}