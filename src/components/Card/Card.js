import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// nodejs library to set properties for components
import GridContainer from "../Grid/GridContainer.js";
import GridItem from "../Grid/GridItem.js";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons

// core components
import styles from "../../assets/jss/material-kit-pro-react/components/cardStyle.js";

const useStyles = makeStyles(styles);
export default function SectionCards(props) {
  const classes = useStyles();
  return (
    <div className={classNames(classes.section, classes.cardProfile)}>
      <div className={classes.container}>
        <GridContainer justify="center">
          <GridItem md={7} sm={7}>
            <div className={classes.imageContainer}>
              <img src={props.image} alt="" />
            </div>
          </GridItem>
          <GridItem md={4} sm={5} className={classes.mlAuto}>
          <div className={classes.sectionDescription}>

          {props.description &&(
            <div className={classes.sectionDescription}>
              <h3 className={classes.title}>{props.title}</h3>
              <h6 className={classes.description}>
              {props.descriptionHeader}
              </h6>
              <h5 className={classes.description}>
              {props.description}

              </h5>  
               </div>
              )}
              {props.name &&(
              <div className={classes.sectionDescription}>
              <h6 className={classes.description}>
              "ART NAME"
              </h6>
              <h5 className={classes.description}>
              {props.name}
              </h5>  
              </div>
              )}

              {props.price &&(
              <div className={classes.sectionDescription}>
              <h6 className={classes.description}>
              "Price"
              </h6>
              <h5 className={classes.description}>
              {props.price}
              </h5>  
              </div>
              )}

              {props.owner &&(
              <div className={classes.sectionDescription}>
              <h6 className={classes.description}>
              "Owner"
              </h6>
              <h5 className={classes.description}>
              {props.owner}
              </h5>  
              </div>
              )}    

            </div>
          </GridItem>
        </GridContainer>
      </div>
    </div>
  );
}
