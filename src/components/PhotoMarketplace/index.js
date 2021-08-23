import React, { Component } from "react";
import getWeb3, { Web3 } from "../../utils/getWeb3";

import { Loader, Input, Table, Form, Field } from 'rimble-ui';
import { zeppelinSolidityHotLoaderOptions } from '../../webpack';
import styled from "styled-components";
import CardBody from "../Card/CardBody.js";
import CardHeader from "../Card/CardHeader.js";
import styles from '../../App.module.scss';
import { whiteColor } from "../../assets/jss/material-kit-pro-react";
import GridContainer from "../Grid/GridContainer.js";
import GridItem from "../Grid/GridItem.js";
import { Card,Image } from 'semantic-ui-react'
import { StyledCardOption } from "../Card/StylesCard";
import { Button } from "../Button/RegularButton";
import Grid from '@material-ui/core/Grid';


const address = require('../../Addresses');





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
    const accounts = this.props.accounts;
    const balance = this.props.balance;
    const photoNFTMarketPlace = this.props.PhotoNFTMarketplace;
    const photoNFTData = this.props.photoNFTData;
    const allPhotos = this.props.allPhotos;

    console.log('=== value of buyPhotoNFT ===', e.target.value);

    const PHOTO_NFT = e.target.value;
    //const PHOTO_NFT = valuePhotoNFTAddress;
    //this.setState({ valuePhotoNFTAddress: "" });

    /// Get instance by using created photoNFT address
    let PhotoNFT = {};
    PhotoNFT = require("../../contracts/PhotoNFT.json");
    let photoNFT = new web3.eth.Contract(PhotoNFT.abi, PHOTO_NFT);
    console.log("====photo NFT address====", PHOTO_NFT)

    console.log("====photo id====", 1)
    /// Check owner of photoId
    const photoId = 1;  /// [Note]: PhotoID is always 1. Because each photoNFT is unique.
    console.log("====photo NFT====", photoNFT)
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

  renderPhoto = (photo, key) => {
    const web3 = this.props.web3;
    if (!web3 || !this.props.accounts) return null;

    const currentAccount = this.props.accounts[0];
    if (!currentAccount || photo.status !== "Open") return null;

    return (
      <Grid item justifyContent="center" xs={3}>
        <StyledCardOption raised>
          <Card.Content>
            <Image size="medium" 

              src={`https://ipfs.io/ipfs/${photo.ipfsHashOfPhoto}`}
            />
            <Card.Header>ART: {photo.photoNFTName} </Card.Header>
            <Card.Meta>PRICE: {web3.utils.fromWei(`${photo.photoPrice}`, 'ether')} ETH</Card.Meta>
            <Card.Description>OWNER:
              {photo.ownerAddress}
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            <div className='ui one buttons'>
              <Button value={photo.photoNFT} onClick={this.buyPhotoNFT}> Buy </Button>
            </div>
          </Card.Content>
        </StyledCardOption>
      </Grid>
    );
  }

  renderAllPhotos = (photo, key) => {
    const allPhotos = this.props.allPhotos;
    if (!allPhotos) return 'Please connect to ropsten network';
    return (
      <Grid justifyContent="center" container spacing={6}>
        {allPhotos.map((photo, i) => this.renderPhoto(photo, i))}
      </Grid>
    );
  }

  render() {
    console.log(this.props.allPhotos);
    const accounts = this.props.accounts;
    let web3 = null;
    let balance = null;
    let photoNFTMarketPlace = null;
    let photoNFTData = null;
    // let currentAccount = null;
    let allPhotos = null;
    if (accounts) {
      web3 = this.props.web3;
      balance = this.props.balance;
      photoNFTMarketPlace = this.props.PhotoNFTMarketplace;
      photoNFTData = this.props.PhotoNFTData;
      // currentAccount = this.props.accounts[0];
      allPhotos = this.props.allPhotos;
    }
    console.log("allPhotos is:", allPhotos);
    console.log("web3 instande is:", web3);

    return (
      <div className={styles.contracts} style={{ color: 'white' }}>
        <h2>ART</h2>
        {this.renderAllPhotos()}

        <style></style>
      </div>
    );
  }
};
