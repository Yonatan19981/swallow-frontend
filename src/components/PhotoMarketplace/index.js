import React, { Component } from "react";
import getWeb3, { Web3 } from "../../utils/getWeb3";

import { Loader, Input, Table, Form, Field, Image ,Card} from 'rimble-ui';
import { zeppelinSolidityHotLoaderOptions } from '../../webpack';
import styled from "styled-components";
import { Grid } from '@material-ui/core';
import CardBody from "../Card/CardBody.js";
import CardHeader from "../Card/CardHeader.js";
import styles from '../../App.module.scss';
import { whiteColor } from "../../assets/jss/material-kit-pro-react";
import GridContainer from "../Grid/GridContainer.js";
import GridItem from "../Grid/GridItem.js";

const address= require('../../Addresses');

const Button = styled.button`
  background-color: "#FD6363";
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
    background-color: "#FD5050";
  }
  &:disabled {
    cursor: default;
    opacity: 0.7;
  }
`;



export default class PhotoMarketplace extends Component {
  
    constructor(props) {    
        super(props);

        this.state = {
          /////// Default state
          storageValue: 0,
         
          route: window.location.pathname.replace("/", ""),

        };

        //this.handlePhotoNFTAddress = this.handlePhotoNFTAddress.bind(this);

        this.buyPhotoNFT = this.buyPhotoNFT.bind(this);
    }

    ///--------------------------
    /// Handler
    ///-------------------------- 
    // handlePhotoNFTAddress(event) {
    //     this.setState({ valuePhotoNFTAddress: event.target.value });
    // }


    ///---------------------------------
    /// Functions of buying a photo NFT 
    ///---------------------------------
    buyPhotoNFT = async (e) => {
      const web3 = this.props.web3;
      const accounts=this.props.accounts;
      const balance=this.props.balance;
      const photoNFTMarketPlace=this.props.PhotoNFTMarketplace;
      const photoNFTData=this.props.photoNFTData;
      const allPhotos=this.props.allPhotos;

        console.log('=== value of buyPhotoNFT ===', e.target.value);

        const PHOTO_NFT = e.target.value;
        //const PHOTO_NFT = valuePhotoNFTAddress;
        //this.setState({ valuePhotoNFTAddress: "" });

        /// Get instance by using created photoNFT address
        let PhotoNFT = {};
        PhotoNFT = require("../../contracts/PhotoNFT.json"); 
        let photoNFT = new web3.eth.Contract(PhotoNFT.abi, PHOTO_NFT);
        console.log("====photo NFT address====",PHOTO_NFT)
       
        console.log("====photo id====",1)
        /// Check owner of photoId
        const photoId = 1;  /// [Note]: PhotoID is always 1. Because each photoNFT is unique.
         console.log("====photo NFT====",photoNFT)
        const owner = await photoNFT.methods.ownerOf(photoId).call();
        console.log('=== owner of photoId ===', owner);  /// [Expect]: Owner should be the PhotoNFTMarketplace.sol (This also called as a proxy/escrow contract)
        console.log('=== instancePhotoNFTData ===', photoNFTData);

        const photo = await photoNFTData.methods.getPhotoByNFTAddress(PHOTO_NFT).call();
        const buyAmount = await photo.photoPrice;
        const txReceipt1 = await photoNFTMarketPlace.methods.buyPhotoNFT(PHOTO_NFT).send({ from: accounts[0], value: buyAmount });
        console.log('=== response of buyPhotoNFT ===', txReceipt1);
    }


    ///--------------------------
    /// Functions of reputation 
    ///---------------s------------
   



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
        console.log("allPhotos is:",allPhotos);
        console.log("web3 instande is:",web3);
        return (
            <div className={styles.contracts}>
              <h2>ART</h2>
              {allPhotos && (
              <GridContainer spacing={4}>

              { allPhotos.map((photo, key) => (
              
              <GridItem xs={4}>
                   

                        { currentAccount != photo.ownerAddress && photo.status == "Open" ?
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
                                 height="200"
                                 maxWidth='200'
                                 src={ `https://ipfs.io/ipfs/${photo.ipfsHashOfPhoto}` }
                               />
 
                               <span style={{ padding: "20px",fontSize:15 }}></span>
                               <p style={{fontSize:13,color:whiteColor }}>Photo Name: { photo.photoNFTName }  {
                                 
                               }</p>
                               <p style={{fontSize:13 ,color:whiteColor}}>Price: { web3.utils.fromWei(`${photo.photoPrice}`, 'ether') } ETH</p>
                               <p style={{fontSize:13,color:whiteColor }}>Owner: { photo.ownerAddress }</p>
                                <Button size={'medium'} width={1} value={ photo.photoNFT } onClick={this.buyPhotoNFT}> Buy </Button>

                               <span style={{ padding: "0px" }}></span>
                             </Card>
                        :
                            "" 
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
