const SUPABASE_URL = "https://vjalivzqoiqnuadbkrce.supabase.co";
const CLAIM_URL = `${SUPABASE_URL}/functions/v1/claim-vlx`;

let wallet = localStorage.getItem("wallet") || null;
let minedVLX = parseFloat(localStorage.getItem("vlxBalance")) || 0;
let mining = false;
let miningInterval = null;

const connectBtn = document.getElementById("connectBtn");
const mineBtn = document.getElementById("mineBtn");
const claimBtn = document.getElementById("claimBtn");
const walletText = document.getElementById("walletText");
const balanceText = document.getElementById("balanceText");
const logo = document.getElementById("logo");

function updateUI() {
    walletText.textContent = wallet
        ? `${wallet.slice(0, 6)}...${wallet.slice(-4)}`
        : "Not Connected";

    balanceText.textContent = `${minedVLX.toFixed(9)} VLX`;

    mineBtn.disabled = !wallet;
    claimBtn.disabled = !wallet;
}

async function connectWallet() {
    if (!window.solana || !window.solana.isPhantom) {
        alert("Open inside Phantom browser");
        return;
    }

    try {
        const response = await window.solana.connect();
        wallet = response.publicKey.toString();

        localStorage.setItem("wallet", wallet);

        updateUI();
    } catch (error) {
        console.error("Wallet connection failed:", error);
    }
}

function startMining() {
    if (!wallet) {
        alert("Connect wallet first");
        return;
    }

    if (mining) return;

    mining = true;

    if (logo) {
        logo.classList.add("mining-glow");
    }

    miningInterval = setInterval(() => {
        minedVLX += 0.00000005;

        localStorage.setItem("vlxBalance", minedVLX);

        updateUI();
    }, 30000);
}

async function claimVLX() {
    if (!wallet) {
        alert("Connect wallet first");
        return;
    }

    try {
        const response = await fetch(CLAIM_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer public"
            },
            body: JSON.stringify({
                wallet: wallet,
                amount: minedVLX
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Claim failed");
        }

        alert("VLX Claimed Successfully");

        minedVLX = 0;
        localStorage.setItem("vlxBalance", 0);

        updateUI();

    } catch (error) {
        console.error(error);
        alert("Claim failed: " + error.message);
    }
}

connectBtn.addEventListener("click", connectWallet);
mineBtn.addEventListener("click", startMining);
claimBtn.addEventListener("click", claimVLX);

updateUI();