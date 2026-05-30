import { BrowserSDK, AddressType } from "https://esm.sh/@phantom/browser-sdk";

const sdk = new BrowserSDK({
  providers: ["injected"],
  addressTypes: [AddressType.solana],
  autoConnect: true
});

window.connectPhantomWallet = async function () {
  try {
    const result = await sdk.connect();

    const wallet =
      result.addresses?.[0]?.address ||
      result.publicKey?.toString();

    if (!wallet) {
      throw new Error("Wallet not found");
    }

    const walletDisplay = document.getElementById("wallet");

    if (walletDisplay) {
      walletDisplay.innerText =
        "Wallet: " +
        wallet.slice(0, 6) +
        "..." +
        wallet.slice(-4);
    }

    localStorage.setItem("vlxWallet", wallet);
    window.walletConnected = true;
    window.walletAddress = wallet;

    console.log("Connected:", wallet);

  } catch (error) {
    console.error(error);
    alert("Phantom connection failed");
  }
};