import React, { Component } from "react";
import getWeb3, { getGanacheWeb3, Web3 } from "../../utils/getWeb3";
import ipfs from '../ipfs/ipfsApi.js'
import { Grid } from '@material-ui/core';
import { Loader, Input, Heading, Table ,Field} from 'rimble-ui';
import { zeppelinSolidityHotLoaderOptions } from '../../webpack';
import styles from '../../App.module.scss';
import styled from "styled-components";


const address= require('../../Addresses');
const theme = {
  orange: {
    default: "#FD6363",
    hover: "#FD5050"
  },
 
};
const Form = styled.h1`
  background-color:black;
  color: white;
  padding: 10px 15px;
  border-radius: 10px;
  outline: 1;
  text-transform: uppercase;
  margin: 10px 0px;
  cursor: pointer;
  box-shadow: 0px 2px 2px lightgray;
  transition: ease background-color 250ms;
  font-family:'MonoSpec-medium';
`;

const Card = styled.h1`

  font-family:'MonoSpec-medium';
`;

const Button = styled.button`
  background-color: ${(props) => theme[props.theme].default};
  color: white;
  padding: 5px 15px;
  border-radius: 5px;
  outline: 0;
  text-transform: uppercase;
  margin: 10px 0px;
  cursor: pointer;
  box-shadow: 0px 2px 2px lightgray;
  transition: ease background-color 250ms;
  font-family:'MonoSpec-medium';

  &:hover {
    background-color: ${(props) => theme[props.theme].hover};
  }
  &:disabled {
    cursor: default;
    opacity: 0.7;
  }
`;

Button.defaultProps = {
  theme: "orange"
};


export default class Publish extends Component {
    constructor(props) {    
        super(props);

        this.state = {
          /////// Default state
          storageValue: 0,
          web3: null,
          accounts: null,
          route: window.location.pathname.replace("/", ""),

          /////// NFT concern
          valueNFTName: '',
          valueNFTSymbol: '',
          valuePhotoPrice: '',

          /////// Ipfs Upload
          buffer: null,
          ipfsHash: ''
        };

        /////// Handle
        this.handleNFTName = this.handleNFTName.bind(this);
        this.handleNFTSymbol = this.handleNFTSymbol.bind(this);
        this.handlePhotoPrice = this.handlePhotoPrice.bind(this);

        /////// Ipfs Upload
        this.captureFile = this.captureFile.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }


    ///--------------------------
    /// Handler
    ///-------------------------- 
    handleNFTName(event) {
        this.setState({ valueNFTName: event.target.value });
    }

    handleNFTSymbol(event) {
        this.setState({ valueNFTSymbol: event.target.value });
    }

    handlePhotoPrice(event) {
        this.setState({ valuePhotoPrice: event.target.value });
    }

    ///--------------------------
    /// Functions of ipfsUpload 
    ///-------------------------- 
    captureFile(event) {
        event.preventDefault()
        const file = event.target.files[0]
        
        const reader = new window.FileReader()
        reader.readAsArrayBuffer(file)  // Read bufffered file

        // Callback
        reader.onloadend = () => {
          this.setState({ buffer: Buffer(reader.result) })
          console.log('=== buffer ===', this.state.buffer)
        }
    }
      
