const SUPABASE_URL = "https://vjalivzqoiqnuadbkrce.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqYWxpdnpxb2lxbnVhZGJrcmNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxMTI5NDMsImV4cCI6MjA5NTY4ODk0M30.nIh-u0GHpQkBPQWLN7UKETagAJOoaIbVml3TCtEJpoE";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let walletAddress = null;
let miningInterval = null;
let rewards = 0;
let isMining = false;

const connectBtn = document.getElementById("connectBtn");
const mineBtn = document.getElementById("mineBtn");
const walletDisplay = document.getElementById("wallet");
const balanceDisplay = document.getElementById("balance");
const statusDisplay = document.getElementById("status");

const MINING_RATE = 0.000000050;
const MINING_INTERVAL = 30000;

connectBtn.addEventListener("click", async () => {
  try {
    if (!window.solana) {
      alert("Phantom wallet not detected");
      return;
    }

    const response = await window.solana.connect();

    walletAddress = response.publicKey.toString();

    walletDisplay.innerText =
      walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4);

    statusDisplay.innerText = "Connected";

    await loadMiner();

  } catch (error) {
    alert("Connection failed");
    console.log(error);
  }
});

async function loadMiner() {
  const { data } = await supabase
    .from("miners")
    .select("*")
    .eq("wallet", walletAddress)
    .single();

  if (data) {
    rewards = Number(data.rewards || 0);
    isMining = data.mining || false;
    updateBalance();
  }
}

mineBtn.addEventListener("click", async () => {
  if (!walletAddress) {
    alert("Connect wallet first");
    return;
  }

  if (!isMining) {
    startMining();
  } else {
    stopMining();
  }
});

function startMining() {
  isMining = true;
  mineBtn.innerText = "Stop Mining";
  statusDisplay.innerText = "Mining Live";

  miningInterval = setInterval(async () => {
    rewards += MINING_RATE;
    updateBalance();

    await saveMiner();
  }, MINING_INTERVAL);
}

function stopMining() {
  clearInterval(miningInterval);

  isMining = false;
  mineBtn.innerText = "Start Mining";
  statusDisplay.innerText = "Stopped";

  saveMiner();
}

function updateBalance() {
  balanceDisplay.innerText = rewards.toFixed(9) + " VLX";
}

async function saveMiner() {
  await supabase
    .from("miners")
    .upsert({
      wallet: walletAddress,
      rewards: rewards,
      mining: isMining
    });
}

async function claimRewards() {
  rewards = 0;
  updateBalance();

  await saveMiner();

  statusDisplay.innerText = "Claimed";
}