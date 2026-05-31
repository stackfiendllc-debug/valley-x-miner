let wallet = null;
let mining = false;
let miningInterval = null;

const CLAIM_MINIMUM = 1;
const REWARD_RATE = 0.00012;

const SUPABASE_URL =
"https://vjalivzqoiqnuadbkrce.supabase.co";

const SUPABASE_ANON =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqYWxpdnpxb2lxbnVhZGJrcmNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxMTI5NDMsImV4cCI6MjA5NTY4ODk0M30.nIh-u0GHpQkBPQWLN7UKETagAJOoaIbVml3TCtEJpoE";

let reward = 0;

const rewardDisplay = document.getElementById("rewardDisplay");
const walletAddress = document.getElementById("walletAddress");
const hashRate = document.getElementById("hashRate");
const status = document.getElementById("status");
const logo = document.getElementById("logo");
const connectBtn = document.getElementById("connectBtn");

function getRewardKey() {
    return wallet ? `vlxReward_${wallet}` : null;
}

function loadReward() {
    const key = getRewardKey();
    reward = key
        ? parseFloat(localStorage.getItem(key)) || 0
        : 0;

    rewardDisplay.innerText = reward.toFixed(6);
}

function saveReward() {
    const key = getRewardKey();
    if (key) {
        localStorage.setItem(key, reward);
    }
}

async function connectWallet() {
    if (!window.solana) {
        alert("Open inside Phantom Browser");
        return;
    }

    try {
        const response = await window.solana.connect({
            onlyIfTrusted: false
        });

        wallet = response.publicKey.toString();

        localStorage.setItem("vlxWallet", wallet);

        walletAddress.innerText =
            wallet.slice(0, 6) + "..." + wallet.slice(-4);

        connectBtn.innerText = "Connected";
        status.innerText = "READY";

        loadReward();

    } catch (err) {
        console.error(err);
        alert("Wallet connection failed");
    }
}

function startMining() {
    if (!wallet) {
        alert("Connect wallet first");
        return;
    }

    if (mining) return;

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
    if (!mining) return;

    mining = false;

    clearInterval(miningInterval);
    miningInterval = null;

    status.innerText = "STOPPED";
    logo.classList.remove("mining");
}

async function claimVLX() {
    if (!wallet) {
        alert("Connect wallet first");
        return;
    }

    if (reward < CLAIM_MINIMUM) {
        alert("Minimum 1 VLX required");
        return;
    }

    status.innerText = "PROCESSING";

    try {
        const response = await fetch(
            `${SUPABASE_URL}/functions/v1/claim-vlx`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${SUPABASE_ANON}`
                },
                body: JSON.stringify({
                    wallet,
                    amount: Number(reward.toFixed(6))
                })
            }
        );

        const data = await response.json();

        if (response.ok) {
            reward = 0;
            saveReward();

            rewardDisplay.innerText = "0.000000";
            status.innerText = "READY";

            alert("VLX successfully claimed");

        } else {
            alert(data.error || "Claim failed");
            status.innerText = "ERROR";
        }

    } catch (err) {
        console.error(err);
        alert("Network error");
        status.innerText = "ERROR";
    }
}

window.onload = async () => {
    if (window.solana) {
        try {
            const response = await window.solana.connect({
                onlyIfTrusted: true
            });

            wallet = response.publicKey.toString();

            walletAddress.innerText =
                wallet.slice(0, 6) + "..." + wallet.slice(-4);

            connectBtn.innerText = "Connected";
            status.innerText = "READY";

            loadReward();

        } catch {
            status.innerText = "IDLE";
            rewardDisplay.innerText = "0.000000";
        }
    }
};