const SUPABASE_URL = "https://vjalivzqoiqnuadbkrce.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqYWxpdnpxb2lxbnVhZGJrcmNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxMTI5NDMsImV4cCI6MjA5NTY4ODk0M30.nIh-u0GHpQkBPQWLN7UKETagAJOoaIbVml3TCtEJpoE";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let walletAddress = null;
let miningInterval = null;
const miningRate = 0.000000050;

const connectBtn = document.getElementById("connectBtn");
const mineBtn = document.getElementById("mineBtn");
const claimBtn = document.getElementById("claimBtn");
const walletEl = document.getElementById("wallet");
const balanceEl = document.getElementById("balance");
const statusEl = document.getElementById("status");

connectBtn.onclick = connectWallet;
mineBtn.onclick = toggleMining;
claimBtn.onclick = claimRewards;

let isMining = false;

async function connectWallet() {
  try {
    const provider = window.phantom?.solana;

    if (!provider?.isPhantom) {
      window.open("https://phantom.app/", "_blank");
      return;
    }

    const response = await provider.connect();
    walletAddress = response.publicKey.toString();

    walletEl.textContent =
      walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4);

    statusEl.textContent = "Connected";

    await createMiner();
    await refreshData();

  } catch (err) {
    console.error(err);
    statusEl.textContent = "Connection Failed";
  }
}

async function createMiner() {
  const { data } = await supabase
    .from("miners")
    .select("*")
    .eq("wallet", walletAddress)
    .single();

  if (!data) {
    await supabase.from("miners").insert([{
      wallet: walletAddress,
      rewards: 0,
      mining: false
    }]);
  }
}

async function refreshData() {
  const { data } = await supabase
    .from("miners")
    .select("*")
    .eq("wallet", walletAddress)
    .single();

  if (data) {
    balanceEl.textContent =
      Number(data.rewards).toFixed(9) + " VLX";

    isMining = data.mining;

    if (isMining) {
      mineBtn.textContent = "Stop Mining";
      statusEl.textContent = "Mining Live";
      beginMiningLoop();
    }
  }
}

function beginMiningLoop() {
  clearInterval(miningInterval);

  miningInterval = setInterval(async () => {
    const { data } = await supabase
      .from("miners")
      .select("rewards")
      .eq("wallet", walletAddress)
      .single();

    const updated = Number(data.rewards) + miningRate;

    await supabase
      .from("miners")
      .update({ rewards: updated })
      .eq("wallet", walletAddress);

    balanceEl.textContent =
      updated.toFixed(9) + " VLX";

  }, 30000);
}

async function toggleMining() {
  if (!walletAddress) {
    alert("Connect wallet first");
    return;
  }

  isMining = !isMining;

  await supabase
    .from("miners")
    .update({ mining: isMining })
    .eq("wallet", walletAddress);

  if (isMining) {
    mineBtn.textContent = "Stop Mining";
    statusEl.textContent = "Mining Live";
    beginMiningLoop();
  } else {
    clearInterval(miningInterval);
    mineBtn.textContent = "Start Mining";
    statusEl.textContent = "Stopped";
  }
}

async function claimRewards() {
  if (!walletAddress) return;

  await supabase
    .from("miners")
    .update({ rewards: 0 })
    .eq("wallet", walletAddress);

  balanceEl.textContent = "0.000000000 VLX";
  statusEl.textContent = "Rewards Claimed";
}