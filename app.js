const connectBtn = document.getElementById("connectBtn");
const mineBtn = document.getElementById("mineBtn");
const claimBtn = document.getElementById("claimBtn");

let wallet = null;
let mining = false;
let mined = 0;

connectBtn.onclick = async () => {
  const resp = await window.solana.connect();
  wallet = resp.publicKey.toString();
  document.getElementById("wallet").textContent = wallet;
};

mineBtn.onclick = () => {
  if (!mining) {
    mining = true;
    setInterval(() => {
      mined += 0.001;
      document.getElementById("balance").textContent =
        mined.toFixed(6) + " VLX";
    }, 1000);
  }
};

claimBtn.onclick = async () => {
  try {
    const res = await fetch(
      "https://vjalivzqoiqnuadbkrce.supabase.co/functions/v1/claim-vlx",
      {
        method: "POST"
      }
    );

    const data = await res.json();

    alert("SUCCESS: " + data.signature);

  } catch (err) {
    alert("FAILED");
    console.error(err);
  }
};