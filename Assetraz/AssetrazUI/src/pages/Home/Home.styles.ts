import styled from "styled-components";
import { Stack } from "@fluentui/react";
import {  IImageProps, ImageFit } from "@fluentui/react/lib/Image";
import ReplyBg from "../../assets/ReplyBg.jpg";

export const imageProps: IImageProps = {
  imageFit: ImageFit.cover,
  src: ReplyBg,
  styles: (props) => ({
      root: {
          img: {
              height: "calc(100vh - 50px)",
              padding: "0 16px",
              width: "80%",
          },
      },
  }),
};

export const ContainerDiv = styled(Stack)`
  position: relative;
`;

export const Card = styled.div`
  position: absolute;
  top: 40%;
  right: 5%;
  width: 30%;
  height: 200px;
  float: left;
  perspective: 500px;

  &:hover > div {
      transform: rotateY(180deg);
      transition: transform .5s;
  }
`;

export const Content = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;;
  transition: transform 1s;
  transform-style: preserve-3d;
`;

export const Front = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  background: white;
  color: var(--primary-blue);
  text-align: left;
  border-radius: 5px;
  backface-visibility: hidden;
  padding-left: 30px;
`;

export const Back = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  color: var(--white);
  font-size: 18px;
  border-radius: 5px;
  text-align: center;
  backface-visibility: hidden;
  background: var(--nuetral-blue);
  transform: rotateY( 180deg );
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Title = styled.p`
  font-weight: var(--font-weight-semibold);
  font-size: 24px;
  color: var(--primary-text-black);
`;

export const Description = styled.p`
  font-size: 18px;
  font-weight: var(--font-weight-regular);
  color: var(--primary-text-black);
  font-style: italic;
  color: var(--primary-blue);
`;

export const SignInInfo = styled.p`
  
`;




