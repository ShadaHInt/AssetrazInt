import styled from "styled-components";
import { Stack } from "@fluentui/react";
import { Separator } from "@fluentui/react/lib/Separator";

export const ContainerDiv = styled.div`
    height: 48px;
    width: 100%;
    background-color: var(--white);
    line-height: 48px;
    color: var(--primary-text-black);
`;

export const LogoContainer = styled(Stack)`
    flex-direction: row;
`;

export const StyledSeperator = styled(Separator)`
    font-size: 20px;
    padding: 0;
    line-height: 48px;
`;
