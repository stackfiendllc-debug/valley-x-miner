let walletConnected = false;
let mining = false;
let balance = 0;
let miningInterval = null;

async function connectWallet() {
    if (window.solana && window.solana.isPhantom) {
        try {
            const response = await window.solana.connect();
            document.getElementById("wallet").innerText =
                response.publicKey.toString().slice(0,8) + "...";
            walletConnected = true;
        } catch (err) {
            alert("Wallet connection cancelled");
        }
    } else {
        alert("Install Phantom Wallet");
        window.open("https://phantom.app/", "_blank");
    }
}

function startMining() {
    if (!walletConnected) {
        alert("Connect wallet first");
        return;
    }

    if (mining) return;

    mining = true;

    miningInterval = setInterval(() => {
        balance += 0.000000050;
        document.getElementById("balance").innerText =
            balance.toFixed(9) + " VLX";
    }, 30000);
}