let walletConnected = false;
let mining = false;
let balance = parseFloat(localStorage.getItem("vlxBalance")) || 0;
let walletAddress = "";

document.getElementById("balance").innerText =
balance.toFixed(9) + " VLX";

function getProvider() {
    if ("phantom" in window) {
        const provider = window.phantom?.solana;
        if (provider?.isPhantom) return provider;
    }
    return null;
}

async function connectWallet() {
    const provider = getProvider();

    if (!provider) {
        window.open("https://phantom.app/", "_blank");
        return;
    }

    const response = await provider.connect();

    walletAddress = response.publicKey.toString();

    document.getElementById("wallet").innerText =
        walletAddress.slice(0,8) + "...";

    walletConnected = true;
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

        localStorage.setItem("vlxBalance", balance);

        document.getElementById("balance").innerText =
            balance.toFixed(9) + " VLX";

    }, 30000);
}

function claimVLX() {
    if (!walletConnected) {
        alert("Connect wallet first");
        return;
    }

    if (balance <= 0) {
        alert("No VLX to claim");
        return;
    }

    window.submitClaim(walletAddress, balance);

    balance = 0;
    localStorage.setItem("vlxBalance", balance);

    document.getElementById("balance").innerText =
        "0.000000000 VLX";
}