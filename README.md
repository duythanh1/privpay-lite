# PrivPay Lite — Confidential Payments with FHEVM

## 📖 Overview
PrivPay Lite is a confidential payment system built with Zama’s Fully Homomorphic Encryption Virtual Machine (FHEVM).  
It allows stablecoin transfers where balances and transaction amounts remain encrypted end-to-end, while still enabling programmable compliance on-chain.  

## ✨ Key Features
- 🔒 Encrypted balances and transfer amounts, invisible to everyone except the owner.  
- ✅ Programmable compliance checks integrated into the token logic.  
- ⚡ Protection against front-running and MEV attacks.  
- 🔗 Seamless interoperability with existing DeFi protocols.  
- 🌍 Fully EVM-compatible and deployable on Ethereum or any L2.  

## 📂 Project Structure
privpay-lite/  
├── contracts/  
│   └── ConfidentialPayments.sol  
├── test/  
│   └── ConfidentialPayments.spec.ts  
├── hardhat.config.ts  
├── package.json  
├── .gitignore  
├── LICENSE  
└── README.md  

## 🚀 Getting Started
Run the project locally with these steps:

1. Install dependencies  
   npm install  

2. Compile the contracts  
   npx hardhat compile  

3. Run the tests  
   npx hardhat test  

## 🔮 Use Cases
- Private salary payments and corporate payroll.  
- Confidential peer-to-peer remittances.  
- DAO or foundation treasury transfers with privacy.  
- On-chain compliance-ready stablecoin payments.  

## 📝 License
This project is licensed under the MIT License.  
MIT © 2025 duythanh1
