/**
 *  Follow the instructions in README before uncommenting the code below
 **/

/*
import hre from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import { TheSample } from "../typechain-types";
import { expect } from "chai";
import * as dotenv from "dotenv";

interface Signers {
    admin: SignerWithAddress;
    tokenReceiver: SignerWithAddress;
    delegatee: SignerWithAddress;
}

dotenv.config();

describe("Unit tests", function () {

    before(async function () {
        this.signers = {} as Signers;

        const signers: SignerWithAddress[] = await hre.ethers.getSigners();
        this.signers.admin = signers[0];
        this.signers.tokenReceiver = signers[1];
        this.signers.delegatee = signers[2];

        this.baseUri = 'https://test/';
    });

    beforeEach(async function () {

        const _name = 'TheSample';
        const _symbol = 'TheSample';

        const TheFactory = await hre.ethers.getContractFactory("TheSample");

        this.token = <TheSample>await TheFactory.deploy(this.baseUri, _name, _symbol);

        await this.token.deployed();

        this.signMessage = async (address: string) => {
            const signer = new hre.ethers.Wallet(process.env.SIGNER_PRIVATE_KEY!);
            // Compute hash of the address
            const addressHash = hre.ethers.utils.solidityKeccak256(["address"], [address.toLowerCase()])

            // Sign the hashed address
            const messageBytes = hre.ethers.utils.arrayify(addressHash);
            return await signer.signMessage(messageBytes);
        }
    });

    describe("NFT", function () {
        it("Start public sale", async function () {
            await this.token.startPublicSale();
            expect(await this.token.saleActive()).to.equal(true);
        });

        it("Start and pause public sale", async function () {
            await this.token.startPublicSale();
            await this.token.pausePublicSale();
            expect(await this.token.saleActive()).to.equal(false);
        });

        it("Should revert SALE_HAS_BEGUN", async function () {
            await this.token.startPublicSale();
            await expect(this.token.startPublicSale()).to.be.revertedWith(
                "SALE_HAS_BEGUN"
            );
        });

        it("Only admin can start/stop sales", async function () {
            await expect(this.token.connect(this.signers.tokenReceiver).startPublicSale()).to.be.revertedWith(
                "Ownable: caller is not the owner"
            );
            await expect(this.token.connect(this.signers.tokenReceiver).pausePublicSale()).to.be.revertedWith(
                "Ownable: caller is not the owner"
            );
        });

        it("Set signer address", async function () {
            expect(await this.token.setSignerAddress(this.signers.tokenReceiver.address)).to.not.throw;
        });

        it("Send eth to contract", async function () {
            await this.signers.tokenReceiver.sendTransaction({
                to: this.token.address,
                value: hre.ethers.utils.parseEther("1.5"),
            });
            await expect(Number(hre.ethers.utils.formatEther(await hre.ethers.provider.getBalance(this.token.address)))).to.equal(1.5);
        });

        it("Withdraw", async function () {
            const value = hre.ethers.utils.parseEther("1.5")
            await this.signers.tokenReceiver.sendTransaction({
                to: this.token.address,
                value,
            });

            await expect(this.token.withdraw()).to.changeEtherBalances(
                [this.signers.admin, this.token],
                [value, value.mul(-1)]
            );
        });

    });

    describe("Minting", function () {

        it("Mint 1 NFT", async function () {
            await this.token.startPublicSale()
            const quantity = 1
            const price = (0.1 * quantity).toFixed(2)
            const value = hre.ethers.utils.parseEther(price)
            const signature = await this.signMessage(this.signers.tokenReceiver.address)

            await expect(
                this.token.connect(this.signers.tokenReceiver).mint(signature, {
                        value
                    }
                )).to.changeEtherBalances(
                [this.token, this.signers.tokenReceiver],
                [value, value.mul(-1)]
            );
            await expect(await this.token.balanceOf(this.signers.tokenReceiver.address)).to.equal(quantity);
            await expect(await this.token.totalMintsPerAddress(this.signers.tokenReceiver.address)).to.equal(quantity);
        });

        it("Should revert MAX_MINTS_PER_WALLET_ERROR when user has already had tokens and trying to mint more", async function () {
            await this.token.startPublicSale()
            const quantity = 19
            const price = (0.1 * quantity).toFixed(2)
            const value = hre.ethers.utils.parseEther(price)
            const signature = await this.signMessage(this.signers.tokenReceiver.address)

            await this.token.connect(this.signers.tokenReceiver).mint(signature, {
                    value
                }
            )
            await expect(
                this.token.connect(this.signers.tokenReceiver).mint(signature, {
                        value
                    }
                )).to.be.revertedWith('MAX_MINTS_PER_WALLET_ERROR');
        });

        it("Should revert INVALID_PRICE", async function () {
            await this.token.startPublicSale()

            const quantity = 1
            const price = (0.05 * quantity).toFixed(2)
            const value = hre.ethers.utils.parseEther(price)

            const signature = await this.signMessage(this.signers.tokenReceiver.address)

            await expect(
                this.token.connect(this.signers.tokenReceiver).mint(signature, {
                        value
                    }
                )).to.be.revertedWith('INVALID_PRICE');
        });

        it("Should revert SIGNATURE_VALIDATION_FAILED", async function () {
            await this.token.startPublicSale()

            const quantity = 1
            const price = (0.1 * quantity).toFixed(2)
            const value = hre.ethers.utils.parseEther(price)
            const signature = await this.signMessage(this.signers.delegatee.address)

            await expect(
                this.token.connect(this.signers.tokenReceiver).mint(signature, {
                        value
                    }
                )).to.be.revertedWith('SIGNATURE_VALIDATION_FAILED');

        });

        it("Try replay attack with signature and get SIGNATURE_VALIDATION_FAILED", async function () {
            await this.token.startPublicSale()

            const quantity = 1
            const price = (0.1 * quantity).toFixed(2)
            const value = hre.ethers.utils.parseEther(price)
            const signature = await this.signMessage(this.signers.tokenReceiver.address)

            await this.token.connect(this.signers.tokenReceiver).mint(signature, {
                    value
                }
            )

            await expect(
                this.token.connect(this.signers.delegatee).mint(signature, {
                        value
                    }
                )).to.be.revertedWith('SIGNATURE_VALIDATION_FAILED');
        });

        it("Should return back overpaid eth to sender", async function () {
            await this.token.startPublicSale()

            const quantity = 1
            const overpriced = (0.8 * quantity).toFixed(2)
            const price = (0.1 * quantity).toFixed(2)
            const value = hre.ethers.utils.parseEther(price)
            const overpricedValue = hre.ethers.utils.parseEther(overpriced)
            const signature = await this.signMessage(this.signers.tokenReceiver.address)

            await expect(
                this.token.connect(this.signers.tokenReceiver).mint(signature, {
                        value: overpricedValue
                    }
                )).to.changeEtherBalances(
                [this.signers.tokenReceiver, this.token],
                [value.mul(-1), value]
            );
        });
    })

});

 */