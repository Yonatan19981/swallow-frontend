import React from "react";
import {
  Card1,
  HotelPhoto,
  Heading,
  Price,
  PriceEmphasis0,
  Description,
  Button,
  BuyButton,
  Buy
} from "./Card1Style.js";

const Card1Component = (props) => {
  return (
    <Card1>
      <HotelPhoto src={props.image}/>
      {props.name &&(
      <Heading>{props.name}</Heading>
      )}
      {props.price &&(
      <Price>
        <PriceEmphasis0>{props.price}</PriceEmphasis0>ETH
      </Price>
        )}
        {props.owner &&(
      <Description>
        {props.owner}
      </Description>
      )}
      {props.Description &&(
      <Description>
        {props.Description}
      </Description>
      )}
      <BuyButton>
      <Buy value={props.value}onClick={props.Click} >Buy</Buy>
    </BuyButton>
    </Card1>
  );
};

export default Card1Component;