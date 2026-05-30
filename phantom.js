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

    const walletEl = document.getElementById("wallet");
    if (walletEl) {
      walletEl.innerText =
        wallet.slice(0, 6) + "..." + wallet.slice(-4);
    }

    localStorage.setItem("vlxWallet", wallet);
    window.walletAddress = wallet;
    window.walletConnected = true;

    console.log("Connected:", wallet);

  } catch (err) {
    console.error("Phantom Error:", err);
    alert("Phantom connection failed");
  }
};