import React, { Component } from "react";
import getWeb3, { Web3 } from "../../utils/getWeb3";
import classNames from "classnames";
import { Loader, Card, Input, Table, Form, Field, Image ,Box} from 'rimble-ui';
import { zeppelinSolidityHotLoaderOptions } from '../../webpack';
import { contractAddresses } from '../../Addresses';
import styled from "styled-components";
import { Grid } from '@material-ui/core';
import GridContainer from "../Grid/GridContainer.js";
import GridItem from "../Grid/GridItem.js";
import { makeStyles } from "@material-ui/core/styles";
import cardsStyle from "../../assets/jss/material-kit-pro-react/views/presentationSections/cardsStyle.js";
import CardBody from "../Card/CardBody.js";
import CardHeader from "../Card/CardHeader.js";
import styles from "../../assets/jss/material-kit-pro-react/views/componentsSections/sectionCards.js";
import { whiteColor } from "../../assets/jss/material-kit-pro-react";
import Card1Component from "../Card/CardComponent.js";

const address= require('../../Addresses');
const theme = {
  orange: {
    default: "#FD6363",
    hover: "#FD5050"
  },
 
};

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

console.log(address[0].address)
const useStyles = makeStyles(styles);
export default class MyPhotos extends Component {
  
    constructor(props) {    
        super(props);

        this.state = {
          /////// Default state
          storageValue: 0,
          web3: null,
          accounts: null,
          currentAccount: null,
          route: window.location.pathname.replace("/", ""),
            
          /////// NFT
          allPhotos: []
        };

        //this.handlePhotoNFTAddress = this.handlePhotoNFTAddress.bind(this);

        this.putOnSale = this.putOnSale.bind(this);
        this.cancelOnSale = this.cancelOnSale.bind(this);
    }

    ///--------------------------
    /// Handler
    ///-------------------------- 
    // handlePhotoNFTAddress(event) {
    //     this.setState({ valuePhotoNFTAddress: event.target.value });
    // }


    ///---------------------------------------------------------
    /// Functions put a photo NFT on sale or cancel it on sale 
    ///---------------------------------------------------------
    putOnSale = async (e) => {
      const web3 = this.props.web3;
      const accounts=this.props.accounts;
      const balance=this.props.balance;
      const photoNFTMarketPlace=this.props.photoNFTMarketPlace;
      const photoNFTData=this.props.photoNFTData;
      const allPhotos=this.props.allPhotos;
      let PHOTO_NFT_MARKETPLACE= this.props.PHOTO_NFT_MARKETPLACE;
        console.log('=== value of putOnSale ===', e.target.value);
        console.log('=== PHOTO_NFT_MARKETPLACE ===', PHOTO_NFT_MARKETPLACE);

        const PHOTO_NFT = e.target.value;
        console.log("PHOTO_NFT address: ", PHOTO_NFT);
        /// Get instance by using created photoNFT address
        let PhotoNFT = {};
        PhotoNFT = require("../../contracts/PhotoNFT.json"); 
        let photoNFT = new web3.eth.Contract(PhotoNFT.abi,PHOTO_NFT);

        /// Check owner of photoId
        const photoId = 1;  /// [Note]: PhotoID is always 1. Because each photoNFT is unique.
        const owner = await photoNFT.methods.ownerOf(photoId).call();
        console.log('=== owner of photoId ===', owner);  /// [Expect]: Owner should be the PhotoNFTMarketplace.sol (This also called as a proxy/escrow contract)
            
        /// Put on sale (by a seller who is also called as owner)
        const txReceipt1 = await photoNFT.methods.approve(PHOTO_NFT_MARKETPLACE, photoId).send({ from: accounts[0] });
        const txReceipt2 = await photoNFTMarketPlace.methods.openTrade(PHOTO_NFT, photoId).send({ from: accounts[0] });
        console.log('=== response of openTrade ===', txReceipt2);
    }

