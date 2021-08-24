import React, { Component } from "react";
import getWeb3, { Web3 } from "./utils/getWeb3";
import Header from "./components/Header/index.js";
import Footer from "./components/Footer/index.js";
import Publish from "./components/Publish/index.js";
import MyPhotos from "./components/MyPhotos/index.js";
import PhotoMarketplace from "./components/PhotoMarketplace/index.js";
import ipfs from './components/ipfs/ipfsApi.js'
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router";
import { Loader, Button, Input, Heading, Table, Form, Flex, Box, Image } from 'rimble-ui';
import { zeppelinSolidityHotLoaderOptions } from './webpack';

import styles from './App.module.scss';
import './App.css';
import './App.module.scss';
const address= require('./Addresses');

class App extends Component {
  constructor(props) {    
    super(props);

    this.state = {
      /////// Default state
      storageValue: 0,
      web3: null,
      accounts: null,
      route: window.location.pathname.replace("/", ""),
      network:null,
    };

    this.on = this.on.bind(this);
    this.off = this.off.bind(this);
  }
 


  async on(event) {
    event.preventDefault();

    // Restore provider session
    //await this.state.web3Modal.clearCachedProvider();

    try {
      let web3=await getWeb3();
      let chainId=await web3.eth.getChainId()
      if(chainId==3){
        this.setState({
          network: "ropsten",
  
        })}else{
          this.setState({
            network: "please switch to ropsten",
          })
      
        };
    
      this.setState({
        web3: web3,

      });
      let PhotoNFTFactory = {};
      let PhotoNFTMarketplace = {};
      let PhotoNFTData = {};
      PhotoNFTFactory = require("./contracts/PhotoNFTFactory.json"); // Load ABI of contract of PhotoNFTFactory
      PhotoNFTMarketplace = require("./contracts/PhotoNFTMarketPlace.json");
      PhotoNFTData = require("./contracts/PhotoNFTData.json");
      console.log("page web3: ",this.props.web3)

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const networkType = await web3.eth.net.getNetworkType();
      const isMetaMask = web3.currentProvider.isMetaMask;
      let balance = accounts.length > 0 ? await web3.eth.getBalance(accounts[0]): web3.utils.toWei('0');
      balance = web3.utils.fromWei(balance, 'ether');

      let instancePhotoNFTFactory = null;
      let instancePhotoNFTMarketplace = null;
      let instancePhotoNFTData=null;
      let PHOTO_NFT_MARKETPLACE;

      // Create instance of contracts

          instancePhotoNFTFactory = new web3.eth.Contract(
            PhotoNFTFactory.abi,
            address[2].address,
          );
          console.log('=== instancePhotoNFTFactory ===', instancePhotoNFTFactory);
   


          instancePhotoNFTMarketplace = new web3.eth.Contract(
            PhotoNFTMarketplace.abi,
            address[1].address,
          );
          PHOTO_NFT_MARKETPLACE = address[1].address;
          console.log('=== instancePhotoNFTMarketplace ===', instancePhotoNFTMarketplace);
          console.log('=== PHOTO_NFT_MARKETPLACE ===', PHOTO_NFT_MARKETPLACE);
            
          instancePhotoNFTData = new web3.eth.Contract(
            PhotoNFTData.abi,
            address[0].address,
          );
          console.log('=== instancePhotoNFTData ===', instancePhotoNFTData);

          if(instancePhotoNFTData){
          const allPhotos = await instancePhotoNFTData.methods.getAllPhotos().call()
          console.log('=== allPhotos ===', allPhotos)
      
          this.setState({ allPhotos: allPhotos })
          
          }

          // Set web3, accounts, and contract to the state, and then proceed with an
          // example of interacting with the contract's methods.
          this.setState({ 
              web3, 
              accounts, 
              balance, 
              networkId, 
              networkType, 
              photoNFTFactory: instancePhotoNFTFactory,
              photoNFTMarketPlace: instancePhotoNFTMarketplace, 
              PHOTO_NFT_MARKETPLACE: PHOTO_NFT_MARKETPLACE, 
              photoNFTData:instancePhotoNFTData,
          });
          
    } catch (e) {
      return;
    }


  

  }

  async off(event) {
    event.preventDefault();
    this.setState({
      web3: null,
      network:null,
      allPhotos:null,
    });
    console.log("off");
  }
  componentDidMount = async () => {
    const hotLoaderDisabled = zeppelinSolidityHotLoaderOptions.disabled;
 
    
  };

  render() {
    const { web3, network,accounts,balance,photoNFTMarketPlace,photoNFTData,allPhotos,PHOTO_NFT_MARKETPLACE,photoNFTFactory} = this.state;
    console.log("photoNFTMarketPlace app",photoNFTMarketPlace)
    console.log("allPhotos in app.js is ",allPhotos);
    console.log("photoNFTData in app.js is ",photoNFTData);
    console.log("web3",(web3));
    return (
      <div className={styles.App}>
        <Header 
        on={this.on}
        off={this.off}
        web3={web3}
        network={network}
        />
          {this.state.route === 'publish' && 
           <div className={styles.wrapper}>
        <Publish
                  web3={web3}
                  accounts={accounts}
                  balance={balance}
                  photoNFTMarketPlace={photoNFTMarketPlace}
                  photoNFTData={photoNFTData}
                  allPhotos={allPhotos}
                  photoNFTFactory={photoNFTFactory}
                  PHOTO_NFT_MARKETPLACE={PHOTO_NFT_MARKETPLACE}
        />
      </div>}
          {this.state.route === 'my-photos' &&      
           <div className={styles.wrapper}>
        <MyPhotos 
                 web3={web3}
                 accounts={accounts}
                 balance={balance}
                 photoNFTMarketPlace={photoNFTMarketPlace}
                 photoNFTData={photoNFTData}
                 allPhotos={allPhotos}
                 PHOTO_NFT_MARKETPLACE={PHOTO_NFT_MARKETPLACE}
        />
        </div>}
          {this.state.route === 'photo-marketplace' &&  
           <div className={styles.wrapper}>
        <PhotoMarketplace
         web3={web3}
         accounts={accounts}
         balance={balance}
         PhotoNFTMarketplace={photoNFTMarketPlace}
         photoNFTData={photoNFTData}
         allPhotos={allPhotos}
         
         />
      </div>    }
        <Footer />
      </div>
    );
  }
}

export default App;
