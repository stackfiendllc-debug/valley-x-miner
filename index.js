let wallet = null;
let mining = false;
let miningInterval;

let reward = parseFloat(localStorage.getItem("vlxReward")) || 0;

const rewardDisplay = document.getElementById("rewardDisplay");
const walletAddress = document.getElementById("walletAddress");
const hashRate = document.getElementById("hashRate");
const logo = document.getElementById("logo");

rewardDisplay.innerText = reward.toFixed(6) + " VLX";

async function connectWallet() {
    if (!window.solana?.isPhantom) {
        alert("Install Phantom Wallet");
        return;
    }

    try {
        const response = await window.solana.connect();
        wallet = response.publicKey.toString();

        localStorage.setItem("vlxWallet", wallet);

        walletAddress.innerText =
            wallet.slice(0, 6) + "..." + wallet.slice(-4);

        document.getElementById("connectBtn").innerText = "Connected";
    } catch (err) {
        console.error(err);
        alert("Wallet connection failed");
    }
}

function saveReward() {
    localStorage.setItem("vlxReward", reward);
}

function startMining() {
    if (!wallet) {
        alert("Connect wallet first");
        return;
    }

    if (mining) return;

    mining = true;
    logo.classList.add("mining");

    document.getElementById("status").innerText = "MINING ACTIVE";

    miningInterval = setInterval(() => {
        reward += 0.00005;
        saveReward();

        const hash = Math.floor(Math.random() * 400 + 600);

        rewardDisplay.innerText =
            reward.toFixed(6) + " VLX";

        hashRate.innerText =
            hash + " H/s";

    }, 1000);
}

function stopMining() {
    mining = false;
    clearInterval(miningInterval);

    logo.classList.remove("mining");

    document.getElementById("status").innerText = "MINING STOPPED";
}

async function claimVLX() {
    if (!wallet) {
        alert("Connect wallet first");
        return;
    }

    if (reward <= 0) {
        alert("No VLX available");
        return;
    }

    try {
        const response = await fetch(
            "https://vjalivzqoiqnuadbkrce.supabase.co/functions/v1/claim-vlx",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer YOUR_ANON_KEY"
                },
                body: JSON.stringify({
                    wallet,
                    amount: Number(reward.toFixed(6))
                })
            }
        );

        const data = await response.json();

        if (response.ok) {
            alert("VLX Claimed Successfully");

            reward = 0;
            saveReward();

            rewardDisplay.innerText = "0.000000 VLX";
        } else {
            alert(data.error || "Claim failed");
        }

    } catch (err) {
        console.error(err);
        alert("Claim function error");
    }
}

window.onload = () => {
    const savedWallet = localStorage.getItem("vlxWallet");

    if (savedWallet) {
        wallet = savedWallet;
        walletAddress.innerText =
            wallet.slice(0, 6) + "..." + wallet.slice(-4);

        document.getElementById("connectBtn").innerText = "Connected";
    }
};