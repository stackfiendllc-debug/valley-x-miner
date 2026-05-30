import { BrowserSDK, AddressType } from "https://esm.sh/@phantom/browser-sdk";

const sdk = new BrowserSDK({
  providers: ["injected"],
  addressTypes: [AddressType.solana]
});

window.connectPhantomWallet = async function () {
  try {
    const result = await sdk.connect();

    const wallet = result.addresses[0].address;

    window.walletAddress = wallet;

    document.getElementById("wallet").innerText =
      "Wallet: " + wallet.slice(0,6) + "..." + wallet.slice(-4);

  } catch (err) {
    console.error(err);
    alert("Connection failed");
  }
};