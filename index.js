let wallet = null;
let mining = false;
let miningInterval;

let reward = parseFloat(localStorage.getItem("vlxReward")) || 0;

document.getElementById("rewardDisplay").innerText =
    reward.toFixed(6) + " VLX";

async function connectWallet() {
    if (window.solana?.isPhantom) {
        const response = await window.solana.connect();
        wallet = response.publicKey.toString();

        document.getElementById("walletAddress").innerText =
            wallet.slice(0, 6) + "..." + wallet.slice(-4);
    } else {
        alert("Install Phantom Wallet");
    }
}

function saveReward() {
    localStorage.setItem("vlxReward", reward);
}

function startMining() {
    if (mining) return;

    mining = true;
    document.getElementById("logo").classList.add("mining");

    miningInterval = setInterval(() => {
        reward += 0.00005;
        saveReward();

        const hash = Math.floor(Math.random() * 400 + 600);

        document.getElementById("rewardDisplay").innerText =
            reward.toFixed(6) + " VLX";

        document.getElementById("hashRate").innerText =
            hash + " H/s";
    }, 1000);
}

function stopMining() {
    mining = false;
    clearInterval(miningInterval);
    document.getElementById("logo").classList.remove("mining");
}

async function claimVLX() {
    if (!wallet) {
        alert("Connect wallet first");
        return;
    }

    try {
        const response = await fetch(
            "https://vjalivzqoiqnuadbkrce.supabase.co/functions/v1/claim-vlx",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    wallet,
                    amount: reward
                })
            }
        );

        const data = await response.json();

        if (response.ok) {
            alert("VLX Claimed Successfully");

            reward = 0;
            saveReward();

            document.getElementById("rewardDisplay").innerText =
                "0.000000 VLX";
        } else {
            alert(data.error || "Claim failed");
        }

    } catch (err) {
        console.error(err);
        alert("Failed to fetch claim function");
    }
}