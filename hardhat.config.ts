import "@nomicfoundation/hardhat-toolbox";
import "@fhevm/hardhat-plugin";
import { HardhatUserConfig } from "hardhat/config";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  mocha: { timeout: 120000 },
};
export default config;
