// connect.js
import { Connection, clusterApiUrl } from "@solana/web3.js";

// const connection = new Connection("https://capable-tame-cherry.solana-devnet.quiknode.pro/e036d8f8015e88595ad65bb57d1ed058ee6b4899/", {
// const connection = new Connection("https://solana-devnet.g.alchemy.com/v2/IyQ88uzd45S79rwOCwTytngBczFusrrH", {
const connection = new Connection("http://localhost:8899", {
    commitment: "confirmed",
    confirmTransactionInitialTimeout: 2000, // 3초
});

export default connection;
