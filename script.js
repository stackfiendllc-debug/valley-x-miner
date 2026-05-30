const SUPABASE_URL = "https://vjalivzqoiqnuadbkrce.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInZqYWxpdnpxb2lxbnVhZGJrcmNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxMTI5NDMsImV4cCI6MjA5NTY4ODk0M30.nIh-u0GHpQkBPQWLN7UKETagAJOoaIbVml3TCtEJpoE";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

let balance = 0;
let mining = false;
let walletConnected = false;
let walletAddress = "";

const balanceEl = document.getElementById("balance");
const mineBtn = document.getElementById("mineBtn");
const walletBtn = document.getElementById("walletBtn");
const statusEl = document.getElementById("status");
const pulseEl = document.getElementById("miningPulse");
const walletStatus = document.getElementById("walletStatus");
const walletDisplay = document.getElementById("walletDisplay");

function updateBalance() {
  balanceEl.textContent = walletConnected
    ? balance.toFixed(2) + " VLX"
    : "0.00 VLX";
}

async function loadMinerData() {
  const { data } = await supabase
    .from("miners")
    .select("*")
    .eq("wallet", walletAddress)
    .single();

  if (data) {
    balance = parseFloat(data.balance);
  } else {
    await supabase.from("miners").insert([
      { wallet: walletAddress, balance: 0 }
    ]);
    balance = 0;
  }

  updateBalance();
}

async function saveMinerData() {
  await supabase
    .from("miners")
    .update({
      balance,
      updated_at: new Date()
    })
    .eq("wallet", walletAddress);
}

function mine() {
  if (mining && walletConnected) {
    balance += 0.25;
    updateBalance();
    saveMinerData();
  }
}

mineBtn.addEventListener("click", () => {
  if (!walletConnected) {
    statusEl.textContent = "Connect wallet first";
    return;
  }

  mining = !mining;

  pulseEl.classList.toggle("mining-active");

  mineBtn.textContent = mining
    ? "Stop Mining"
    : "Start Mining";

  statusEl.textContent = mining
    ? "Mining Active"
    : "Mining Paused";
});

walletBtn.addEventListener("click", async () => {
  if (window.solana && window.solana.isPhantom) {
    try {
      const response = await window.solana.connect();

      walletAddress = response.publicKey.toString();
      walletConnected = true;

      walletStatus.textContent = "Connected";
      walletDisplay.textContent =
        walletAddress.slice(0, 6) +
        "..." +
        walletAddress.slice(-4);

      await loadMinerData();

      statusEl.textContent = "Wallet Connected";

    } catch {
      statusEl.textContent = "Connection failed";
    }
  } else {
    window.open(
      "https://phantom.app/ul/browse/https://stackfiendllc-debug.github.io/valley-x-miner/",
      "_blank"
    );
  }
});

updateBalance();
setInterval(mine, 3000);