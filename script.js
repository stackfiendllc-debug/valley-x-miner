walletBtn.addEventListener("click", async () => {
    statusEl.textContent = "Connecting...";

    if (window.solana && window.solana.isPhantom) {
        try {
            const resp = await window.solana.connect();

            walletAddress = resp.publicKey.toString();
            walletConnected = true;

            walletStatus.textContent = "Connected";
            walletDisplay.textContent =
                walletAddress.slice(0, 4) + "..." + walletAddress.slice(-4);

            statusEl.textContent = "Wallet Connected";

            await saveWallet();

        } catch (err) {
            statusEl.textContent = "Connection cancelled";
        }

    } else {
        statusEl.textContent = "Use Phantom browser";

        window.open(
          "https://phantom.app/ul/browse/https://stackfiendllc-debug.github.io/valley-x-miner/",
          "_blank"
        );
    }
});