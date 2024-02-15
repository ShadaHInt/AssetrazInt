import { useState } from "react";
import {
    IOtherSourceModalContext,
    OtherSourceModalContextProvider,
} from "../../../Contexts/OtherSourceModalContext";
import { OtherSourceInventoryProps } from "../../../types/OtherSourceInventory";

export const OtherSourceModalProvider = ({ children }: any) => {
    const [otherSourceDetail, setOtherSourceDetail] = useState<
        OtherSourceInventoryProps[]
    >([{}]);
    const otherSourceModalContextValue: IOtherSourceModalContext = {
        otherSourceDetail,
        setOtherSourceDetail,
    };
    return (
        <OtherSourceModalContextProvider value={otherSourceModalContextValue}>
            {children}
        </OtherSourceModalContextProvider>
    );
};
