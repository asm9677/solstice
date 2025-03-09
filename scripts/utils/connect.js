// connect.js
import { Connection, clusterApiUrl } from "@solana/web3.js";

const connection = new Connection("http://localhost:8899", {
    commitment: "confirmed",
    confirmTransactionInitialTimeout: 2000, // 2초
});

export default connection;
