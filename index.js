import {ethers} from "./ethers-5.6.esm.min.js";
import { abi, contractAddress } from "./constants.js";

const connectButton = document.getElementById("connect")
const fundButton = document.getElementById("fund")
const balanceBtn = document.getElementById("balance")
const withdrawBtn = document.getElementById("withdraw")


connectButton.onclick = connect
fundButton.onclick = fund
balanceBtn.onclick = getBalance
withdrawBtn.onclick = withdraw


async function connect() {
    if (typeof window.ethereum !== "undefined") {
        await window.ethereum.request({method: "eth_requestAccounts"})
         connectButton.innerHTML = "Connected"
    } else {
        connectButton.innerHTML = "Not Connected"
    }  
}

async function getBalance() {
    // const foo = async () => {
    // const getBalance = async () => {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
    }
}

async function fund() {
    const ethAmount = document.getElementById("ethAmount").value
    console.log(`Funding with ${ethAmount}`)
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        try {
                const contract = new ethers.Contract(contractAddress, abi, signer)
                const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
        })    
        await transactionMined(transactionResponse, provider)
        console.log("done")
        } catch (error) {
             console.log(error)
        }

    }

}
//listen for transaction to be mined


  const transactionMined = (transactionResponse, provider) => {
        console.log(`Minning ${transactionResponse.hash}.....`)
        
        return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReciept) => {
        console.log(`COMPLETED ${transactionReciept.confirmations}confirmations`)    
        })
        resolve()
        // create a listener for the transaction
        })
}

async function withdraw () { 
    if (typeof window.ethereum !== "undefined") {
        console.log("withdraw....")
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.withdraw()
            await transactionMined(transactionResponse, provider)
        } catch (error) {
            console.log(error)
        }
    }
}