    cancelOnSale = async (e) => {
      const web3 = this.props.web3;
      const accounts=this.props.accounts;
      const balance=this.props.balance;
      const photoNFTMarketPlace=this.props.photoNFTMarketPlace;
      const photoNFTData=this.props.photoNFTData;
      const allPhotos=this.props.allPhotos;


        console.log('=== value of cancelOnSale ===', e.target.value);

        const PHOTO_NFT = e.target.value;

        /// Get instance by using created photoNFT address
        let PhotoNFT = {};
        PhotoNFT = require("../../contracts/PhotoNFT.json"); 
        let photoNFT = new web3.eth.Contract(PhotoNFT.abi, PHOTO_NFT);

        /// Check owner of photoId
        const photoId = 1;  /// [Note]: PhotoID is always 1. Because each photoNFT is unique.
        const owner = await photoNFT.methods.ownerOf(photoId).call();
        console.log('=== owner of photoId ===', owner);  /// [Expect]: Owner should be the PhotoNFTMarketplace.sol (This also called as a proxy/escrow contract)
            
        /// Cancel on sale
        //const txReceipt1 = await photoNFT.methods.approve(PHOTO_NFT_MARKETPLACE, photoId).send({ from: accounts[0] });
        const txReceipt2 = await photoNFTMarketPlace.methods.cancelTrade(PHOTO_NFT, photoId).send({ from: accounts[0] });
        console.log('=== response of cancelTrade ===', txReceipt2);
    }



    componentDidMount = async () => {
        const hotLoaderDisabled = zeppelinSolidityHotLoaderOptions.disabled;
     
    };

    componentWillUnmount() {
        if (this.interval) {
          clearInterval(this.interval);
        }
    }

    refreshValues = (instancePhotoNFTMarketplace) => {
        if (instancePhotoNFTMarketplace) {
          console.log('refreshValues of instancePhotoNFTMarketplace');
        }
    }

    render() {

    
     
      const accounts=this.props.accounts;
      let web3 =null;
      let balance=null;
      let photoNFTMarketPlace=null;
      let photoNFTData=null;
      let currentAccount=null;
      let allPhotos=null;
      if(accounts){
        web3 = this.props.web3;
        balance=this.props.balance;
        photoNFTMarketPlace=this.props.PhotoNFTMarketplace;
        photoNFTData=this.props.PhotoNFTData;
        currentAccount=this.props.accounts[0];
        allPhotos=this.props.allPhotos;
        }
        return (
            <div >
              <h2>MY COLLECTION</h2>
         
              {allPhotos && (
              <GridContainer spacing={1}>

              { allPhotos.map((photo, key) => (
                <GridItem xs={3} spacing={4}>
                  

                    { currentAccount == photo.ownerAddress ? 
                            <Card 
                            width={"300px"} 
                            maxWidth={"300px"} 
                            maxHeight={"600px"} 
                            mx={"auto"} 
                            my={"auto"} 
                            p={20} 
                            borderColor={"#FD6363"}
                            backgroundColor={"#010100"}
                                  
                            >
                              <Image
                                alt="random unsplash image"
                                borderRadius={8}
                                maxheight="300"
                                maxWidth='200'
                                src={ `https://ipfs.io/ipfs/${photo.ipfsHashOfPhoto}` }
                              />

                              <p style={{fontSize:13,color:whiteColor }}>Photo Name: { photo.photoNFTName }  {
                                
                              }</p>
                              <p style={{fontSize:13 ,color:whiteColor}}>Price: { web3.utils.fromWei(`${photo.photoPrice}`, 'ether') } ETH</p>
                              <p style={{fontSize:13,color:whiteColor }}>Owner: { photo.ownerAddress }</p>
                              { photo.status == "Cancelled" ? 
                                  <Button size={'medium'} width={1} value={ photo.photoNFT } onClick={this.putOnSale}> Put on sale </Button>
                              :
                                  <Button size={'medium'} width={1} value={ photo.photoNFT } onClick={this.cancelOnSale}> Cancel on sale </Button>
                              }
                              <span style={{ padding: "0px" }}></span>
                            </Card>
                        :
                            ''
                        }

                        </GridItem>
                )
              ) }
              </GridContainer>
              )}
            </div>
        );
    }
}
