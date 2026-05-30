let mining = false;
let earned = parseInt(localStorage.getItem("vlxEarned")) || 0;
let hashPower = 0;

const connectBtn = document.getElementById("connectWallet");
const mineBtn = document.getElementById("mineButton");
const walletDisplay = document.getElementById("walletAddress");

document.getElementById("earned").innerText = earned + " VLX";
document.getElementById("balance").innerText = earned + " VLX";

connectBtn.addEventListener("click", async () => {
    if ("solana" in window) {
        const provider = window.solana;

        if (provider.isPhantom) {
            try {
                const response = await provider.connect();

                const wallet = response.publicKey.toString();

                connectBtn.innerText = "CONNECTED";
                walletDisplay.innerText =
                    wallet.slice(0, 6) + "..." + wallet.slice(-4);

            } catch (err) {
                console.log(err);
            }
        }
    } else {
        window.open("https://phantom.app/", "_blank");
    }
});

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