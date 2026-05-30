let mining = false;
let earned = parseInt(localStorage.getItem("vlxEarned")) || 0;
let hashPower = 0;

const connectBtn = document.getElementById("connectWallet");
const mineBtn = document.getElementById("mineButton");
const walletDisplay = document.getElementById("walletAddress");

document.getElementById("earned").innerText = earned + " VLX";
document.getElementById("balance").innerText = earned + " VLX";

connectBtn.addEventListener("click", connectWallet);

async function connectWallet() {
    if (window.solana && window.solana.isPhantom) {
        try {
            const response = await window.solana.connect();

            const wallet = response.publicKey.toString();

            connectBtn.innerText = "CONNECTED";
            walletDisplay.innerText =
                wallet.slice(0, 6) + "..." + wallet.slice(-4);

        } catch (err) {
            walletDisplay.innerText = "Connection failed";
        }
    } else {
        window.location.href = "https://phantom.app/download";
    }
}

mineBtn.addEventListener("click", () => {
    mining = !mining;

    if (mining) {
        mineBtn.innerText = "MINING...";
        startMining();
    } else {
        mineBtn.innerText = "START MINING";
    }
});

function startMining() {
    const interval = setInterval(() => {
        if (!mining) {
            clearInterval(interval);
            return;
        }

        earned += 5;
        hashPower = Math.floor(Math.random() * 500 + 100);

        localStorage.setItem("vlxEarned", earned);

        document.getElementById("earned").innerText = earned + " VLX";
        document.getElementById("balance").innerText = earned + " VLX";
        document.getElementById("hashPower").innerText = hashPower + " H/s";

    }, 1000);
}