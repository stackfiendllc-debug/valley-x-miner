let walletConnected = false;
let mining = false;
let balance = 0;
let provider = null;

function getProvider() {
    if ("phantom" in window) {
        const anyWindow = window;
        if (anyWindow.phantom?.solana?.isPhantom) {
            return anyWindow.phantom.solana;
        }
    }

    if (window.solana?.isPhantom) {
        return window.solana;
    }

    return null;
}

async function connectWallet() {
    provider = getProvider();

    if (!provider) {
        alert("Phantom Wallet not detected. Install Phantom.");
        window.open("https://phantom.app/", "_blank");
        return;
    }

    try {
        const response = await provider.connect();

        document.getElementById("wallet").innerText =
            response.publicKey.toString().slice(0,8) + "...";

        walletConnected = true;
    } catch (err) {
        alert("Wallet connection cancelled");
    }
}

function startMining() {
    if (!walletConnected) {
        alert("Connect wallet first");
        return;
    }

    if (mining) return;

    mining = true;

    setInterval(() => {
        balance += 0.000000050;

        document.getElementById("balance").innerText =
            balance.toFixed(9) + " VLX";
    }, 30000);
}