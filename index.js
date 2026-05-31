let wallet = null;
let mining = false;
let miningInterval;

const CLAIM_MINIMUM = 1;
const REWARD_RATE = 0.00012;

let reward = parseFloat(localStorage.getItem("vlxReward")) || 0;

const rewardDisplay = document.getElementById("rewardDisplay");
const walletAddress = document.getElementById("walletAddress");
const hashRate = document.getElementById("hashRate");
const status = document.getElementById("status");
const logo = document.getElementById("logo");

rewardDisplay.innerText = reward.toFixed(6);

async function connectWallet() {
    if (!window.solana?.isPhantom) {
        alert("Install Phantom Wallet");
        return;
    }

    const res = await window.solana.connect();
    wallet = res.publicKey.toString();

    localStorage.setItem("vlxWallet", wallet);

    walletAddress.innerText =
        wallet.slice(0,6) + "..." + wallet.slice(-4);

    document.getElementById("connectBtn").innerText = "Connected";
}

function saveReward() {
    localStorage.setItem("vlxReward", reward);
}

function startMining() {
    if (!wallet || mining) return;

    mining = true;
    status.innerText = "MINING";
    logo.classList.add("mining");

    miningInterval = setInterval(() => {
        reward += REWARD_RATE;

        const hash = Math.floor(Math.random() * 900 + 1100);

        rewardDisplay.innerText = reward.toFixed(6);
        hashRate.innerText = hash + " H/s";

        saveReward();
    }, 1000);
}

function stopMining() {
    mining = false;
    clearInterval(miningInterval);
    status.innerText = "STOPPED";
    logo.classList.remove("mining");
}

async function claimVLX() {
    if (reward < CLAIM_MINIMUM) {
        alert("Minimum 1 VLX required");
        return;
    }

    const response = await fetch(
        "https://vjalivzqoiqnuadbkrce.supabase.co/functions/v1/claim-vlx",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer eyJhbGciOi..."
            },
            body: JSON.stringify({
                wallet,
                amount: Number(reward.toFixed(6))
            })
        }
    );

    const data = await response.json();

    if (response.ok) {
        alert("VLX Sent");

        reward = 0;
        saveReward();
        rewardDisplay.innerText = "0.000000";
    } else {
        alert(data.error);
    }
}

window.onload = () => {
    const savedWallet = localStorage.getItem("vlxWallet");

    if (savedWallet) {
        wallet = savedWallet;
        walletAddress.innerText =
            wallet.slice(0,6) + "..." + wallet.slice(-4);
    }
};