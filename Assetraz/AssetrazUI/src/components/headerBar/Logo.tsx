import { Image, IImageProps } from "@fluentui/react/lib/Image";
import logo from "../../assets/assetraz.png";

import { LogoContainer } from "./Logo.styles";
import { useNavigate } from "react-router-dom";
import { ActionButton } from "@fluentui/react";

const imageProps: Partial<IImageProps> = {
    src: logo,
    styles: (props) => ({
        root: { paddingTop: 4, paddingLeft: 0 },
    }),
};

const Logo = () => {
    const navigate = useNavigate();

    return (
        <>
            <LogoContainer>
                <ActionButton
                    onClick={() => navigate("/")}
                    styles={{
                        root: {
                            padding: 0,
                            marginLeft: 8,
                        },
                    }}
                >
                    <Image
                        {...imageProps}
                        style={{ height: "2rem" }}
                        alt="Assetraz logo"
                    />
                </ActionButton>
            </LogoContainer>
        </>
    );
};

export default Logo;
