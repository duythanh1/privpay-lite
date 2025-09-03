# PrivPay Lite — Confidential Payments with FHEVM

**PrivPay Lite** is a confidential payments demo built with **Zama FHEVM**.  
Balances and transfer amounts are encrypted end-to-end, never visible in plaintext.  
Transfers require both sender and receiver to pass **KYC validation**.

---

## ✨ Features
- 🔒 Encrypted balances (`euint64`)
- 🔒 Encrypted transfers with no plaintext leakage
- ✅ KYC gating (compliance ready)
- 🛡 Fail-closed logic (no underflow on insufficient balance)
- ⚡ EVM-compatible Solidity contracts

---

## 🚀 Quickstart
```bash
git clone https://github.com/<your-username>/privpay-lite
cd privpay-lite

pnpm install
pnpm hardhat test
