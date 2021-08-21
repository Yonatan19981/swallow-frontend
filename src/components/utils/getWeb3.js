/* eslint-disable no-unused-vars */
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";

export async function getWeb3() {
  // eslint-disable-next-line no-async-promise-executor
  const provider = await detectEthereumProvider();
  // Wait for loading completion to avoid race conditions with web3 injection timing.
  if (provider) {
    // From now on, this should always be true:
    // provider === window.ethereum
    let web3 = new Web3(provider);
    return web3; // initialize your app
  } else {
    console.log("Please install MetaMask!");
  }
}

export default getWeb3;
