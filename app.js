const SUPABASE_URL = "https://vjalivzqoiqnuadbkrce.supabase.co";
const SUPABASE_KEY = "YOUR_SUPABASE_ANON_KEY";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let walletAddress = null;
let mining = false;
let miningInterval;
let balance = 0;

const connectBtn = document.getElementById("connectBtn");
const mineBtn = document.getElementById("mineBtn");
const walletDisplay = document.getElementById("wallet");
const balanceDisplay = document.getElementById("balance");
const statusDisplay = document.getElementById("status");


// CONNECT PHANTOM WALLET
async function connectWallet() {
  try {
    if ("solana" in window) {
      const provider = window.solana;

      if (provider.isPhantom) {
        const resp = await provider.connect();
        walletAddress = resp.publicKey.toString();

        walletDisplay.textContent =
          walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4);

        statusDisplay.textContent = "Wallet Connected";
      }
    } else {
      alert("Open this in Phantom Browser or Chrome with Phantom installed.");
    }
  } catch (err) {
    console.error(err);
    statusDisplay.textContent = "Connection Failed";
  }
}


// START / STOP MINING
function toggleMining() {
  if (!walletAddress) {
    alert("Connect wallet first");
    return;
  }

  if (!mining) {
    mining = true;
    mineBtn.textContent = "Stop Mining";
    statusDisplay.textContent = "Mining Active";

    miningInterval = setInterval(() => {
      balance += 0.000000050;
      balanceDisplay.textContent =