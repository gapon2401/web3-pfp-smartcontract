# TheSample smartcontract

Smartcontract (ERC-721) is created for the project [TheSample](https://github.com/gapon2401/web3-pfp-sample).

TheSample - is the sample project for web3 enthusiasts, community builders and developers. 
This project contains smartcontract (ERC-721) and a website with dashboard. 
It can be cloned and used for selling pfp-avatars or NFT collections.

## What's inside?

- Mint function with digital signature whitelist for sales
- Ability to start/stop the sale

## Before deployment

1. Clone the repo and run `yarn install`.
2. Specify variables in `.env` file.
- `PRIVATE_KEY` - the private key of the wallet, that will be the owner of the contract
- `GOERLI_URL` and `MAINNET_URL` - use [https://infura.io/](https://infura.io/) or [https://www.alchemy.com/](https://www.alchemy.com/) for getting the urls.
- `SIGNER_PRIVATE_KEY` - private key of the signer wallet. 
Do not send any funds to that wallet. It will be used only for making signatures.
Remember the public key, we will need it further in `signerAddress`.
- `ETHERSCAN_API_KEY` - etherscan key. Register on [https://etherscan.io](https://etherscan.io) and on the page [https://etherscan.io/myapikey](https://etherscan.io/myapikey) create and copy your key
- `REPORT_GAS` - are we going to use gas reporter or not.
3. Go to `contracts/TheSample`:
- Change contract name.
- Replace `signerAddress` with the public key of the wallet, that will make digital signatures. Remember about `SIGNER_PRIVATE_KEY`? Use it's public key here.
- Replace `PROVENANCE` constant.
- Make other changes you need.
4. Run `npx hardhat compile`.
5. Go to `tasks/contract.ts`:
- Replace  `TheSample` with your contract name.
- Uncomment the code.
- Specify token `baseUri`, `_name` and `_symbol`.
6. Go to `test/TheSample.ts`:
- Replace  `TheSample` with your contract name.
- Uncomment the code.

Do not upload `.env` file with sensitive data to your repo, add it to `.gitignore`.

## How to test?

Run `npx hardhat test`

There are 13 basic tests. Pay attention, that after you change the contract, some tests may fail

## How to deploy and verify the contract?

- Deployment to Goerli network
```
npx hardhat deploy:Contract --network goerli
``` 
- Deployment to Mainnet
```
npx hardhat deploy:Contract --network mainnet
``` 

After the deployment you will see the contract address:

![Deployment of smartcontract](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ww4jfp9u4ie1pwumezx5.jpg)

Wait about 5 - 15 minutes and try to verify it. If you get an error while verifying, don't worry, just try to wait more time.

In general verify function looks like this:

```
npx hardhat verify --network <YOUR_NETWORK> <DEPLOYED_CONTRACT_ADDRESS> <arg1> <arg2> <argn>
```

`<YOUR_NETWORK>` can be taken from `hardhat.config.ts`. Now it can be `goerli` or `mainnet`.

For Goerli network it can look like this:

```
npx hardhat verify --network goerli 0xc191B6505B16EBe5D776fb30EFbfe41A9252023a  "https://my-domain.com/collection/metadata/" "TheSample name" "TheSampleSymbol"
```

## Available tasks

- Deploy the contract

```
npx hardhat deploy:Contract --network <YOUR_NETWORK>
```

- Start the sale

```
npx hardhat start:sale --contract <DEPLOYED_CONTRACT_ADDRESS>
```

- Stop the sale

```
npx hardhat stop:sale --contract <DEPLOYED_CONTRACT_ADDRESS>
```

- Set base URI of the token

```
npx hardhat setBaseUri --contract <DEPLOYED_CONTRACT_ADDRESS> --uri <Base_URI>
```

## Useful links

- [Create, deploy and mint smart contract (ERC-721) with NodeJS + Hardhat + Walletconnect + Web3modal](https://dev.to/igaponov/create-deploy-and-mint-smart-contract-erc-721-with-nodejs-hardhat-walletconnect-web3modal-59o8)
- [How to Implement a Whitelist in Smart Contracts (ERC-721 NFT, ERC-1155, and others)](https://www.freecodecamp.org/news/how-to-implement-whitelist-in-smartcontracts-erc-721-nft-erc-1155-and-others/)