    onSubmit(event) {
        const { web3, accounts, photoNFTFactory, photoNFTMarketPlace, PHOTO_NFT_MARKETPLACE, valueNFTName, valueNFTSymbol, valuePhotoPrice } = this.state;

        event.preventDefault()

        ipfs.files.add(this.state.buffer, (error, result) => {
          // In case of fail to upload to IPFS
          if (error) {
            console.error(error)
            return
          }

          // In case of successful to upload to IPFS
          this.setState({ ipfsHash: result[0].hash });
          console.log('=== ipfsHash ===', this.state.ipfsHash);

          const nftName = valueNFTName;
          const nftSymbol = "NFT-MARKETPLACE";  /// [Note]: All NFT's symbol are common symbol
          //const nftSymbol = valueNFTSymbol;
          const _photoPrice = valuePhotoPrice;
          console.log('=== nftName ===', nftName);
          console.log('=== nftSymbol ===', nftSymbol);
          console.log('=== _photoPrice ===', _photoPrice);
          this.setState({ 
            valueNFTName: '',
            valueNFTSymbol: '',
            valuePhotoPrice: ''
          });

          //let PHOTO_NFT;  /// [Note]: This is a photoNFT address created
          const photoPrice = web3.utils.toWei(_photoPrice, 'ether');
          const ipfsHashOfPhoto = this.state.ipfsHash;
          console.log("address of maker: ",accounts[0])
          console.log("marketplace: ",PHOTO_NFT_MARKETPLACE);

          photoNFTFactory.methods.createNewPhotoNFT(nftName, nftSymbol, photoPrice, ipfsHashOfPhoto).send({ from: accounts[0] })
          .once('receipt', async (receipt) => {
            console.log('=== receipt ===', receipt);

            const PHOTO_NFT = receipt.events.PhotoNFTCreated.returnValues.photoNFT;
            console.log('=== PHOTO_NFT ===', PHOTO_NFT);

            /// Get instance by using created photoNFT address
            let PhotoNFT = {};
            PhotoNFT = require("../../contracts/PhotoNFT.json"); 
            let photoNFT = await new web3.eth.Contract(PhotoNFT.abi, PHOTO_NFT);
            console.log('=== photoNFT ===', photoNFT);
            /// Check owner of photoId==1
            const photoId = 1;  /// [Note]: PhotoID is always 1. Because each photoNFT is unique.
            await photoNFT.methods.ownerOf(photoId).call().then(owner => console.log('=== owner of photoId 1 ===', owner));
            console.log("account[0]: ",accounts[0]);
            let owner=await photoNFT.methods.ownerOf(photoId).call();
            console.log("owner: ",owner)
            await photoNFT.methods.approve(await PHOTO_NFT_MARKETPLACE, photoId).send({ from: accounts[0] })
            /// Put on sale (by a seller who is also called as owner)
            console.log("owner of photo before is ",photoNFT.methods.ownerOf(photoId).call())
            await photoNFTMarketPlace.methods.openTradeWhenCreateNewPhotoNFT(await PHOTO_NFT, photoId, photoPrice).send({ from: accounts[0] })
            console.log("owner of photo after is ",photoNFT.methods.ownerOf(photoId).call())
            if(owner!==accounts[0]){
              console.log("creation problem")
            }
            /// [Note]: Promise (nested-structure) is needed for executing those methods below (Or, rewrite by async/await)

            
            /// Put on sale (by a seller who is also called as owner)
            console.log("on sale")
          })
        })
    }  

     
    //////////////////////////////////// 
    /// Ganache
    ////////////////////////////////////
    getGanacheAddresses = async () => {
        if (!this.ganacheProvider) {
          this.ganacheProvider = getGanacheWeb3();
        }
        if (this.ganacheProvider) {
          return await this.ganacheProvider.eth.getAccounts();
        }
        return [];
    }

