import styled from "@emotion/styled";

export const ShadowBox = styled.div`
  background: var(--boxColor);
  box-shadow: 0 4px 24px rgba(214, 227, 224, 0.7);
  border-radius: 7px;
`

export const Button1 = styled.button`
  background: var(--accentColor);
  color:white;
  font-size: 15px;
  font-weight: 600;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  outline: none;
  border:none;
  &:hover {
    background: #277966;
    color: #DEDEDE;
    transition: 0.3s all ease-in-out;
  }
`;

export const Button2 = styled.button`
  background: var(--bgColor);
  color:var(--accentColor);
  font-size: 15px;
  font-weight: 600;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  outline: none;
  border:none;
  &:hover {
    background: #D9EBE4;
    color: #277966;
    transition: 0.3s all ease-in-out;
  }
`;

export const Button3 = styled.button`
  background: var(--heavyRed);
  color: #FFFFFF;
  font-size: 15px;
  font-weight: 600;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  outline: none;
  border:none;
  &:hover {
    background: #B73F46;
    color: #DEDEDE;
    transition: 0.3s all ease-in-out;
  }
`;

export const Button4 = styled.button`
  background: var(--lightRed);
  color: var(--heavyRed);
  font-size: 15px;
  font-weight: 600;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  outline: none;
  border:none;
  &:hover {
    background: #EADEDE;
    color: #CE3E46;
    transition: 0.3s all ease-in-out;
  }
`;