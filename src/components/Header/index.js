import React,{Component} from 'react';
import styles from './header.module.scss';
import getWeb3, { getGanacheWeb3, Web3 } from "../../utils/getWeb3";
import styled from "styled-components";
import Card from "../Card/Card.js";



const Button = styled.button`
  background-color: #FD6363;
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
    background-color: #FD5050;
  }
  &:disabled {
    cursor: default;
    opacity: 0.7;
  }
`;

const Title = styled.h1`
  font-size: 1em;
  text-align: center;
  color: white;!important;
  text-decoration:none;
  &:hover {
    text-decoration:underline;
  }
`;
class Header extends Component {
  render() {
    return (
    <div className={styles.header}>
        <nav id="menu" className="menu">
          <ul>
          <li><img src="./Swallow_logo.jpg" alt="bug" height={50} /></li>
          
            <li><Title as="a" href="/publish" className={styles.link}> CREATE YOUR NFT </Title></li>

            <li><Title as="a" href="/my-photos" className={styles.link}> MY COLLECTION</Title></li>

            {process.env.NODE_ENV !== 'photo_marketplace' && (
              <li>
                <Title as="a" href="/photo-marketplace" className={styles.link}>ART</Title></li>
            )}
          </ul>
          <ul className="navbar-nav px-3 text-white">
            
          {(this.props.network!="ropsten") && (
            <div className="row text-center text-monospace">
            <Card>
            <b>{this.props.network}</b>
                             
            </Card>
               
              
              &nbsp;
            </div>
          )}
          {!this.props.web3  &&(
            <div className="row text-center text-monospace">
              <Button
                type="submit"
                onClick={(e) => this.props.on(e)}
                className="btn btn-outline-success btn-sm"
                style={{ width: "150px", fontSize: "17px" }}
              >
                <b>Connect</b>
              </Button>
              &nbsp;
            </div>
          )} {this.props.web3 && (
            <div className="row text-center text-monospace">
              <Button
                type="submit"
                onClick={(e) => this.props.off(e)}
                className="btn btn-outline-danger btn-sm"
                style={{ width: "150px", fontSize: "17px" }}
              >
                Disconnect
              </Button>
              &nbsp;
            </div>
          )}
        </ul>
        </nav>
    </div>
)}
          }
export default Header;
