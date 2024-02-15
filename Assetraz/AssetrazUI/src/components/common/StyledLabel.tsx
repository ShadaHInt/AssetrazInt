import React from "react";
import { FC } from "react";
import { Label } from "@fluentui/react";

interface Props {
    text: string;
    isMandatory: boolean;
}

const StyledLabel: FC<Props> = (props) => {
    const { text, isMandatory } = props;
    return (
        <Label style={{ margin: "15px 10px 0px 0px", display: "flex" }}>
            {text}
            {isMandatory ? (
                <span
                    style={{
                        color: "darkred",
                        paddingLeft: "4px",
                    }}
                >
                    *
                </span>
            ) : (
                ""
            )}
        </Label>
    );
};

export default StyledLabel;
