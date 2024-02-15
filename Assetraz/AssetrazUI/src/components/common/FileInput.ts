import { FontIcon } from "@fluentui/react";
import styled from "styled-components";

export const ContainerDiv = styled.div`
    display: flex;
`;

export const HiddenLabel = styled.label`
    cursor: pointer;
`;

export const HiddenInput = styled.input`
    display: none;
`;

export const StyledDiv = styled.div`
    border: 1px solid grey;
    border-radius: 2px;
    height: 26px;
    width: 200px;
    padding-left: 10px;
    display: flex;
`;

export const StyledSpan = styled.span`
    font-size: 12px;
    color: grey;
    padding-left: 3px;
`;

export const TextOverflow = styled.div`
    flex: 5;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    line-height: 26px;
`;

export const StyledFontIcon = styled(FontIcon)`
    font-size: 18px;
    margin-top: 4px;
    margin-right: 4px;
    color: var(--primary-blue);
    cursor: pointer;
`;

export const isValidFile = (
    uploadPolicyFileName: string,
    acceptableFormats = [".eml", ".pdf", ".jpeg", ".jpg", ".png"]
) => {
    const fileExtension = uploadPolicyFileName.toLowerCase().substr(
        uploadPolicyFileName.lastIndexOf(".")
    );
    return acceptableFormats.some((format) => fileExtension.endsWith(format));
};
