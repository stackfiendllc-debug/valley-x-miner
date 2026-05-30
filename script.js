let balance = 0;
let mining = false;
let walletConnected = false;
let walletAddress = "";

const balanceEl = document.getElementById("balance");
const mineBtn = document.getElementById("mineBtn");
const walletBtn = document.getElementById("walletBtn");
const statusEl = document.getElementById("status");
const pulseEl = document.getElementById("miningPulse");
const walletStatus = document.getElementById("walletStatus");
const walletDisplay = document.getElementById("walletDisplay");

function updateBalance() {
    balanceEl.textContent = walletConnected
        ? balance.toFixed(2) + " VLX"
        : "0.00 VLX";
}

function getWalletKey(address) {
    return "vlx_" + address;
}

function mine() {
    if (mining && walletConnected) {
        balance += 0.25;
        localStorage.setItem(getWalletKey(walletAddress), balance);
        updateBalance();
    }
}

mineBtn.addEventListener("click", () => {
    if (!walletConnected) {
        statusEl.textContent = "Connect wallet first";
        return;
    }

    mining = !mining;

    pulseEl.classList.toggle("mining-active");

    mineBtn.textContent = mining
        ? "Stop Mining"
        : "Start Mining";

    statusEl.textContent = mining
        ? "Mining Active"
        : "Mining Paused";
});

walletBtn.addEventListener("click", async () => {
    if (window.solana && window.solana.isPhantom) {
        try {
            const response = await window.solana.connect();

            walletAddress = response.publicKey.toString();
            walletConnected = true;

            balance = parseFloat(
                localStorage.getItem(getWalletKey(walletAddress))
            ) || 0;

            walletStatus.textContent = "Connected";
            walletDisplay.textContent =
                walletAddress.slice(0,6) + "..." +
                walletAddress.slice(-4);

            updateBalance();

        } catch {
            statusEl.textContent = "Connection failed";
        }
    } else {
        window.open(
            "https://phantom.app/ul/browse/https://stackfiendllc-debug.github.io/valley-x-miner/",
            "_blank"
        );
    }
});

updateBalance();
setInterval(mine, 3000);