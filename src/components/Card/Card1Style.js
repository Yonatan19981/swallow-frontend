import styled from "styled-components";

// For styling any nested component, Overlay use the styled method.
// This method works perfectly on all of your any third-party component, as long as they attach the passed className prop to a DOM element.
// Here an example: https://gist.github.com/Miniplop/80b042d1b44293329ef7332fd47b770c


export const Card1 = styled.div`
background-color: #010101;
  border-radius: 8px;
  border:1px solid #FFFFFF;
  padding: 0 0 24px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;
export const HotelPhoto = styled.div`
  height: 256px;
  background-size: cover;
  background-position: center;
    rgba(196, 196, 196, 1);
  margin-bottom: 40px;
  border-radius: 8px 8px 0px 0px;
  align-self: stretch;
`;
export const Heading = styled.p`
  width: 336px;
  font-family: "DM Serif Display";
  font-size: 24px;
  font-weight: 400;
  line-height: 25px;
  color: #FFFFFF;
  margin-bottom: 37px;
  margin-left: 24px;
  letter-spacing: 0.24px;
`;
export const Price = styled.p`
  text-align: right;
  margin-bottom: 55px;
  margin-left: 359px;
  font-family: "DM Serif Display";
  font-size: 18px;
  font-weight: 400;
  line-height: 25px;
  color: #FFFFFF;
`;
export const PriceEmphasis0 = styled.strong`
  font-family: "DM Serif Display";
  font-size: 48px;
  font-weight: 400;
  line-height: 25px;
  color: #FFFFFF;
  letter-spacing: 0.96px;
`;
export const Description = styled.p`
  max-width: 447px;
  width: calc(100% - 65px);
  font-family: "Open Sans";
  font-size: 16px;
  font-weight: 400;
  line-height: 25px;
  color: #FFFFFF;
  margin-bottom: 72px;
  margin-left: 24px;
`;
export const Button = styled.p`
height: 28.52px;
width: 176px;
font-family: "Open Sans";
font-size: 17px;
font-weight: 700;
line-height: 25px;
color:#FD6363;
display: flex;
text-align: center;
letter-spacing: 3.4px;

  &:hover {
    background-color: "#FD5050";
  }
  &:disabled {
    cursor: default;
    opacity: 0.7;
  }
`;
export const BuyButton = styled.div`
  background-color:#FD6363;
  border-radius: 8px;
  padding: 28.15px 144px 25.33px;
  display: flex;
  align-items: flex-start;
`;
export const Buy = styled.p`
  height: 28.52px;
  width: 176px;
  font-family: "Open Sans";
  font-size: 17px;
  font-weight: 700;
  line-height: 25px;
  color: #FFFFFF;
  display: flex;
  text-align: center;
  letter-spacing: 3.4px;
`;