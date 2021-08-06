import React from 'react';
import styles from './header.module.scss';
import getWeb3, { getGanacheWeb3, Web3 } from "../../utils/getWeb3";
import styled from "styled-components";

const Title = styled.h1`
  font-size: 1em;
  text-align: center;
  color: white;!important;
  text-decoration:none;
  &:hover {
    text-decoration:underline;
  }
`;
const Header = () => (
    <div className={styles.header}>
        <nav id="menu" className="menu">
          <ul>

            <li><Title as="a" href="/publish" className={styles.link}> CREATE YOUR NFT </Title></li>

            <li><Title as="a" href="/my-photos" className={styles.link}> MY COLLECTION</Title></li>

            {process.env.NODE_ENV !== 'photo_marketplace' && (
              <li>
                <Title as="a" href="/photo-marketplace" className={styles.link}>ART</Title></li>
            )}
          </ul>
        </nav>
    </div>
)

export default Header;
