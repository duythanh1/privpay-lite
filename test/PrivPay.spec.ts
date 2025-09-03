import { expect } from "chai";
import { ethers, fhevm } from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { FhevmType } from "@fhevm/hardhat-plugin";

describe("PrivPay Lite (FHEVM)", function () {
  let owner: HardhatEthersSigner;
  let alice: HardhatEthersSigner;
  let bob: HardhatEthersSigner;

  let kyc: any;
  let pay: any;
  let payAddr: string;

  before(async () => {
    [owner, alice, bob] = await ethers.getSigners();
  });

  async function deployAll() {
    const Kyc = await ethers.getContractFactory("KycRegistry");
    kyc = await Kyc.deploy();
    await kyc.waitForDeployment();

    await (await kyc.connect(owner).setKyc(owner.address, true)).wait();
    await (await kyc.connect(owner).setKyc(alice.address, true)).wait();
    await (await kyc.connect(owner).setKyc(bob.address, true)).wait();

    const Pay = await ethers.getContractFactory("PrivPay");
    pay = await Pay.deploy(await kyc.getAddress());
    await pay.waitForDeployment();
    payAddr = await pay.getAddress();
  }

  beforeEach(async () => {
    await deployAll();
  });

  it("owner mints encrypted 100 to Alice; Alice can decrypt", async () => {
    const enc100 = await fhevm
      .createEncryptedInput(payAddr, owner.address)
      .add64(100)
      .encrypt();

    await (await pay.connect(owner).mintEncrypted(alice.address, enc100.handles[0], enc100.inputProof)).wait();

    const encBalAlice = await pay.connect(alice).getMyBalance();
    const clearBalAlice = await fhevm.userDecryptEuint(
      FhevmType.euint64,
      encBalAlice,
      payAddr,
      alice
    );
    expect(clearBalAlice).to.eq(100);
  });

  it("Alice transfers 40 to Bob", async () => {
    const enc100 = await fhevm
      .createEncryptedInput(payAddr, owner.address)
      .add64(100)
      .encrypt();
    await (await pay.connect(owner).mintEncrypted(alice.address, enc100.handles[0], enc100.inputProof)).wait();

    const enc40 = await fhevm
      .createEncryptedInput(payAddr, alice.address)
      .add64(40)
      .encrypt();

    await (await pay.connect(alice).transferEncrypted(bob.address, enc40.handles[0], enc40.inputProof)).wait();

    const clearAlice = await fhevm.userDecryptEuint(
      FhevmType.euint64,
      await pay.connect(alice).getMyBalance(),
      payAddr,
      alice
    );
    const clearBob = await fhevm.userDecryptEuint(
      FhevmType.euint64,
      await pay.connect(bob).getMyBalance(),
      payAddr,
      bob
    );

    expect(clearAlice).to.eq(60);
    expect(clearBob).to.eq(40);
  });

  it("transfer fails if Bob is not KYCed", async () => {
    const enc50 = await fhevm
      .createEncryptedInput(payAddr, owner.address)
      .add64(50)
      .encrypt();
    await (await pay.connect(owner).mintEncrypted(alice.address, enc50.handles[0], enc50.inputProof)).wait();

    await (await kyc.connect(owner).setKyc(bob.address, false)).wait();

    const enc10 = await fhevm
      .createEncryptedInput(payAddr, alice.address)
      .add64(10)
      .encrypt();

    await expect(
      pay.connect(alice).transferEncrypted(bob.address, enc10.handles[0], enc10.inputProof)
    ).to.be.revertedWithCustomError(pay, "KycRequired");
  });
});
