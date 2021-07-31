import React from 'react';
import styles from './header.module.scss';
import getWeb3, { getGanacheWeb3, Web3 } from "../../utils/getWeb3";


const Header = () => (
    <div className={styles.header}>
        <nav id="menu" className="menu">
          <ul>

            <li><a href="/publish" className={styles.link}> Publish your tattoo </a></li>

            <li><a href="/my-photos" className={styles.link}> My Tattoos</a></li>

            {process.env.NODE_ENV !== 'photo_marketplace' && (
              <li><a href="/photo-marketplace" className={styles.link}> Tattoos for sale</a></li>
            )}
          </ul>
        </nav>
    </div>
)

export default Header;
