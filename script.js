const SUPABASE_URL = "https://vjalivzqoiqnuadbkrce.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqYWxpdnpxb2lxbnVhZGJrcmNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxMTI5NDMsImV4cCI6MjA5NTY4ODk0M30.nIh-u0GHpQkBPQWLN7UKETagAJOoaIbVml3TCtEJpoE";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const walletBtn = document.getElementById("walletBtn");
const mineBtn = document.getElementById("mineBtn");
const balanceEl = document.getElementById("balance");
const statusEl = document.getElementById("status");
const walletStatus = document.getElementById("walletStatus");
const walletDisplay = document.getElementById("walletDisplay");
const pulse = document.getElementById("miningPulse");

let walletConnected = false;
let balance = 0;
let walletAddress = "";

async function connectWallet() {
    if (window.solana?.isPhantom) {
        try {
            const resp = await window.solana.connect();

            walletAddress