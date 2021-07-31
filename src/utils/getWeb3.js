import Web3 from "web3";
import Web3Modal from "web3modal";

// require('dotenv').config();
// const INFURA_API_KEY = process.env.INFURA_API_KEY;

//const FALLBACK_WEB3_PROVIDER = process.env.REACT_APP_NETWORK || 'https://rinkeby.infura.io/v3/' + INFURA_API_KEY;    // Rinkeby
//const FALLBACK_WEB3_PROVIDER = process.env.REACT_APP_NETWORK || 'http://0.0.0.0:7545';                                 // Ganache-GUI
const FALLBACK_WEB3_PROVIDER = process.env.REACT_APP_NETWORK || 'http://0.0.0.0:8545';


const providerOptions = {
  /* See Provider Options Section */
};

const getWeb3 = () =>
  new Promise(async (resolve, reject) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
  
const web3Modal = new Web3Modal({
  network: "ropsten", // optional
  cacheProvider: true, // optional
  providerOptions // required
});

const provider = await web3Modal.connect();

const web3 = new Web3(provider);
resolve(web3)
  });

const getGanacheWeb3 = () => {
  const isProd = process.env.NODE_ENV === 'production';
  if (isProd) {
    return null;
  }
  const provider = new Web3.providers.HttpProvider(
    //'https://rinkeby.infura.io/v3/' + INFURA_API_KEY  // Rinkeby
    //'http://0.0.0.0:7545'  // Ganache-GUI
    'http://0.0.0.0:8545'  // Ganache-CLI
  );
  const web3 = new Web3(provider);
  console.log("No local ganache found.");
  return web3;
}

export default getWeb3;
export { getGanacheWeb3, Web3 };
