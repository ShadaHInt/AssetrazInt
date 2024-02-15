import styled from "styled-components";

export const HiddenLabel = styled.label`
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  margin-top: 8px;
  line-height: 25px;
`;

export const TextOverflow = styled.div`
  flex: 5;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-weight: 400;
  line-height: 26px;
`;

export const StyledDiv = styled.div`
  border: 1px solid grey;
  border-radius: 2px;
  height: 30px;
  width: 210px;
  padding-left: 8px;
  display: flex;
`;
