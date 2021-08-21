import React, { Component } from "react";
import getWeb3, { Web3 } from "../../utils/getWeb3";
import ipfs from '../ipfs/ipfsApi.js'
import { Grid } from '@material-ui/core';
import { Loader, Input, Heading, Table ,Field} from 'rimble-ui';
import { zeppelinSolidityHotLoaderOptions } from '../../webpack';
import styles from '../../App.module.scss';
import styled from "styled-components";


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
          valueNFTOwner: '',
          valuePhotoPrice: '',

          /////// Ipfs Upload
          buffer: null,
          ipfsHash: ''
        };

        /////// Handle
        this.handleNFTName = this.handleNFTName.bind(this);
        this.handleNFTSymbol = this.handleNFTSymbol.bind(this);
        this.handleNFTOwner = this.handleNFTOwner.bind(this);
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
    handleNFTOwner(event) {
      this.setState({ valueNFTOwner: event.target.value });
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
      const web3 = this.props.web3;
      const accounts=this.props.accounts;
      const balance=this.props.balance;
      const photoNFTMarketPlace=this.props.photoNFTMarketPlace;
      const photoNFTData=this.props.photoNFTData;
      const allPhotos=this.props.allPhotos;
      const photoNFTFactory=this.props.photoNFTFactory;
      const PHOTO_NFT_MARKETPLACE=this.props.PHOTO_NFT_MARKETPLACE;
        const {valueNFTName, valueNFTSymbol,valueNFTOwner, valuePhotoPrice } = this.state;
        console.log("web3 instande is:",web3);
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
          const nftOwner = valueNFTOwner;
          const nftName = valueNFTName;
          const nftSymbol = "NFT-MARKETPLACE";  /// [Note]: All NFT's symbol are common symbol
          //const nftSymbol = valueNFTSymbol;
          const _photoPrice = valuePhotoPrice;
          console.log('=== nftName ===', nftName);
          console.log('=== nftSymbol ===', nftSymbol);
          console.log('=== nftOwner ===', valueNFTOwner);
          console.log('=== _photoPrice ===', _photoPrice);
          this.setState({ 
            valueNFTName: '',
            valueNFTSymbol: '',
            valueNFTOwner: '',
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
            let owner=await photoNFT.methods.ownerOf(photoId).call();
            console.log("owner: ",owner)
            await photoNFT.methods.approve(await PHOTO_NFT_MARKETPLACE, photoId).send({ from: accounts[0] })
            /// Put on sale (by a seller who is also called as owner)
            console.log("owner of photo before is ",photoNFT.methods.ownerOf(photoId).call())
           await photoNFTMarketPlace.methods.openTradeWhenCreateNewPhotoNFT(await PHOTO_NFT, photoId, photoPrice).send({ from: accounts[0] })
           console.log("owner of photo after first transfer ",photoNFT.methods.ownerOf(photoId).call())
           await photoNFTMarketPlace.methods.givePhotoNFT(await PHOTO_NFT,nftOwner).send({ from: accounts[0] })
           console.log("owner of photo after is ",photoNFT.methods.ownerOf(photoId).call())

            //if(owner!==accounts[0]){
           //   console.log("creation problem")
           // }
            /// [Note]: Promise (nested-structure) is needed for executing those methods below (Or, rewrite by async/await)

            
            /// Put on sale (by a seller who is also called as owner)
            //console.log("on sale")
          })
        })
    }  


    componentDidMount = async () => {
        const hotLoaderDisabled = zeppelinSolidityHotLoaderOptions.disabled;
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
                                <Field >

                                <h4>Owner</h4>
                                    <Input
                                        type="text"
                                        width={1}
                                        placeholder="Write the address 0f the NFT owner"
                                        required={true}
                                        value={this.state.valueNFTOwner} 
                                        onChange={this.handleNFTOwner}                                        
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

                                <Button size={'medium'} width={1} onClick={this.onSubmit}  >CONVERT TO NFT</Button>
                      
                            </Form>
                        </Card>
                
                        </Grid>

            </div>
        );
    }
}
