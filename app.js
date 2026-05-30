const SUPABASE_URL = "https://vjalivzqoiqnuadbkrce.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqYWxpdnpxb2lxbnVhZGJrcmNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxMTI5NDMsImV4cCI6MjA5NTY4ODk0M30.nIh-u0GHpQkBPQWLN7UKETagAJOoaIbVml3TCtEJpoE";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let walletAddress = null;
let miningInterval = null;
let rewards = 0;

const connectBtn = document.getElementById("connectBtn");
const mineBtn = document.getElementById("mineBtn");
const walletDisplay = document.getElementById("wallet");
const balanceDisplay = document.getElementById("balance");
const statusDisplay = document.getElementById("status");

connectBtn.onclick = async () => {
  if ("solana" in window) {
    const resp = await window.solana.connect();
    walletAddress = resp.publicKey.toString();

    walletDisplay.innerText =
      walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4);

    statusDisplay.innerText = "Wallet Connected";

    await loadMiner();
  } else {
    alert("Open inside Phantom Browser");
  }
};

async function loadMiner() {
  const { data } = await supabase
    .from("miners")
    .select("*")
    .eq("wallet", walletAddress)
    .single();

  if (data) {
    rewards = Number(data.rewards);
    updateBalance();
  } else {
    await supabase.from("miners").insert([
      {
        wallet: walletAddress,
        rewards: 0,
        mining: false
      }
    ]);
  }
}

mineBtn.onclick = async () => {
  if (!walletAddress) {
    alert("Connect wallet first");
    return;
  }

  statusDisplay.innerText = "Mining Live";

  if (miningInterval) clearInterval(miningInterval);

  miningInterval = setInterval(async () => {
    rewards += 0.05;
    updateBalance();

    await supabase
      .from("miners")
      .update({
        rewards: rewards,
        mining: true
      })
      .eq("wallet", walletAddress);

  }, 30000);
};

function updateBalance() {
  balanceDisplay.innerText = rewards.toFixed(6) + " VLX";
}

async function claimRewards() {
  if (rewards <= 0) {
    alert("No rewards yet");
    return;
  }

  alert(`Claimed ${rewards.toFixed(6)} VLX`);

  rewards = 0;
  updateBalance();

  await supabase
    .from("miners")
    .update({
      rewards: 0,
      mining: false
    })
    .eq("wallet", walletAddress);

  statusDisplay.innerText = "Claimed";
}