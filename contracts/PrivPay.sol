// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint64, externalEuint64 } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

interface IKycRegistry {
    function isKyc(address user) external view returns (bool);
}

/// @title PrivPay Lite - Confidential payments with KYC (FHEVM)
contract PrivPay is SepoliaConfig {
    IKycRegistry public kyc;
    address public owner;

    mapping(address => euint64) private _balances;

    event OracleUpdated(address indexed oracle);
    event EncryptedMint(address indexed to);
    event EncryptedTransfer(address indexed from, address indexed to);

    error NotOwner();
    error InvalidTo();
    error KycRequired();

    constructor(address kycRegistry) {
        owner = msg.sender;
        kyc = IKycRegistry(kycRegistry);
        emit OracleUpdated(kycRegistry);
    }

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    function setKycRegistry(address kycRegistry) external onlyOwner {
        kyc = IKycRegistry(kycRegistry);
        emit OracleUpdated(kycRegistry);
    }

    function getMyBalance() external view returns (euint64) {
        return _balances[msg.sender];
    }

    function mintEncrypted(
        address to,
        externalEuint64 encryptedAmount,
        bytes calldata inputProof
    ) external onlyOwner {
        if (to == address(0)) revert InvalidTo();
        if (!kyc.isKyc(to)) revert KycRequired();

        euint64 amt = FHE.fromExternal(encryptedAmount, inputProof);
        _balances[to] = FHE.add(_balances[to], amt);

        FHE.allowThis(_balances[to]);
        FHE.allow(_balances[to], to);

        emit EncryptedMint(to);
    }

    function transferEncrypted(
        address to,
        externalEuint64 encryptedAmount,
        bytes calldata inputProof
    ) external {
        address from = msg.sender;
        if (to == address(0)) revert InvalidTo();
        if (!kyc.isKyc(from) || !kyc.isKyc(to)) revert KycRequired();

        euint64 amt = FHE.fromExternal(encryptedAmount, inputProof);
        euint64 transferValue = FHE.select(
            FHE.le(amt, _balances[from]),
            amt,
            FHE.asEuint64(0)
        );

        _balances[to]   = FHE.add(_balances[to], transferValue);
        _balances[from] = FHE.sub(_balances[from], transferValue);

        FHE.allowThis(_balances[to]);
        FHE.allowThis(_balances[from]);
        FHE.allow(_balances[to], to);
        FHE.allow(_balances[from], from);

        emit EncryptedTransfer(from, to);
    }
}
