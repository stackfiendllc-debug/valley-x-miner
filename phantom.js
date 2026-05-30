import { BrowserSDK, AddressType } from "https://esm.sh/@phantom/browser-sdk";

const sdk = new BrowserSDK({
    providers: ["injected"],
    addressTypes: [AddressType.solana],
    autoConnect: true
});

window.connectPhantomWallet = async function () {
    try {
        const { addresses } = await sdk.connect({
            provider: "injected"
        });

        const wallet = addresses[0].address;

        document.getElementById("wallet").innerText =
            wallet.slice(0,8) + "...";

        window.walletConnected = true;
        window.walletAddress = wallet;

        localStorage.setItem("vlxWallet", wallet);

    } catch (err) {
        console.error(err);
        alert("Phantom connection failed");
    }
};