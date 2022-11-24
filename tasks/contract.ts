/**
 *  Follow the instructions in README before uncommenting the code below
 **/

/*

import { task } from "hardhat/config";

import {
    TheSample,
    TheSample__factory,
} from "../typechain-types";

task("deploy:Contract").setAction(async function (_, { ethers, run }) {
    // Token base URI
    const baseUri = '/';
    // Token name
    const _name = 'TheSample';
    // Token symbol
    const _symbol = 'TheSample';

    const tokenFactory: TheSample__factory = await ethers.getContractFactory("TheSample");

    const signerAddress = await tokenFactory.signer.getAddress();

    console.log("Start deploying");

    const token: TheSample = <TheSample>await tokenFactory.deploy(baseUri, _name, _symbol);
    await token.deployed();

    console.log("Contract deployed to address:", token.address);
});


task("start:sale")
    .addParam('contract', 'Contract address')
    .setAction(async function (args, { ethers, run }) {
        if (args.contract && ethers.utils.isAddress(args.contract)) {
            const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, ethers.provider);
            const contract = TheSample__factory.connect(
                args.contract,
                signer
            );
            await contract.startPublicSale()

            console.log('Sale started')
        } else {
            throw new Error('Contract address is incorrect')
        }
    });

task("setBaseUri")
    .addParam('contract', 'Contract address')
    .addParam('uri', 'Base URI')
    .setAction(async function (args, { ethers, run }) {
        if (args.contract && ethers.utils.isAddress(args.contract) && args.uri) {
            const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, ethers.provider);
            const contract = TheSample__factory.connect(
                args.contract,
                signer
            );
            await contract.setBaseURI(args.uri)

            console.log(`Base uri changed to ${args.uri}`)
        } else {
            throw new Error('Contract address is incorrect')
        }
    });

task("stop:sale")
    .addParam('contract', 'Contract address')
    .setAction(async function (args, { ethers, run }) {
        if (args.contract && ethers.utils.isAddress(args.contract)) {
            const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, ethers.provider);
            const contract = TheSample__factory.connect(
                args.contract,
                signer
            );
            await contract.pausePublicSale()

            console.log('Sale stopped')
        } else {
            throw new Error('Contract address is incorrect')
        }
    });

 */