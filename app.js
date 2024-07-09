const Web3 = require('web3');
const dotenv = require("dotenv");
const { ethers } = require('ethers');
dotenv.config();

const rpc = process.env.RPC;
const web3 = new Web3(rpc);
const time = process.env.SECOND ?? 60;
const privateKey = process.env.PRIVATEKEY;
const tokenAddress = process.env.TOKENADDRESS;
const provider = new ethers.providers.JsonRpcProvider(rpc);


const wallet = new ethers.Wallet(privateKey, provider);

const abi = [
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)",
    "function transfer(address to, uint amount) returns (bool)",
    "event Transfer(address indexed from, address indexed to, uint amount)"
];

let index = 0;
const contract = new ethers.Contract(tokenAddress, abi, wallet);

async function sendTokenTransaction() {
    try {
        const balance = await contract.balanceOf(wallet.address);
        console.log('Updated token balance:', balance.toString());

        let receiverAddress = web3.eth.accounts.create().address;
        let amount = ethers.utils.parseUnits((Math.random() * (1 - 0.01) + 0.01).toFixed(4), 18);
        const tx = await contract.transfer(receiverAddress, amount);
        console.log('Transaction hash:', index, tx.hash);
        await tx.wait();
    } catch (error) {
        console.error('Error:', error);
    }
    index++;
    setTimeout(sendTokenTransaction, 1000 * time);
}

sendTokenTransaction();