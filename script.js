let mining = false;
let earned = 0;
let hashPower = 0;

document.getElementById("connectWallet").addEventListener("click", () => {
  alert("Phantom Wallet Connected");
});

document.getElementById("mineButton").addEventListener("click", () => {
  mining = !mining;

  if (mining) {
    document.getElementById("mineButton").innerText = "MINING...";
    startMining();
  } else {
    document.getElementById("mineButton").innerText = "START MINING";
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

    document.getElementById("earned").innerText = earned + " VLX";
    document.getElementById("balance").innerText = earned + " VLX";
    document.getElementById("hashPower").innerText = hashPower + " H/s";
  }, 1000);
}