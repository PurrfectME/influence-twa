import styled from "styled-components";
import img from '../../images/img.jpeg';

export const Card = styled.div`
  padding: 18px 20px;
  border-radius: 25px;
  background-color: white;

  @media (prefers-color-scheme: dark) {
    background-color: #111;
  }
`;

export const FlexBoxRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
`;

export const FlexBoxCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const FundItemBox = styled.div`
  max-width: 300px;
  max-height: 500px;
  height: 250px;
  width: 150px;
  border-radius: 25px;
  background-color: white;

  @media (prefers-color-scheme: dark) {
    background-color: #111;
  }
`

export const ImageBox = styled.div`
  max-width: 300px;
  max-height: 300px;
  width: inherit;
  height: 150px;
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;

  background-image: url(${img});
  background-size: cover;
`

export const Button = styled.button`
  background-color: ${(props) =>
    props.disabled ? "#6e6e6e" : "var(--tg-theme-button-color)"};
  border: 0;
  border-radius: 8px;
  padding: 10px 20px;
  color: var(--tg-theme-button-text-color);
  font-weight: 700;
  cursor: pointer;
  pointer-events: ${(props) => (props.disabled ? "none" : "inherit")};
`;

export const Ellipsis = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

export const Input = styled("input")`
  padding: 10px 20px;
  border-radius: 10px;
  width: 100%;
  border: 1px solid #c2c2c2;

  @media (prefers-color-scheme: dark) {
    border: 1px solid #fefefe;
  }
`;