    componentDidMount = async () => {
        const hotLoaderDisabled = zeppelinSolidityHotLoaderOptions.disabled;
     
        let PhotoNFTFactory = {};
        let PhotoNFTMarketplace = {};
        try {
          PhotoNFTFactory = require("../../contracts/PhotoNFTFactory.json"); // Load ABI of contract of PhotoNFTFactory
          PhotoNFTMarketplace = require("../../contracts/PhotoNFTMarketplace.json");
        } catch (e) {
          console.log(e);
        }

        try {
        
            // Get network provider and web3 instance.
            const web3 = await getWeb3();
            let ganacheAccounts = [];

            try {
              ganacheAccounts = await this.getGanacheAddresses();
            } catch (e) {
              console.log('Ganache is not running');
            }

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
            let PHOTO_NFT_MARKETPLACE;
            let deployedNetwork = null;

            // Create instance of contracts
            if (PhotoNFTFactory.networks) {
              deployedNetwork = PhotoNFTFactory.networks[networkId.toString()];
              if (deployedNetwork) {
                instancePhotoNFTFactory = new web3.eth.Contract(
                  PhotoNFTFactory.abi,
                  address[2].address,
                );
                console.log('=== instancePhotoNFTFactory ===', instancePhotoNFTFactory);
              }
            }

            if (PhotoNFTMarketplace.networks) {
              deployedNetwork = PhotoNFTMarketplace.networks[networkId.toString()];
              if (deployedNetwork) {
                instancePhotoNFTMarketplace = new web3.eth.Contract(
                  PhotoNFTMarketplace.abi,
                  address[1].address,
                );
                PHOTO_NFT_MARKETPLACE = address[1].address;
                console.log('=== instancePhotoNFTMarketplace ===', instancePhotoNFTMarketplace);
                console.log('=== PHOTO_NFT_MARKETPLACE ===', PHOTO_NFT_MARKETPLACE);
              }
            }

            if (instancePhotoNFTFactory) {
                // Set web3, accounts, and contract to the state, and then proceed with an
                // example of interacting with the contract's methods.
                this.setState({ 
                    web3, 
                    ganacheAccounts, 
                    accounts, 
                    balance, 
                    networkId, 
                    networkType, 
                    hotLoaderDisabled,
                    isMetaMask, 
                    photoNFTFactory: instancePhotoNFTFactory,
                    photoNFTMarketPlace: instancePhotoNFTMarketplace, 
                    PHOTO_NFT_MARKETPLACE: PHOTO_NFT_MARKETPLACE }, () => {
                      this.refreshValues(instancePhotoNFTFactory);
                      setInterval(() => {
                        this.refreshValues(instancePhotoNFTFactory);
                    }, 5000);
                });
            }
            else {
              this.setState({ web3, ganacheAccounts, accounts, balance, networkId, networkType, hotLoaderDisabled, isMetaMask });
            }
          
        } catch (error) {
          // Catch any errors for any of the above operations.
          alert(
            `Failed to load web3, accounts, or contract. Check console for details.`,
          );
          console.error(error);
        }
    };

    componentWillUnmount() {
        if (this.interval) {
          clearInterval(this.interval);
        }
    }

    refreshValues = (instancePhotoNFTFactory) => {
        if (instancePhotoNFTFactory) {
          console.log('refreshValues of instancePhotoNFTFactory');
        }
    }

    render()  {
        return (
            <div className={styles.left}>
            <Grid container spacing={5}>

                      
                        <Card width={"420px"} 
                              maxWidth={"420px"} 
                              mx={"auto"} 
                              my={5} 
                              p={20} 
                              borderColor={"#000"}
                              
                        >
                            <h2>BEGIN YOUR SWALLOW JOURNEY HERE</h2>

                            <Form onSubmit={this.onSubmit}>
                                <Field>
                                <h4>ARTWORK NAME</h4>
                                    <Input
                                        type="text"
                                        width={1}
                                        placeholder="Please write the name of your artwork here"
                                        required={true}
                                        value={this.state.valueNFTName} 
                                        onChange={this.handleNFTName} 
                                    />
                                </Field> 

                                {/*
                                <Field label="Photo NFT Symbol">
                                    <Input
                                        type="text"
                                        width={1}
                                        placeholder="e.g) ARNT"
                                        required={true}
                                        value={this.state.valueNFTSymbol} 
                                        onChange={this.handleNFTSymbol}                                        
                                    />
                                </Field>
                                */}

                                <Field >
                                <h4>PRICE IN ETH</h4>
                                    <Input
                                        type="text"
                                        width={1}
                                        placeholder="e.g 10"
                                        required={true}
                                        value={this.state.valuePhotoPrice} 
                                        onChange={this.handlePhotoPrice}                                        
                                    />
                                </Field>

                                <Field>
                                <h4>UPLOAD FILE</h4>
                                    <input 
                                        type='file' 
                                        onChange={this.captureFile} 
                                        required={true}
                                    />
                                </Field>

                                <Button size={'medium'} width={1} type='submit'  >CONVERT TO NFT</Button>
                      
                            </Form>
                        </Card>
                
                        </Grid>

            </div>
        );
    }
}
