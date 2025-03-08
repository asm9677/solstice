// const bs58 = require("bs58").default; // Base58 디코딩
// const { PublicKey } = require("@solana/web3.js");
// const nacl = require("tweetnacl"); // Solana 서명 검증을 위한 라이브러리
import bs58 from "bs58"
import { PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl"; // Solana 서명 검증을 위한 라이브러리


/**
 * Solana 서명 검증
 * @param {string} address - 사용자의 Solana 지갑 주소
 * @param {string} signatureBs58 - Base58로 인코딩된 서명 값
 * @param {string} hash - 사용자가 서명한 해시값
 * @returns {boolean} - 서명이 유효하면 true, 아니면 false
 */
const verifySignature = (address, signatureBs58, hash) => {
    try {
        const publicKey = new PublicKey(address);

        // 1️⃣ 해시값을 Uint8Array로 변환 (Phantom 서명할 때 사용한 것과 동일)
        const encodedHash = new TextEncoder().encode(hash);

        // 2️⃣ Base58 서명을 다시 Uint8Array로 변환
        const decodedSignature = bs58.decode(signatureBs58);

        // 3️⃣ Solana 서명 검증 (`nacl.sign.detached.verify` 사용)
        const isValid = nacl.sign.detached.verify(encodedHash, decodedSignature, publicKey.toBytes());

        console.log("✅ 검증된 해시값:", hash);
        console.log("🔑 검증된 주소:", address);
        console.log("📌 검증된 서명(Base58):", signatureBs58);
        console.log("🔍 서명 검증 결과:", isValid);

        return isValid;
    } catch (error) {
        console.error("❌ 서명 검증 실패:", error.message);
        return false;
    }
};

export default verifySignature;
